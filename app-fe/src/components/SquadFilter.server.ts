"use server";

import dbConnect from "@/lib/mongoConnect";
import { notifySquadFilterUpdated } from "@/lib/pusher.server";
import Squads from "@/models/squadModel";
import {
    enterQueue,
    exitQueue,
    squadToAlgoInput,
} from "@/repositories/squadRepository";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkQueueTime as repoCheckQueueTime } from "@/repositories/squadRepository";

export async function updateFilter(
    squadId: string,
    updates: Record<string, any>
) {
    try {
        await dbConnect();
        // Update
        const filter = { _id: squadId };
        const newFilter: any = {};
        for (const item in updates) {
            newFilter[`filter.${item}`] = updates[item];
            if (
                item === "gameId" &&
                updates[item] === "6656b7cc0342bce980eeb7cb"
            ) {
                newFilter[`filter.specFilter.mode`] = "LOL";
            }
        }
        console.log(newFilter);
        await Squads.updateOne(filter, newFilter);
        notifySquadFilterUpdated(squadId);
        revalidatePath(`/squad/${squadId}`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            msg: "Error occured while updaing Squad Filter! Please try again later!",
        };
    }
}

export async function updateSpecFilter(
    squadId: string,
    updates: Record<string, any>
) {
    try {
        await dbConnect();
        // Update
        const filter = { _id: squadId };
        const newFilter: any = {};
        for (const item in updates) {
            newFilter[`filter.specFilter.${item}`] = updates[item];
        }
        newFilter[`filter.specFilter.mode`] = "LOL";

        console.log(newFilter);
        await Squads.updateOne(filter, newFilter);
        notifySquadFilterUpdated(squadId);
        revalidatePath(`/squad/${squadId}`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            msg: "Error occured while updaing Squad Filter! Please try again later!",
        };
    }
}

export async function enterMatchmaking(squadId: string) {
    try {
        const willMatchAt = await enterQueue(squadId);
        revalidatePath(`/squad/${squadId}`);
        return { success: true, willMatchAt };
    } catch (e) {
        return {
            success: false,
            msg: "Error occured while enter match making! Please try again later!",
        };
    }
}

export async function exitMatchMaking(squadId: string) {
    try {
        await exitQueue(squadId);
        revalidatePath(`/squad/${squadId}`);
        return { success: true };
    } catch (e) {
        return {
            success: false,
            msg: "Error occured while exit match making! Please try again later!",
        };
    }
}

export async function checkQueueTime(squadId: string) {
    try {
        const willMatchAt = await repoCheckQueueTime(squadId);
        return { success: true, willMatchAt };
    } catch (e) {
        return {
            success: false,
            msg: "Error occured while checking queue time!",
        };
    }
}

export async function revalidateFilters(squadId: string, page: string) {
    revalidatePath(`/squad/${squadId}`);
    // redirect(`/squad/${squadId}/${page}`);
    return { success: true };
}
