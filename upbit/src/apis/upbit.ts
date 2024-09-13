import axios from "axios";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import querystring from "querystring";

const instance = axios.create({
  baseURL: "https://api.upbit.com/v1",
});

const api = {
  postOrder: async ({
    market,
    accessKey,
    secretKey,
    side,
    volume,
    price,
    ord_type,
  }: {
    market: string;
    accessKey: string;
    secretKey: string;
    side: string;
    volume: string;
    price: string;
    ord_type: string;
  }) => {
    const body = { market, side, volume, price, ord_type };
    const query = querystring.encode(body);
    const hash = crypto.createHash("sha512");
    const queryHash = hash.update(query, "utf-8").digest("hex");

    const payload = {
      access_key: accessKey,
      nonce: v4(),
      query_hash: queryHash,
      query_hash_alg: "SHA512",
    };
    const token = jwt.sign(payload, secretKey);

    try {
      const { data } = await instance.post("/orders", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    } catch (error) {
      console.log(error.response.data);
      return false;
    }
  },

  deleteOrder: async ({
    uuid,
    accessKey,
    secretKey,
  }: {
    uuid: string;
    accessKey: string;
    secretKey: string;
  }) => {
    const body = {
      uuid,
    };
    const query = querystring.encode(body);
    const hash = crypto.createHash("sha512");
    const queryHash = hash.update(query, "utf-8").digest("hex");

    const payload = {
      access_key: accessKey,
      nonce: v4(),
      query_hash: queryHash,
      query_hash_alg: "SHA512",
    };
    const token = jwt.sign(payload, secretKey);
    try {
      const { data } = await instance.delete("/order?" + query, {
        headers: { Authorization: `Bearer ${token}` },
        data: { body },
      });

      return data;
    } catch (error) {
      console.log(error.response);
      return false;
    }
  },

  getAccount: async ({
    accessKey,
    secretKey,
  }: {
    accessKey: string;
    secretKey: string;
  }) => {
    const payload = {
      access_key: accessKey,
      nonce: v4(),
    };

    const token = jwt.sign(payload, secretKey);
    try {
      const { data } = await instance.get("/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    } catch (error) {
      console.log(error.response);
      return false;
    }
  },
};

export default api;
