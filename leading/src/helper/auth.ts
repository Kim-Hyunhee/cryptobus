import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import * as jwt from "jsonwebtoken";
const algorithm = "aes-256-cbc";
const iv = "";

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, jwtSecretKey);
    res.locals.decoded = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(419).send({ message: "토큰 만료" });
    } else {
      return res.status(401).send({ message: "토큰이 유효하지 않습니다." });
    }
  }
};

export const encryptString = async (encryptString: string) => {
  try {
    const cipher = crypto.createCipheriv(algorithm, privateKey, iv);

    let encrypted = cipher.update(encryptString, "utf8", "base64");
    encrypted += cipher.final("base64");

    return encrypted;
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const decryptString = async (decryptString: string) => {
  try {
    const decipher = crypto.createDecipheriv(algorithm, privateKey, iv);

    let decrypted = decipher.update(decryptString, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.log(error);

    return false;
  }
};
