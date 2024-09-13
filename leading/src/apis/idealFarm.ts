import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.idealfarm.co.kr",
  withCredentials: true,
});

const api = {
  logIn: async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data } = await instance.post("/users/logIn", { email, password });
      return data;
    } catch (error) {
      return false;
    }
  },

  getUserInfo: async ({ idealFarmJwt }: { idealFarmJwt: string }) => {
    try {
      const { data } = await instance.get("/users/info", {
        headers: { Authorization: "bearer " + idealFarmJwt },
      });
      return data;
    } catch (error) {
      return false;
    }
  },

  deleteUser: async ({ idealFarmJwt }: { idealFarmJwt: string }) => {
    try {
      const { data } = await instance.delete("/users", {
        headers: { Authorization: "bearer " + idealFarmJwt },
      });
      return data;
    } catch (error) {
      return false;
    }
  },
};

export default api;
