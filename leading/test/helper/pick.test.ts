import { calculatePickPrice, calculateVolume } from "../../src/helper/pick";
import { describe, test, expect } from "@jest/globals";
import { Pick } from "../../src/entity";

describe("calculatePickPrice은", () => {
  test("2,000,000이상의 금액 계산", () => {
    const result = calculatePickPrice(2000000.123123);
    expect(result).toStrictEqual(2001000);
  });
  test("2,000,000미만 ~ 1,000,000이상 금액 계산", () => {
    const result = calculatePickPrice(1900000.123123);
    expect(result).toStrictEqual(1900500);
  });
  test("1,000,000미만 ~ 500,000이상 금액 계산", () => {
    const result = calculatePickPrice(900000.123123);
    expect(result).toStrictEqual(900100);
  });
  test("500,000미만 ~ 100,000이상 금액 계산", () => {
    const result = calculatePickPrice(490000.123123);
    expect(result).toStrictEqual(490050);
  });
  test("100,000미만 ~ 10,000이상 금액 계산", () => {
    const result = calculatePickPrice(10001);
    expect(result).toStrictEqual(10010);
  });
  test("10,000미만 ~ 1,000이상 금액 계산", () => {
    const result = calculatePickPrice(9000.123123);
    expect(result).toStrictEqual(9005);
  });
  test("범위에 없는 금액 계산", () => {
    const result = calculatePickPrice(999.99999999999);
    expect(result).toBe(false);
  });
});

describe("calculateVolume 테스트", () => {
  // orderType
  // - limit : 지정가 주문
  // - price : 시장가 주문(매수)
  // - market : 시장가 주문(매도)

  // side
  // - bid : 매수
  // - ask : 매도
  test("시장가 매수 -> null", () => {
    const pick = {
      orderType: "price",
      side: "bid",
      price: "222",
    } as Pick;

    const balance = 123456.123456789;
    // volume은 상관없이 입력한 price만큼 시장가로 구매된다
    const expectResult = null;

    const result = calculateVolume(pick, balance);
    expect(result).toBe(expectResult);
  });

  test("지정가 매수 -> 보유중인 현금의 25%", () => {
    const pick = {
      orderType: "limit",
      side: "bid",
      price: "222",
    } as Pick;

    // 보유중인 현금
    const balance = 123456;
    // 매수량 : (현금 / 가격) * 25%
    const expectResult = 139.02702702;

    const result = calculateVolume(pick, balance);
    expect(result).toBe(expectResult);
  });

  test("매도 -> 전량 매도", () => {
    const pick = {
      orderType: "market",
      side: "ask",
      price: "222",
    } as Pick;
    // 보유중인 코인 갯수
    const balance = 123456.123456789;
    // 전량 매도
    const expectResult = 123456.123456789;

    const result = calculateVolume(pick, balance);
    expect(result).toBe(expectResult);
  });
});
