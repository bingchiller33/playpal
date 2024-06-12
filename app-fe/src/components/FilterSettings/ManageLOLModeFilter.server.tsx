"use server";

import dbConnect from "@/lib/mongoConnect";
import DefaultFilters from "@/models/defaultFiltersModel";
import FilterGameModes from "@/models/filterGameModeModel";
import { jsonStrip } from "@/utils";
import { adminOrLogin, sessionOrLogin } from "@/utils/server";
import { revalidatePath } from "next/cache";

export async function create() {
    await dbConnect();
    const session = await adminOrLogin();
    const item = await FilterGameModes.create({
        name: "New Game Mode",
        gameId: "6656b7cc0342bce980eeb7cb",
    });

    revalidatePath("/admin/filter/general");
    return jsonStrip(item);
}

export async function updateOption(id: string, name: string) {
    try {
        await dbConnect();
        const session = await adminOrLogin();
        const item = await FilterGameModes.updateOne({ _id: id }, { name });
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
        const item = await FilterGameModes.deleteOne({ _id: id });
        revalidatePath("/admin/filter/lol");
        return { success: true };
    } catch (e) {
        return { success: false, message: "" };
    }
}
