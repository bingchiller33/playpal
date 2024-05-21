"use server";

import dbConnect from "@/lib/mongoConnect";
import Aaas from "@/models/aaaModel";
import { revalidatePath } from "next/cache";

export async function create(formData: FormData) {
    "use server";
    await dbConnect();
    const name = formData.get("name");
    console.log(name);
    await Aaas.create({ name });
    revalidatePath("/");
}
