"use server";

import dbConnect from "@/lib/mongoConnect";
import { sendNotification } from "@/lib/pusher.server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import * as env from "@/utils/env";

export async function sendFriendRequestNotification(receiverId: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth/login");
        return;
    }

    await dbConnect();
    sendNotification({
        title: "Friend Request",
        content: `${session.user.username} has sent you a friend request.`,
        href: `${env.HOST}/profile/${session.user.id}`,
        user: receiverId,
        saveHistory: true,
    });
}
