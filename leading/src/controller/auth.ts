import { Request, Response } from "express";
import idealFarmApi from "../apis/idealFarm";
import upbitApi from "../apis/upbit";
import { jwtSecretKey } from "../helper/auth";
import jwt from "jsonwebtoken";
import UserService from "../service/auth";
import { decryptString, encryptString } from "../helper/auth";

export const postUserLogIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const loginData = await idealFarmApi.logIn({ email, password });
  if (!loginData) {
    return res.status(400).send({ message: "로그인 실패" });
  }
  const { token: idealFarmJwt } = loginData;

  const base64Payload = idealFarmJwt.split(".")[1];
  const payLoad = Buffer.from(base64Payload, "base64");
  const idealFarmUserId = JSON.parse(payLoad.toString()).userId;

  let user = await UserService.getUser({ idealFarmUserId });
  if (!user) {
    user = await idealFarmApi.getUserInfo({
      idealFarmJwt: idealFarmJwt,
    });

    await UserService.postUser({
      idealFarmUserId: user.id,
      name: user.name,
      email: user.email,
    });
  }

  const userId = user.id;
  const payload = { userId };
  const token = jwt.sign(payload, jwtSecretKey);

  return res.send({ token });
};

export const patchUserIsAuto = async (req: Request, res: Response) => {
  const { isAuto } = req.body;

  await UserService.patchUserIsAuto({
    userId: res.locals.decoded.userId,
    isAuto,
  });

  return res.send(true);
};

export const patchUserOpneAPI = async (req: Request, res: Response) => {
  const { accessKey, secretKey } = req.body;

  const accounts = await upbitApi.getAccount({
    accessKey,
    secretKey,
  });
  if (!accounts) {
    return res.status(400).send({ message: "키를 다시 확인해주세요." });
  }

  const encryptedAccessKey = await encryptString(accessKey);
  const encryptedSecretKey = await encryptString(secretKey);
  if (!encryptedAccessKey || !encryptedSecretKey) {
    return res.send(false);
  }

  await UserService.patchUserOpenAPI({
    userId: res.locals.decoded.userId,
    accessKey: encryptedAccessKey,
    secretKey: encryptedSecretKey,
  });

  return res.send(true);
};

export const getUserInfo = async (req: Request, res: Response) => {
  const user = await UserService.getUser({ userId: res.locals.decoded.userId });

  if (!user) {
    return res.status(400).send(false);
  }
  return res.send({ user });
};

export const getUpbitAccount = async (req: Request, res: Response) => {
  const user = await UserService.getUser({ userId: res.locals.decoded.userId });

  const { accessKey, secretKey } = user;
  if (!accessKey || !secretKey) {
    return res
      .status(412)
      .send({ message: "openAPI 등록이 되어 있지 않습니다." });
  }
  const decryptedAccessKey = await decryptString(accessKey);
  const decryptedSecretKey = await decryptString(secretKey);
  if (!decryptedAccessKey || !decryptedSecretKey) {
    return res.send(false);
  }

  const accounts = await upbitApi.getAccount({
    accessKey: decryptedAccessKey,
    secretKey: decryptedSecretKey,
  });
  if (!accounts) {
    return res.status(400).send({ message: "IP를 허용해주세요." });
  }

  return res.send(accounts);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { password } = req.body;

  const user = await UserService.getUser({ userId: res.locals.decoded.userId });

  const loginData = await idealFarmApi.logIn({ email: user.email, password });
  if (!loginData) {
    return res.status(400).send({ message: "비밀번호를 다시 확인해주세요." });
  }
  const { token } = loginData;
  await idealFarmApi.deleteUser({ idealFarmJwt: token });

  await UserService.deleteUser({ userId: res.locals.decoded.userId });

  return res.send(true);
};

export const patchFcmToken = async (req: Request, res: Response) => {
  const { fcmToken } = req.body;
  const userId = res.locals.decoded.userId;

  await UserService.patchFcmToken({ fcmToken, userId });

  return res.send(true);
};
