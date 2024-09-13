import { describe, test } from "@jest/globals";
import request from "supertest";
import app from "../../src/app";
const req = request(app);

describe("/", () => {
  test("/ - 서버 open 성공", async () => {
    await req.get("/").expect(200);
  });
});
