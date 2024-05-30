"use server";

import dbConnect from "@/lib/mongoConnect";
import Squads from "@/models/squadModel";
import { revalidatePath } from "next/cache";

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
        revalidatePath(`/squad/${squadId}`);
        return { success: true };
    } catch (e) {
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
        revalidatePath(`/squad/${squadId}`);
        return { success: true };
    } catch (e) {
        return {
            success: false,
            msg: "Error occured while updaing Squad Filter! Please try again later!",
        };
    }
}
