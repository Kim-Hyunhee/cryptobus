import { Bot } from "../entity";
import "reflect-metadata";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt";

const BotService = {
  getBot: async ({ name, password }: { name: string; password: string }) => {
    const bot = await getRepository(Bot).findOne({ name });
    if (!bot) {
      return false;
    }
    const hashedPW = await bcrypt.hash(password, bot.salt);

    if (bot.password !== hashedPW) {
      return false;
    }

    return bot;
  },
};
export default BotService;
