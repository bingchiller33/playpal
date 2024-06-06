"use server";

import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoConnect";
import { createSquadByPlayer } from "@/repositories/squadRepository";
import { sessionOrLogin } from "@/utils";

export async function createSquad() {
    await dbConnect();
    const session = await sessionOrLogin();
    const newSquad = await createSquadByPlayer(session.user.id);
    redirect(`/squad/${newSquad._id}/chat`);
}
