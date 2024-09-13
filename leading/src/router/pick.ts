import express from "express";
import { postPick, getPick, getPicks } from "../controller/pick";
import { checkToken } from "../helper/auth";

const router = express.Router();

router.post("/", postPick);
router.get("/:id", getPick);
router.get("/", checkToken, getPicks);

export const pickRouter = router;
