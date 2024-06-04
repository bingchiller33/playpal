import Pusher from "pusher";
import * as env from "@/utils/env";

export const EVENT_FILTER_UPDATED = "EVENT_FILTER_UPDATED";

export const pusherServer = new Pusher({
    appId: env.PUSHER_APP_ID,
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    key: env.NEXT_PUBLIC_PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    useTLS: true,
});

export function notifySquadFilterUpdated(squadId: string) {
    pusherServer.trigger(`squad.${squadId}`, EVENT_FILTER_UPDATED, {});
}
