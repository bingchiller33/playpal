"use server";

import dbConnect from "@/lib/mongoConnect";
import DefaultFilters from "@/models/defaultFiltersModel";
import FilterLOLServers from "@/models/filterLOLServerModel";
import FilterLanguages from "@/models/filterLanguageModel";
import { jsonStrip } from "@/utils";
import { adminOrLogin, sessionOrLogin } from "@/utils/server";
import { revalidatePath } from "next/cache";

export async function create() {
    await dbConnect();
    const session = await adminOrLogin();

    const item = await FilterLOLServers.create({
        name: "New Language",
    });

    revalidatePath("/admin/filter/general");
    return jsonStrip(item);
}

export async function updateOption(id: string, name: string) {
    try {
        await dbConnect();
        const session = await adminOrLogin();
        const item = await FilterLOLServers.updateOne({ _id: id }, { name });
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
        await FilterLOLServers.findOneAndUpdate(
            {},
            { lolServer: id },
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
        const item = await FilterLOLServers.deleteOne({ _id: id });
        revalidatePath("/admin/filter/lol");
        return { success: true };
    } catch (e) {
        return { success: false, message: "" };
    }
}
