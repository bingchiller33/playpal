"use server";
import { SendNotificationOptions, sendNotification } from "./pusher.server";

export async function sendNotificationServer(params: SendNotificationOptions) {
    await sendNotification(params);
}
