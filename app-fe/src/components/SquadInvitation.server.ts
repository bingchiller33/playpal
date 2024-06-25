"use server";

import dbConnect from "@/lib/mongoConnect";
import { sendNotification } from "@/lib/pusher.server";
import SquadInvitations, { ISquadInvitation } from "@/models/squadInvitation";
import {
    createInvitationMember,
    joinSquad,
} from "@/repositories/squadRepository";
import { jsonStrip } from "@/utils";
import { sessionOrLogin } from "@/utils/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInvitation(squadId: string, accountId: string) {
    try {
        const session = await sessionOrLogin();
        await dbConnect();
        const invite = await createInvitationMember(
            squadId,
            accountId,
            session.user.id
        );

        if (!invite) {
            return { success: false, msg: "Cannot invite that person!" };
        }

        const squadName = invite.squadId?.name ?? "Unknown squad";
        const inviterName = invite.inviterId?.username ?? "Unknown player";
        await sendNotification({
            title: `You have been invited to ${squadName}`,
            content: `${inviterName} wants you to join ${squadName}! Click here to join now.`,
            user: invite.accountId.toString(),
            saveHistory: true,
            href: `/invitations/squad/${invite._id}`,
        });

        return { success: true, data: jsonStrip(invite) };
    } catch (e) {
        return { success: false, msg: "False to sent invitation!" };
    }
}

export async function getInvitationToSquad(accountId: string, squadId: string) {
    const invite = jsonStrip(
        await SquadInvitations.findOne({
            accountId: accountId,
            squadId: squadId,
        })
    );
    return invite;
}

export async function declineInvite(invitationId: string) {
    try {
        const session = await sessionOrLogin();
        await dbConnect();
        await SquadInvitations.deleteOne({ _id: invitationId }).exec();
        revalidatePath(`/invitations/squad/`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, msg: "False to respond to invitation!" };
    }
}

export async function acceptInvite(invitationId: string) {
    let squadId = undefined;
    try {
        const session = await sessionOrLogin();
        await dbConnect();
        const invite = await SquadInvitations.findById(invitationId).exec();
        squadId = invite?.squadId as unknown as string;
        if (!squadId) {
            return { success: false, msg: "Cannot find squad!" };
        }

        await joinSquad(squadId, session.user.id);
        await SquadInvitations.deleteOne({ _id: invitationId }).exec();
        revalidatePath(`/invitations/squad/`);
    } catch (e) {
        console.error(e);
        return { success: false, msg: "False to respond to invitation!" };
    }
    redirect(`/squad/${squadId}/chat`);
}
