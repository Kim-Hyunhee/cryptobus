import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8009",
});

const api = {
  createTrade: async ({
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
    try {
      const { data } = await instance.post("/orders", {
        market,
        accessKey,
        secretKey,
        side,
        volume,
        price,
        ord_type,
      });
      if (!data) {
        return false;
      }
      return data;
    } catch (error) {
      console.log(error.response.data);
      return false;
    }
  },

  deleteTrade: async ({
    accessKey,
    secretKey,
    uuid,
  }: {
    accessKey: string;
    secretKey: string;
    uuid: string;
  }) => {
    try {
      const { data } = await instance.delete("/orders", {
        data: { accessKey, secretKey, uuid },
      });
      if (!data) {
        return false;
      }
      return data;
    } catch (error) {
      console.log(error.response.data);
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
    try {
      const { data } = await instance.post("/auth/balance", {
        accessKey,
        secretKey,
      });
      return data;
    } catch (error) {
      console.log(error.response.data);
      return false;
    }
  },
};

export default api;
