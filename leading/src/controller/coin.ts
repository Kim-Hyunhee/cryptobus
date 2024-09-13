import { Request, Response } from "express";
import CoinService from "../service/coin";

export const getCoins = async (req: Request, res: Response) => {
  const coins = await CoinService.getCoins();

  return res.send(coins);
};
