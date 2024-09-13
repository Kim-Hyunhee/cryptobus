import express from "express";
import {
  postUserLogIn,
  patchUserIsAuto,
  patchUserOpneAPI,
  getUserInfo,
  getUpbitAccount,
  deleteUser,
  patchFcmToken,
} from "../controller/auth";
import { checkToken } from "../helper/auth";
const router = express.Router();

router.post("/logIn", postUserLogIn);
router.patch("/isAuto", checkToken, patchUserIsAuto);
router.patch("/openAPI", checkToken, patchUserOpneAPI);
router.get("/info", checkToken, getUserInfo);
router.get("/balance", checkToken, getUpbitAccount);
router.delete("/", checkToken, deleteUser);
router.patch("/fcmToken", checkToken, patchFcmToken);

export const authRouter = router;
