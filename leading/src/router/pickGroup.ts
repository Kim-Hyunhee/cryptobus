import express from "express";
import { getPickGroups, getPickGroup } from "../controller/pickGroup";
import { checkToken } from "../helper/auth";

const router = express.Router();

router.get("/", checkToken, getPickGroups);
router.get("/:id", checkToken, getPickGroup);

export const pickGroupRouter = router;
