"use server";

import dbConnect from "@/lib/mongoConnect";
import Squads from "@/models/squadModel";
import Aaas from "@/models/aaaModel";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSquad as repoCreateSquad } from "@/repositories/SquadRepository";

export async function create(formData: FormData) {
    await dbConnect();
    const name = formData.get("name");
    console.log(name);
    await Aaas.create({ name });
    revalidatePath("/");
}

export async function createSquad() {
    await dbConnect();
    const newSquad = await repoCreateSquad();
    console.log(newSquad);
    redirect(`/squad/${newSquad._id}`);
}
