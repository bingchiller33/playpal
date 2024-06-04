import { useChannel, useEvent, usePusher } from "@harelpls/use-pusher";
import { EVENT_FILTER_UPDATED } from "./pusher.server";

export function useSquadFilterUpdates(squadId: string, cb: () => void) {
    const channel = useChannel(`squad.${squadId}`);
    useEvent(channel, EVENT_FILTER_UPDATED, cb);

    // channel?.bind(EVENT_FILTER_UPDATED, cb);
    // const pusher = usePusher();
    // pusher.client?.channel(`squad.${squadId}`)?.bind(EVENT_FILTER_UPDATED, cb);
}
