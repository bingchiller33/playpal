"use server";

import dbConnect from "@/lib/mongoConnect";
import { getFutPremiumExpiry } from "@/repositories/premiumRepository";
import {
    createSquadByPlayer,
    getUserActiveSquads,
} from "@/repositories/squadRepository";
import { sessionOrLogin } from "@/utils/server";
import { redirect } from "next/navigation";

export async function createSquad() {
    let redir = undefined;
    try {
        await dbConnect();
        const session = await sessionOrLogin();
        const expires = await getFutPremiumExpiry(session.user.id);
        const joinedCount = await getUserActiveSquads(session.user.id);

        if (!expires && joinedCount.length >= 3) {
            redir = `/compare-plans`;
        } else {
            const newSquad = await createSquadByPlayer(session.user.id);
            redir = `/squad/${newSquad._id}/chat`;
        }
    } catch (e) {
        console.error(e);
        return { success: false, msg: "Error: Please try again later" };
    }

    if (redir) {
        redirect(redir);
    }
}

export async function redirectOrCreateSquad() {
    const session = await sessionOrLogin();
    await dbConnect();
    const squads = await getUserActiveSquads(session.user.id);
    if (squads.length == 0) {
        const newSquad = await createSquadByPlayer(session.user.id);
        redirect(`/squad/${newSquad._id}/chat`);
    } else {
        console.log(`/squad/${squads[0].squadId._id}/chat`);
        redirect(`/squad/${squads[0].squadId._id}/chat`);
    }
}
