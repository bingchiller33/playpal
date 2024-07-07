"use server";

import dbConnect from "@/lib/mongoConnect";
import Squads from "@/models/squadModel";
import Aaas from "@/models/aaaModel";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
    createSquadByPlayer,
    getActiveSquad,
    getUserActiveSquads,
} from "@/repositories/squadRepository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Account from "@/models/account";
import { commonWeights, lolWeights } from "@/models/weightSchema";
import { sendNotification } from "@/lib/pusher.server";
import { sessionOrLogin } from "@/utils/server";

export async function callToAction() {
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

export async function create(formData: FormData) {
    await dbConnect();
    const name = formData.get("name");
    await Aaas.create({ name });
    revalidatePath("/");
}

export async function weight() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const weights = {
        mode: "LOL",
    } as any;
    const totalWeights = commonWeights.length + lolWeights.length;
    for (const w of commonWeights) {
        weights[w] = 1 / totalWeights;
    }

    const doc = await Account.findByIdAndUpdate(session.user.id, {
        $set: {
            matchMakingWeights: [
                {
                    mode: "LOL",
                    weights,
                },
            ],
        },
    });
}

export async function send() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth/login");
    }

    await dbConnect();
    sendNotification({
        title: "Test",
        content: "Test",
        href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        user: session.user.id,
        saveHistory: true,
    });
}

export async function sendTag() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth/login");
    }

    await dbConnect();
    sendNotification({
        title: "Test",
        content: "Test" + Math.random(),
        tag: "LMAO",
        user: session.user.id,
    });
}
