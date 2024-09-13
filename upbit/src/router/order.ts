import { postOrder, deleteOrder } from "../controller/order";
import express from "express";

const router = express.Router();

router.post("/", postOrder);
router.delete("/", deleteOrder);

export const tradeRouter = router;
