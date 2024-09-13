import { describe, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from "supertest";
import app from "../../src/app";
import { createConnection } from "typeorm";
import { databaseConfig } from "../../src/database";

let connection;
const req = request(app);
let token;

beforeAll(async () => {
  connection = await createConnection(databaseConfig);
  const res = await req
    .post("/auth/login")
    .send({ email: "string", password: "string" });
  token = res.body.token;
});

afterAll(() => {
  connection.close();
});

describe("/picks", () => {
  describe("GET / - 픽 리스트 가져오기", () => {
    test("파라미터 없이 요청", async () => {
      const res = await req
        .get("/picks")
        .set("Authorization", token)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test("page = 'asdf'", async () => {
      const res = await req
        .get("/picks")
        .set("Authorization", token)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test("page = 1", async () => {
      const res = await req
        .get("/picks")
        .set("Authorization", token)
        .query({ page: 1 })
        .expect(200);
      expect(res.body).toHaveProperty("next");
      expect(res.body).toHaveProperty("total");
      expect(res.body).toHaveProperty("list");
    });
  });

  describe("/picks/:id - 픽 상세", () => {
    test("요청 성공", async () => {
      await req.get("/picks/1").set("Authorization", token).expect(200);
    });

    test("없는 픽 요청", async () => {
      await req.get("/picks/asdf").set("Authorization", token).expect(400);
    });
  });
});
