import { useChannel, useEvent, usePusher } from "@harelpls/use-pusher";
import { EVENT_FILTER_UPDATED } from "./pusher.server";

export function useSquadFilterUpdates(squadId: string, cb: () => void) {
    const channel = useChannel(`squad.${squadId}`);
    useEvent(channel, EVENT_FILTER_UPDATED, cb);
}

export function useSquadMatched(squadId: string, cb: () => void) {}
