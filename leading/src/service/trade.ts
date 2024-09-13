import { Trade, Pick } from "../entity";
import "reflect-metadata";
import { getRepository } from "typeorm";
import UserService from "./auth";
import upbitApi from "../apis/upbit";
import { decryptString } from "../helper/auth";
import PickGroupService from "./pickGroup";
import { calculatePickPrice, calculateVolume } from "../helper/pick";

const TradeService = {
  createTrade: async ({
    userId,
    pick,
    amount,
    userPrice,
    type,
    uuid,
  }: {
    userId: number;
    pick: Pick;
    amount: string;
    userPrice?: string;
    type: string;
    uuid?: string;
  }) => {
    const user = await UserService.getUser({ userId });

    const trade = new Trade();
    trade.user = user;
    trade.pick = pick;
    trade.amount = amount;
    trade.userPrice = userPrice;
    trade.type = type;
    trade.uuid = uuid;

    await Trade.save(trade);
  },

  getTrades: async ({
    userId,
    pickGroupId,
  }: {
    userId: number;
    pickGroupId?: number;
  }) => {
    const trade = getRepository(Trade)
      .createQueryBuilder("trade")
      .leftJoin("trade.pick", "pick")
      .leftJoin("pick.pickGroup", "pickGroup")
      .where("userId = :userId", { userId });

    if (pickGroupId) {
      trade.andWhere("pickGroup.id = :pickGroupId", { pickGroupId });
    }

    const trades = await trade.getMany();

    return trades;
  },

  autoTrade: async ({ pick }: { pick: Pick }) => {
    const users = await UserService.getUsers({ isAuto: 1, isOpenApi: 1 });

    if (users.length > 0) {
      const promises = users.map(async ({ accessKey, secretKey, id }) => {
        const promise = async () => {
          const decryptedAccessKey = await decryptString(accessKey);
          const decryptedSecretKey = await decryptString(secretKey);
          if (!decryptedAccessKey || !decryptedSecretKey) {
            return false;
          }

          const balances = await upbitApi.getAccount({
            accessKey: decryptedAccessKey,
            secretKey: decryptedSecretKey,
          });
          if (!balances) {
            return false;
          }

          const currency = balances?.find((balance) => {
            const coinName = pick.pickGroup.coin.name;
            if (pick.side === "bid") {
              return balance.currency === "KRW";
            } else if (pick.side === "ask") {
              return balance.currency === coinName;
            }
          });
          if (!currency) {
            return false;
          }

          const volume = String(calculateVolume(pick, +currency.balance));

          const pickPrice = calculatePickPrice(+pick.price);
          if (!pickPrice) {
            return false;
          }
          const price = pick.orderType === "market" ? null : String(pickPrice);

          const order = await upbitApi.createTrade({
            market: "KRW-" + pick.pickGroup.coin.name,
            accessKey: decryptedAccessKey,
            secretKey: decryptedSecretKey,
            side: pick.side,
            volume,
            price,
            ord_type: pick.orderType,
          });
          if (!order) {
            return false;
          }

          await TradeService.createTrade({
            userId: id,
            pick,
            amount: volume,
            userPrice: String(+volume * +pick.price),
            type: "auto",
            uuid: order.uuid,
          });
        };
        return promise();
      });
      await Promise.allSettled(promises);
    }
  },

  autoCancel: async ({ pick }: { pick: Pick }) => {
    const users = await UserService.getUsers({ isAuto: 1, isOpenApi: 1 });

    if (users.length > 0) {
      const promises = users.map(async ({ accessKey, secretKey, id }) => {
        const promise = async () => {
          const decryptedAccessKey = await decryptString(accessKey);
          const decryptedSecretKey = await decryptString(secretKey);
          if (!decryptedAccessKey || !decryptedSecretKey) {
            return false;
          }

          const pickGroup = await PickGroupService.getPickGroup({
            serialNumber: pick.pickGroup.serialNumber,
          });
          const pickId = pickGroup?.picks.find((pick) => {
            return pick.state === "order";
          })?.id;

          const trade = await TradeService.getTrade({ pickId, userId: id });

          const cancel = await upbitApi.deleteTrade({
            accessKey: decryptedAccessKey,
            secretKey: decryptedSecretKey,
            uuid: trade?.uuid,
          });
          if (!cancel) {
            return false;
          }

          await TradeService.createTrade({
            userId: id,
            pick,
            amount: pick.volume,
            type: "auto",
          });
        };
        return promise();
      });
      await Promise.allSettled(promises);
    }
  },

  getTrade: async ({ pickId, userId }: { pickId: number; userId: number }) => {
    const trade = getRepository(Trade)
      .createQueryBuilder()
      .where("pickId = :pickId", { pickId })
      .andWhere("userId = :userId", { userId })
      .getOne();

    return trade;
  },
};
export default TradeService;
