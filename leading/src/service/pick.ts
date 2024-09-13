import { Pick, PickGroup } from "../entity";
import "reflect-metadata";
import { getRepository } from "typeorm";
import TradeService from "./trade";

const PickService = {
  postPick: async ({
    state,
    side,
    volume,
    price,
    orderType,
    pickGroup,
    position,
  }: {
    state: string;
    side: string;
    volume: string;
    price: string;
    orderType: string;
    pickGroup: PickGroup;
    position: string;
  }) => {
    const pick = new Pick();
    pick.state = state;
    pick.side = side;
    pick.volume = volume;
    pick.price = price;
    pick.orderType = orderType;
    pick.pickGroup = pickGroup;
    pick.position = position;

    const onePick = await Pick.save(pick);

    return onePick;
  },

  getPick: async ({ pickId }: { pickId?: number }) => {
    const onePick = getRepository(Pick)
      .createQueryBuilder("pick")
      .leftJoinAndSelect("pick.pickGroup", "pickGroup")
      .leftJoinAndSelect("pickGroup.coin", "coin");

    if (pickId) {
      onePick.where("pick.id = :pickId", { pickId });
    }

    const pick = await onePick.getOne();

    return pick;
  },

  getPicks: async ({ userId, page }: { userId: number; page?: number }) => {
    const COUNT = 20;

    const trades = await TradeService.getTrades({ userId });

    const pickIds = await Pick.find();

    const picks = getRepository(Pick)
      .createQueryBuilder("pick")
      .leftJoinAndSelect("pick.pickGroup", "pickGroup")
      .leftJoinAndSelect("pickGroup.coin", "coin");

    if (trades.length > 0) {
      picks
        .leftJoinAndSelect("pick.trades", "trade")
        .where("trade.userId = :userId", { userId });
    }
    if (pickIds.length > 0) {
      picks.andWhere("pick.id IN (:id)", {
        id: pickIds.map(({ id }) => id),
      });
    }

    const [list, total] = await picks
      .skip((page - 1) * COUNT)
      .take(COUNT)
      .orderBy("pick.createdAt", "DESC")
      .getManyAndCount();

    const next = total - COUNT * +page < 0 ? null : +page + 1;

    return { list, total, next } as const;
  },
};
export default PickService;
