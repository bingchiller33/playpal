import { useChannel, useEvent, usePusher } from "@harelpls/use-pusher";
import { EVENT_FILTER_UPDATED, EVENT_SQUAD_MATCHED } from "./pusher.server";
import { useCallback, useEffect, useState } from "react";
import { checkQueueTime } from "@/components/SquadFilter.server";
import { WithId } from "@/utils/types";
import { ISquad } from "@/models/squadModel";

export function useSquadFilterUpdates(squadId: string, cb: () => void) {
    const channel = useChannel(`squad.${squadId}`);
    useEvent(channel, EVENT_FILTER_UPDATED, cb);
}

export function useSquadMatched(squadId: string, cb: (other: string) => void) {
    const channel = useChannel(`squad.${squadId}`);
    useEvent(channel, EVENT_SQUAD_MATCHED, (data: any) => cb(data.other));
}

export function useMatchMaking(
    squad: WithId<ISquad>,
    cb: (other: string) => void
) {
    const [task, setTask] = useState<
        ReturnType<typeof setTimeout> | undefined
    >();

    const checkQueue = useCallback(async () => {
        if (!squad.joinQueue) {
            return;
        }

        const next = await checkQueueTime(squad._id.toString());
        if (task) {
            clearTimeout(task);
        }

        if (next.success && next.willMatchAt) {
            const time = +next.willMatchAt - Date.now();
            console.log("wma", next.willMatchAt, time);
            if (time < 0) {
                return;
            }
            const newTask = setTimeout(() => checkQueue(), time);
            setTask(newTask);
        }
    }, [squad, task]);

    useEffect(() => {
        checkQueue();
        return () => {
            task && clearTimeout(task);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [squad._id, squad.joinQueue]);

    useSquadMatched(squad._id.toString(), cb);
}
