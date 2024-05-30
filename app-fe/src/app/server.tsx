"use server";

import dbConnect from "@/lib/mongoConnect";
import Squads from "@/models/squadModel";
import Aaas from "@/models/aaaModel";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSquad as repoCreateSquad } from "@/repositories/SquadRepository";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export async function create(formData: FormData) {
    await dbConnect();
    const name = formData.get("name");
    console.log(name);
    await Aaas.create({ name });
    revalidatePath("/");
}

export async function createSquad() {
    const session = await getServerSession(authOptions);
    console.log(session);
    await dbConnect();
    const newSquad = await repoCreateSquad();
    console.log(newSquad);
    redirect(`/squad/${newSquad._id}`);
}
