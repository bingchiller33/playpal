"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoConnect";
import { createSquadByPlayer } from "@/repositories/squadRepository";

export async function createSquad() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth/login");
    }

    await dbConnect();
    const newSquad = await createSquadByPlayer(session.user.id);
    redirect(`/squad/${newSquad._id}/chat`);
}
