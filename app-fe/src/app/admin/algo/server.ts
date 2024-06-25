"use server";

import {
    setTimeFn,
    setVariance,
} from "@/repositories/masterDataAlgoRepository";
import { revalidatePath } from "next/cache";

export async function updateVariance(data: FormData) {
    const variance = parseFloat(data.get("variance")?.toString() ?? "0");
    await setVariance(variance);
    revalidatePath("/admin/algo");
}

export async function updateTimeFn(data: FormData) {
    const base = parseFloat(data.get("base")?.toString() ?? "0");
    const exp = parseFloat(data.get("exp")?.toString() ?? "0");

    await setTimeFn(base, exp);
    revalidatePath("/admin/algo");
}
