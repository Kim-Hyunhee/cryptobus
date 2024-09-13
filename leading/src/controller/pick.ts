import { Request, Response } from "express";
import BotService from "../service/bot";
import CoinService from "../service/coin";
import PickService from "../service/pick";
import PickGroupService from "../service/pickGroup";
import NotiService from "../service/noti";
import TradeService from "../service/trade";

export const postPick = async (req: Request, res: Response) => {
  const {
    coinName,
    botName,
    password,
    serialNumber,
    state,
    volume,
    price,
    orderType,
    side,
    position,
  } = req.body;

  let coin = await CoinService.getCoin({ name: coinName });
  if (!coin) {
    return res.status(400).send({ message: "코인 이름을 다시 확인해주세요." });
  }

  const bot = await BotService.getBot({ name: botName, password });
  if (!bot) {
    return res.status(400).send({ message: "봇 정보가 없습니다." });
  }

  let pickGroup = await PickGroupService.getPickGroup({
    serialNumber,
  });
  if (!pickGroup) {
    pickGroup = await PickGroupService.postPickGroup({
      coin,
      bot,
      serialNumber,
    });
  }

  const pick = await PickService.postPick({
    state,
    side,
    volume,
    price,
    orderType,
    pickGroup,
    position,
  });

  if (!pick) {
    return res.status(400).send(false);
  }
  res.send(true);

  if (state === "order") {
    await TradeService.autoTrade({ pick });
  } else if (state === "cancel") {
    await TradeService.autoCancel({ pick });
  }

  await NotiService.sendNoti({ pick });

  return;
};

export const getPick = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(+id)) {
    return res.status(400).send({ message: "숫자로 입력해주세요." });
  }

  const pick = await PickService.getPick({ pickId: +id });

  if (!pick) {
    return res.status(400).send({ message: "pick id를 확인해주세요." });
  }

  const pickGroupId = pick.pickGroup.id;
  const pickGroup = await PickGroupService.getPickGroup({ pickGroupId });

  return res.send({ pick, pickGroup });
};

export const getPicks = async (req: Request, res: Response) => {
  const page = req.query.page as string;
  const userId = res.locals.decoded.userId;

  if (isNaN(+page) || page === "0") {
    const { list } = await PickService.getPicks({
      userId,
      page: 1,
    });
    return res.send(list);
  }

  const { list, total, next } = await PickService.getPicks({
    userId,
    page: +page,
  });

  return res.send({ next, total, list });
};
