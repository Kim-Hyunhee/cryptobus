import { Request, Response } from "express";
import upbitApi from "../apis/upbit";

export const postOrder = async (req: Request, res: Response) => {
  const { market, accessKey, secretKey, side, volume, price, ord_type } =
    req.body;

  const order = await upbitApi.postOrder({
    market,
    accessKey,
    secretKey,
    side,
    volume,
    price,
    ord_type,
  });
  if (!order) {
    return res.status(400).send({ message: order.error });
  }

  return res.send(order);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const { accessKey, secretKey, uuid } = req.body;

  const deleteOrder = await upbitApi.deleteOrder({
    accessKey,
    secretKey,
    uuid,
  });
  if (!deleteOrder) {
    return res.status(400).send({ message: "주문 취소를 실패했습니다." });
  }

  return res.send(true);
};
