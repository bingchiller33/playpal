"use client";
import { useSquadMatched, useSquadMerged } from "@/lib/usePusherEvents";
import { revalidateFilters } from "./SquadFilter.server";
import { useRouter } from "next/navigation";

const TabRequestEventWatcher = ({ id }: { id: string }) => {
    const router = useRouter();

    useSquadMatched(id, async () => {
        await revalidateFilters(id, "chat");
    });

    useSquadMerged(id, async (from, to) => {
        if (from === id) {
            router.push(`/squad/${to}/chat`);
        } else {
            revalidateFilters(id, "chat");
        }
    });

    return <></>;
};

export default TabRequestEventWatcher;
