import admin from "firebase-admin";
const serviceAccount = require("../../if-coin-leading-firebase-adminsdk-ifvp7-83edbabfb5.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

export const sendPushNotification = async (message) => {
  try {
    await admin.messaging().send(message);
  } catch (error) {
    console.log("Error sending message:", error);
  }
};
