import { PickGroup, Bot, Coin } from "../entity";
import "reflect-metadata";
import { getRepository } from "typeorm";
import TradeService from "./trade";

const PickGroupService = {
  getPickGroup: async ({
    pickGroupId,
    serialNumber,
  }: {
    pickGroupId?: number;
    serialNumber?: string;
  }) => {
    const onePickGroup = getRepository(PickGroup)
      .createQueryBuilder("pickGroup")
      .leftJoinAndSelect("pickGroup.coin", "coin")
      .leftJoinAndSelect("pickGroup.picks", "pick")
      .leftJoinAndSelect("pick.trades", "trade")
      .leftJoin("trade.user", "user")
      .addSelect(["user.id"])
      .where("1=1");

    if (pickGroupId) {
      onePickGroup.andWhere("pickGroup.id = :pickGroupId", { pickGroupId });
    } else if (serialNumber) {
      onePickGroup.andWhere("pickGroup.serialNumber = :serialNumber", {
        serialNumber,
      });
    }

    const pickGroup = await onePickGroup
      .orderBy("pickGroup.createdAt", "DESC")
      .getOne();

    return pickGroup;
  },

  postPickGroup: async ({
    coin,
    bot,
    serialNumber,
  }: {
    coin: Coin;
    bot: Bot;
    serialNumber: string;
  }) => {
    const pickGroup = new PickGroup();
    pickGroup.bot = bot;
    pickGroup.coin = coin;
    pickGroup.serialNumber = serialNumber;

    const pickGroupId = await PickGroup.save(pickGroup);

    return pickGroupId;
  },

  getPickGroups: async ({
    userId,
    page,
  }: {
    userId?: number;
    page: number;
  }) => {
    const COUNT = 20;

    const trades = await TradeService.getTrades({ userId });

    const pickGroupIds = await PickGroup.find();

    const pickGroup = getRepository(PickGroup)
      .createQueryBuilder("pickGroup")
      .leftJoinAndSelect("pickGroup.coin", "coin")
      .leftJoinAndSelect("pickGroup.picks", "pick");

    if (trades.length > 0) {
      pickGroup
        .leftJoinAndSelect("pick.trades", "trade")
        .where("trade.userId = :userId", { userId });
    }
    if (pickGroupIds.length > 0) {
      pickGroup.where("pickGroup.id IN (:id)", {
        id: pickGroupIds.map(({ id }) => id),
      });
    }
    const [pickGroups, total] = await pickGroup
      .skip((page - 1) * COUNT)
      .take(COUNT)
      .orderBy("pickGroup.createdAt", "DESC")
      .getManyAndCount();

    const list = pickGroups.map((pickGroup) => {
      const bidUnitPrice = +pickGroup.picks.find((pick) => pick.side === "bid")
        ?.price;

      const askUnitPrice =
        parseInt(
          pickGroup.picks
            .filter((pick) => {
              return pick.state === "done" && pick.side === "ask";
            })
            .at(-1)
            ?.price.replace(/,/g, "")
        ) || 0;

      const earningRate = (
        ((askUnitPrice - bidUnitPrice) / bidUnitPrice) *
        100
      ).toFixed(2);

      return { ...pickGroup, bidUnitPrice, askUnitPrice, earningRate };
    });

    const next = total - COUNT * +page < 0 ? null : +page + 1;

    return { list, total, next } as const;
  },
};
export default PickGroupService;
