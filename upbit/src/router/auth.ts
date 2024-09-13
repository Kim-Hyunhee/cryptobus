import { getUpbitAccount } from "../controller/auth";
import express from "express";

const router = express.Router();

router.post("/balance", getUpbitAccount);

export const authRouter = router;
