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

describe("/coins", () => {
  test("/coin - 코인 리스트 가져오기", async () => {
    const res = await req.get("/coins").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
