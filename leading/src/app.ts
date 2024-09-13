import express from "express";
import "express-async-errors";
import cors from "cors";
import logger from "morgan";
import "reflect-metadata";

import {
  authRouter,
  pickRouter,
  tradeRouter,
  pickGroupRouter,
  coinRouter,
} from "./router";

const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use((err, req, res, next) => {
  res.status(500);
  res.json({ message: err.message });

  next(err);
});
app.get("/", (req: any, res: any) => {
  res.send("HELLO~ COIN-LEADING");
});

app.use("/auth", authRouter);
app.use("/picks", pickRouter);
app.use("/trades", tradeRouter);
app.use("/pickGroups", pickGroupRouter);
app.use("/coins", coinRouter);

export default app;
