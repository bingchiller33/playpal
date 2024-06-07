"use server";

import dbConnect from "@/lib/mongoConnect";
import Notifications from "@/models/notificationModel";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { jsonStrip } from "@/utils";
import { sessionOrLogin } from "@/utils/server";
import { getServerSession } from "next-auth";

export async function getAll() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { success: true, data: [] };
        }

        await dbConnect();
        const data = jsonStrip(
            await Notifications.find({
                owner: session.user.id,
            })
                .sort({ createdAt: "desc" })
                .exec()
        );

        return { success: true, data };
    } catch (e) {
        return { success: false, msg: "Error: Please try again later" };
    }
}

export async function getUnread() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { success: true, data: [] };
        }

        await dbConnect();
        const data = jsonStrip(
            await Notifications.find({
                owner: session.user.id,
                isRead: false,
            })
                .sort({ createdAt: "desc" })
                .exec()
        );

        return { success: true, data };
    } catch (e) {
        return { success: false, msg: "Error: Please try again later" };
    }
}

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
