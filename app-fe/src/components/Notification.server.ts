"use server";

import dbConnect from "@/lib/mongoConnect";
import Notifications from "@/models/notificationModel";
import { sessionOrLogin } from "@/utils/server";

export async function markAsRead(notificationId: string) {
    try {
        const session = await sessionOrLogin();
        await dbConnect();
        const n = await Notifications.findById(notificationId).exec();
        if (n?.owner.toString() === session.user.id) {
            await Notifications.updateOne(
                { _id: notificationId },
                { isRead: true }
            ).exec();
        }
    } catch (e) {
        return { success: false, msg: "Error: Please try again later" };
    }

    return { success: true };
}

export async function markAllAsRead() {
    try {
        const session = await sessionOrLogin();
        await dbConnect();
        await Notifications.updateMany(
            { owner: session.user.id },
            { isRead: true }
        ).exec();
        return { success: true };
    } catch (e) {
        return { success: false, msg: "Error: Please try again later" };
    }
}
