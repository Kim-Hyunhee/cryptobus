import express from "express";
import logger from "morgan";
import { authRouter } from "./router/auth";
import { tradeRouter } from "./router/order";

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use((err, req, res, next) => {
  res.status(500);
  res.json({ message: err.message });

  next(err);
});
app.get("/", (req: any, res: any) => {
  res.send("UPBIT CONNECT SERVER");
});

app.use("/auth", authRouter);
app.use("/orders", tradeRouter);

export default app;
