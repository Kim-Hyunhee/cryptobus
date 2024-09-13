import { Pick } from "../entity";
import UserService from "./auth";
import { sendPushNotification } from "../helper/fcm";

const NotiService = {
  sendNoti: async ({ pick }: { pick: Pick }) => {
    const users = await UserService.getUsers({ isFcmToken: 1 });

    const promises = users.map(async ({ fcmToken }) => {
      const promise = async () => {
        const coin = pick.pickGroup.coin.name;
        const sideName = pick.side === "bid" ? "매수" : "매도";
        const stateName =
          pick.state === "order"
            ? "진입"
            : pick.state === "done"
            ? "체결 완료"
            : "주문 취소";
        const message = {
          notification: {
            title: `[${sideName} ${stateName}] - ${coin}`,
            body: `가격: ${pick.price}, 비중: ${pick.volume}`,
          },
          data: {
            title: `[${sideName} ${stateName}] - ${coin}`,
            body: `가격: ${pick.price}, 비중: ${pick.volume}`,
            link: `cryptobus://picks/${pick.id}`,
          },
          token: fcmToken,
        };
        await sendPushNotification(message);
      };
      return promise();
    });
    await Promise.allSettled(promises);
  },
};
export default NotiService;
