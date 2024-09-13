import { Pick } from "../entity";

export const calculatePickPrice = (price: number) => {
  if (price >= 2000000) return Math.ceil(price / 1000) * 1000;

  if (price >= 1000000) return Math.ceil(price / 500) * 500;

  if (price >= 500000) return Math.ceil(price / 100) * 100;

  if (price >= 100000) return Math.ceil(price / 50) * 50;

  if (price >= 10000) return Math.ceil(price / 10) * 10;

  if (price >= 1000) return Math.ceil(price / 5) * 5;

  return false;
};

export const calculateVolume = (pick: Pick, balance: number) => {
  const { orderType, side, price } = pick;

  // pick의 orderType이 시장가 매수면 volume을 null으로
  if (orderType === "price") return null;

  // pick의 side가 매도면 본인 지갑에서 pick의 coinName 같은 currency 그대로 리턴(소수점 8자리라서)
  if (side === "ask") return balance;

  // pick의 side가 매수면 소수점 8자리까지만 들어가게 계산해서 리턴
  const tenPow = Math.pow(10, 8);
  return Math.floor((balance / +price) * 0.25 * tenPow) / tenPow;
};
