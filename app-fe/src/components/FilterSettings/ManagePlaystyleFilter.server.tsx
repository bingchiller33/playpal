"use server";

import dbConnect from "@/lib/mongoConnect";
import FilterPlaystyles from "@/models/filterPlaystyleModel";
import { jsonStrip } from "@/utils";
import { adminOrLogin } from "@/utils/server";
import { revalidatePath } from "next/cache";

export async function create() {
    await dbConnect();
    const session = await adminOrLogin();

    const item = await FilterPlaystyles.create({
        label: "New Server",
    });

    revalidatePath("/admin/filter/general");
    return jsonStrip(item);
}

export async function updateOption(id: string, label: string) {
    try {
        await dbConnect();
        const session = await adminOrLogin();
        console.log({ id, label });
        const item = await FilterPlaystyles.updateOne({ _id: id }, { label });
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
        const item = await FilterPlaystyles.deleteOne({ _id: id });
        revalidatePath("/admin/filter/general");
        return { success: true };
    } catch (e) {
        return { success: false, message: "" };
    }
}
