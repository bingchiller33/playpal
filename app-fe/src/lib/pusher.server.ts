import Pusher from "pusher";
import * as env from "@/utils/env";

export const EVENT_FILTER_UPDATED = "EVENT_FILTER_UPDATED";
export const EVENT_QUEUE_WAIT_TIME_UPDATED = "EVENT_QUEUE_WAIT_TIME_UPDATED";
export const EVENT_SQUAD_MATCHED = "EVENT_SQUAD_MATCHED";

export const pusherServer = new Pusher({
    appId: env.PUSHER_APP_ID,
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    key: env.NEXT_PUBLIC_PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    useTLS: true,
});

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
