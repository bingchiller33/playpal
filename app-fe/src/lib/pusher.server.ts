import Pusher from "pusher";
import * as env from "@/utils/env";
import PushNotifications from "@pusher/push-notifications-server";
import {
    EVENT_FILTER_UPDATED,
    EVENT_QUEUE_WAIT_TIME_UPDATED,
    EVENT_SQUAD_MATCHED,
    EVENT_USER_NOTIFICATION,
} from "./pusher.common";
import Notifications from "@/models/notificationModel";

export const pusherServer = new Pusher({
    appId: env.PUSHER_APP_ID,
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    key: env.NEXT_PUBLIC_PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    useTLS: true,
});
export const beamServer = new PushNotifications({
    instanceId: env.NEXT_PUBLIC_PUSHER_INSTANCE_ID,
    secretKey: env.PUSHER_BEAM_SECRET,
});

export interface SendNotificationOptions {
    title: string;
    content: string;
    user: string;
    img?: string;
    href?: string;
    saveHistory?: boolean;
    tag?: string;
    data?: object;
}

export async function sendNotification({
    title,
    content,
    user,
    img,
    href,
    tag,
    saveHistory,
    data,
}: SendNotificationOptions) {
    await pusherServer.trigger(`user.${user}`, EVENT_USER_NOTIFICATION, {
        title,
        content,
        user,
        img,
        tag,
        href,
        data,
    });

    beamServer.publishToUsers([user], {
        web: {
            notification: {
                title,
                body: content,
                deep_link: href,
                icon: img,
            },
            data: { tag, data },
        },
    });

    if (saveHistory) {
        await Notifications.create({
            title,
            content,
            img,
            tag,
            data: JSON.stringify(data),
            href,
            owner: user,
        });
    }
}

export async function notifySquadFilterUpdated(squadId: string) {
    await pusherServer.trigger(`squad.${squadId}`, EVENT_FILTER_UPDATED, {});
}

export async function queueWaitTimeUpdated(squadId: string, contactAt: Date) {
    await pusherServer.trigger(
        `squad.${squadId}`,
        EVENT_QUEUE_WAIT_TIME_UPDATED,
        {
            contactAt,
        }
    );
}

export async function squadMatched(squadA: string, squadB: string) {
    const a = pusherServer.trigger(`squad.${squadA}`, EVENT_SQUAD_MATCHED, {
        other: squadB,
    });

    const b = pusherServer.trigger(`squad.${squadB}`, EVENT_SQUAD_MATCHED, {
        other: squadA,
    });

    await Promise.all([a, b]);
}
