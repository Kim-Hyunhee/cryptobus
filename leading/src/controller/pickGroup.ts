import { Request, Response } from "express";
import PickGroupService from "../service/pickGroup";

export const getPickGroups = async (req: Request, res: Response) => {
  const page = req.query.page as string;

  if (isNaN(+page) || page === "0") {
    const { list } = await PickGroupService.getPickGroups({
      page: 1,
    });
    return res.send(list);
  }

  const { list, total, next } = await PickGroupService.getPickGroups({
    page: +page,
  });

  return res.send({ next, total, list });
};

export const getPickGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = res.locals.decoded.userId;

  if (isNaN(+id)) {
    return res.status(400).send({ message: "숫자로 입력해주세요." });
  }

  const pickGroup = await PickGroupService.getPickGroup({
    pickGroupId: +id,
  });
  if (!pickGroup) {
    return res.status(400).send({ message: "pickGroup Id를 확인하세요." });
  }

  const coinName = pickGroup.coin.name;
  const history = pickGroup.picks.map((pick) => {
    const trades = pick.trades.filter((trade) => {
      return trade.user.id === userId;
    });
    delete pick.trades;
    return { ...pick, trades };
  });

  return res.send({ coinName, history });
};
