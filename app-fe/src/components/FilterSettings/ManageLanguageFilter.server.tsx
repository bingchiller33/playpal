"use server";

import dbConnect from "@/lib/mongoConnect";
import DefaultFilters from "@/models/defaultFiltersModel";
import FilterLanguages from "@/models/filterLanguageModel";
import { jsonStrip } from "@/utils";
import { adminOrLogin, sessionOrLogin } from "@/utils/server";
import { revalidatePath } from "next/cache";

export async function create() {
    await dbConnect();
    const session = await adminOrLogin();

    const item = await FilterLanguages.create({
        label: "New Language",
    });

    revalidatePath("/admin/filter/general");
    return jsonStrip(item);
}

export async function updateOption(id: string, label: string) {
    try {
        await dbConnect();
        const session = await adminOrLogin();
        console.log({ id, label });
        const item = await FilterLanguages.updateOne({ _id: id }, { label });
        revalidatePath("/admin/filter/general");
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
            { lang: id },
            { upsert: true }
        );
        revalidatePath("/admin/filter/general");
        return { success: true };
    } catch (e) {
        return { success: false, message: "" };
    }
}

export async function deleteOption(id: string) {
    try {
        await dbConnect();
        const session = await adminOrLogin();
        const item = await FilterLanguages.deleteOne({ _id: id });
        revalidatePath("/admin/filter/general");
        return { success: true };
    } catch (e) {
        return { success: false, message: "" };
    }
}
