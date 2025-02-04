"use server";

import dbConnect from "@/lib/mongoConnect";
import { notifySquadFilterUpdated } from "@/lib/pusher.server";
import Squads, { ISquad } from "@/models/squadModel";
import {
    enterQueue,
    exitQueue,
    squadToAlgoInput,
} from "@/repositories/squadRepository";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkQueueTime as repoCheckQueueTime } from "@/repositories/squadRepository";
import { sessionOrLogin } from "@/utils/server";
import { getFutPremiumExpiry } from "@/repositories/premiumRepository";

async function requireLeader(squad: ISquad | string) {
    if (typeof squad === "string") {
        squad = (await Squads.findById(squad).exec()) as ISquad;
    }

    const session = await sessionOrLogin();
    const userId = session?.user.id;
    if (squad.leader.toString() !== userId) {
        return { success: false, msg: "Only squad leader can do this action!" };
    }

    return { success: true, userId };
}

export async function updateFilter(
    squadId: string,
    updates: Record<string, any>
) {
    try {
        await dbConnect();
        const checkPriviledge = await requireLeader(squadId);
        if (!checkPriviledge.success) {
            return checkPriviledge;
        }

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
        const checkPriviledge = await requireLeader(squadId);
        if (!checkPriviledge.success) {
            return checkPriviledge;
        }

        // Update
        const filter = { _id: squadId };
        const newFilter: any = {};
        for (const item in updates) {
            newFilter[`filter.specFilter.${item}`] = updates[item];
        }
        newFilter[`filter.specFilter.mode`] = "LOL";

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
    let isBlocked = false;
    try {
        await dbConnect();
        const checkPriviledge = await requireLeader(squadId);
        if (!checkPriviledge.success) {
            return checkPriviledge;
        }

        const expiry = await getFutPremiumExpiry(checkPriviledge.userId!);
        if (!expiry) {
            const squad = await Squads.findById(squadId).exec();
            if ((squad?.filter.memberCount ?? 0) > 5) {
                isBlocked = true;
            }
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            msg: "Error occured while enter match making! Please try again later!",
        };
    }

    if (isBlocked) {
        redirect("/compare-plans");
    }

    try {
        const willMatchAt = await enterQueue(squadId);
        revalidatePath(`/squad/${squadId}`);
        return { success: true, willMatchAt };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            msg: "Error occured while enter match making! Please try again later!",
        };
    }
}

export async function exitMatchMaking(squadId: string) {
    try {
        await dbConnect();
        const checkPriviledge = await requireLeader(squadId);
        if (!checkPriviledge.success) {
            return checkPriviledge;
        }

        await exitQueue(squadId);
        revalidatePath(`/squad/${squadId}`);
        return { success: true };
    } catch (e) {
        console.error(e);
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
