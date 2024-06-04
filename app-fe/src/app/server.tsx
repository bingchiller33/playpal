"use server";

import dbConnect from "@/lib/mongoConnect";
import Squads from "@/models/squadModel";
import Aaas from "@/models/aaaModel";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSquadByPlayer } from "@/repositories/squadRepository";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import Account from "@/models/account";
import { commonWeights, lolWeights } from "@/models/weightSchema";

export async function create(formData: FormData) {
    await dbConnect();
    const name = formData.get("name");
    console.log(name);
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

export async function createSquad() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    console.log(session);
    await dbConnect();
    const newSquad = await createSquadByPlayer(session.user.id);
    redirect(`/squad/${newSquad._id}`);
}
