import { Coin } from "../entity";
import "reflect-metadata";
import { getRepository } from "typeorm";

const CoinService = {
  postCoin: async ({ name }: { name: string }) => {
    const coin = new Coin();
    coin.name = name;

    const coinId = await Coin.save(coin);

    return coinId;
  },

  getCoin: async ({ name }: { name: string }) => {
    const coin = await getRepository(Coin)
      .createQueryBuilder()
      .where("name = :name", { name })
      .getOne();

    return coin;
  },

  getCoins: async () => {
    const coins = await getRepository(Coin).find();

    return coins;
  },
};
export default CoinService;
