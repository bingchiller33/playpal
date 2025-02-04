"use server";

import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoConnect";
import {
    createSquadByPlayer,
    getUserActiveSquads,
} from "@/repositories/squadRepository";
import { sessionOrLogin } from "@/utils/server";
import Squads, { ISquad } from "@/models/squadModel";
import { revalidatePath } from "next/cache";

export async function getSquadById(squadId: string) {
    await dbConnect();
    const squad = (await Squads.findById(squadId).exec()) as ISquad;
    return squad;
}

export async function changeSquadName(squadId: string, newSquadName: string) {
    await dbConnect();
    const session = await sessionOrLogin();
    const mySquads = await getUserActiveSquads(session.user.id);
    const squad = (await Squads.findById(squadId).exec()) as ISquad;
    if (squad) {
        await Squads.updateOne({ _id: squadId }, { name: newSquadName });
        revalidatePath(`/squad/${squadId}/chat`);
        return { success: true };
    } else {
        throw new Error("Squad not found!");
    }
}

export async function changeSquadImage(
    squadId: string,
    newSquadImgUrl: string
) {
    await dbConnect();
    const session = await sessionOrLogin();
    const squad = (await Squads.findById(squadId).exec()) as ISquad;
    if (squad) {
        await Squads.updateOne({ _id: squadId }, { img: newSquadImgUrl });
        revalidatePath(`/squad/${squadId}/chat`);
        return { success: true };
    } else {
        throw new Error("Squad not found!");
    }
}
