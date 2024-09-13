import { Request, Response } from "express";
import upbitApi from "../apis/upbit";
import UserService from "../service/auth";
import PickService from "../service/pick";
import TradeService from "../service/trade";
import { decryptString } from "../helper/auth";

export const postTrade = async (req: Request, res: Response) => {
  const { pickId, amount, userPrice, type } = req.body;
  const userId = res.locals.decoded.userId;

  const pick = await PickService.getPick({ pickId });
  if (!pick) {
    return res.status(400).send({ message: "해당 pick은 존재하지 않습니다." });
  }

  const user = await UserService.getUser({ userId });
  const { accessKey, secretKey } = user;
  if (!accessKey || !secretKey) {
    return res
      .status(412)
      .send({ message: "openAPI 등록이 되어 있지 않습니다." });
  }
  const decryptedAccessKey = await decryptString(accessKey);
  const decryptedSecretKey = await decryptString(secretKey);
  if (!decryptedAccessKey || !decryptedSecretKey) {
    return res.send(false);
  }

  // 사용자 본인이 직접 주문할 때 시장가 매수(price)일 때는 volume을 null로 보내야함
  // 시장가 매도(market)일 때는 price를 null로 보내야함
  const volume = pick.orderType === "price" ? null : amount;
  const price = pick.orderType === "market" ? null : String(pick.price);

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
    return res
      .status(400)
      .send({ message: "최소주문금액 이상으로 주문해주세요." });
  }

  await TradeService.createTrade({
    userId,
    pick,
    amount: volume,
    userPrice,
    type,
    uuid: order.uuid,
  });

  return res.send(true);
};
