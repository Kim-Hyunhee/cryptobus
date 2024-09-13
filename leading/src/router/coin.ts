import express from "express";
import { getCoins } from "../controller/coin";

const router = express.Router();

router.get("/", getCoins);

export const coinRouter = router;
