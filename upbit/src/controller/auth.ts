import { Request, Response } from "express";
import upbitApi from "../apis/upbit";

export const getUpbitAccount = async (req: Request, res: Response) => {
  const { accessKey, secretKey } = req.body;

  const accounts = await upbitApi.getAccount({ accessKey, secretKey });

  return res.send(accounts);
};
