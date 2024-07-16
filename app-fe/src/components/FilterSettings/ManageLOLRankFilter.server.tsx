"use server";

import dbConnect from "@/lib/mongoConnect";
import DefaultFilters from "@/models/defaultFiltersModel";
import FilterLOLRanks from "@/models/filterLOLRankModel";
import { jsonStrip } from "@/utils";
import { adminOrLogin, sessionOrLogin } from "@/utils/server";
import { revalidatePath } from "next/cache";

export async function create() {
    await dbConnect();
    const session = await adminOrLogin();
    const item = await FilterLOLRanks.create({
        name: "New Rank",
        iconUrl: "/assets/games/lol/rank-badges/unranked.webp",
        value: 0,
        order: 0,
    });

    revalidatePath("/admin/filter/general");
    return jsonStrip(item);
}

export async function updateOption(
    id: string,
    name: string,
    iconUrl: string,
    value: number,
    order: number
) {
    try {
        await dbConnect();
        const session = await adminOrLogin();
        const item = await FilterLOLRanks.updateOne(
            { _id: id },
            { name, iconUrl, order, value }
        );
        revalidatePath("/admin/filter/lol");
        return { success: true };
    } catch (e) {
        return { success: false, message: "" };
    }
}

export async function setDefault(id: string) {
    try {
        await dbConnect();
        const session = await adminOrLogin();
        await DefaultFilters.findOneAndUpdate(
            {},
            { lolMode: id },
            { upsert: true }
        );
        revalidatePath("/admin/filter/lol");
        return { success: true };
    } catch (e) {
        return { success: false, message: "" };
    }
}

export async function deleteOption(id: string) {
    try {
        await dbConnect();
        const session = await adminOrLogin();
        const item = await FilterLOLRanks.deleteOne({ _id: id });
        revalidatePath("/admin/filter/lol");
        return { success: true };
    } catch (e) {
        return { success: false, message: "" };
    }
}
