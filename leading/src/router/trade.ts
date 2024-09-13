import express from "express";
import { postTrade } from "../controller/trade";
import { checkToken } from "../helper/auth";

const router = express.Router();

router.post("/", checkToken, postTrade);

export const tradeRouter = router;
