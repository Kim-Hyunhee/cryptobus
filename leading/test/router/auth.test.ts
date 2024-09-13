import { describe, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from "supertest";
import app from "../../src/app";
import { createConnection } from "typeorm";
import { databaseConfig } from "../../src/database";

let connection;
const req = request(app);

beforeAll(async () => {
  connection = await createConnection(databaseConfig);
});

afterAll(() => {
  connection.close();
});

describe("/auth", () => {
  describe("POST /auth/login - 로그인", () => {
    test("로그인 성공", async () => {
      const res = await req
        .post("/auth/login")
        .send({ email: "string", password: "string" })
        .expect(200);
      expect(res.body).toHaveProperty("token");
    });

    test("로그인 실패", async () => {
      await req
        .post("/auth/login")
        .send({ email: "string1", password: "string1" })
        .expect(400);
    });
  });
});
