"use server";

import { squadMatched, squadMerged } from "@/lib/pusher.server";
import MatchMakingQueues from "@/models/matchMakingQueueModel";
import SquadMatchs from "@/models/squadMatchModel";
import Squads from "@/models/squadModel";
import {
    getMembers,
    joinSquad,
    leaveSquad,
} from "@/repositories/squadRepository";
import { sessionOrLogin } from "@/utils/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function declideMatch(squadId: string, matchId: string) {
    try {
        const session = await sessionOrLogin();
        // check is squad leader
        const squadInfo = await Squads.findById(squadId).exec();
        if (squadInfo?.leader.toString() !== session.user.id) {
            return {
                success: false,
                msg: "Only squad leader can accept squad request!",
            };
        }

        const matchInfo = await SquadMatchs.findById(matchId).exec();
        const isA = squadId === matchInfo?.squadA.toString();
        const isB = squadId === matchInfo?.squadB.toString();
        if (!(isA || isB)) {
            return {
                success: false,
                msg: "Cannot find match!",
            };
        }

        if (isA) {
            await SquadMatchs.updateOne(
                { squadA: squadId },
                { aAccept: false }
            ).exec();
            await squadMatched(squadId, matchInfo.squadB.toString());
        }

        if (isB) {
            await SquadMatchs.updateOne(
                { squadB: squadId },
                { aAccept: false }
            ).exec();
            await squadMatched(squadId, matchInfo.squadA.toString());
        }

        revalidatePath(`/squad/${squadId}`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            msg: "Cannot decline squad match at the moment! Please try again later.",
        };
    }
}

export async function acceptMatch(squadId: string, matchId: string) {
    let redir: string | undefined = undefined;
    try {
        const session = await sessionOrLogin();
        // check is squad leader
        const squadInfo = await Squads.findById(squadId).exec();
        console.log(session.user.id, squadInfo?.leader.toString(), squadId);
        if (squadInfo?.leader.toString() !== session.user.id) {
            return {
                success: false,
                msg: "Only squad leader can accept squad request!",
            };
        }

        const matchInfo = await SquadMatchs.findOne({
            _id: matchId,
            aAccept: { $ne: false },
            bAccept: { $ne: false },
        }).exec();
        const isA = squadId === matchInfo?.squadA.toString();
        const isB = squadId === matchInfo?.squadB.toString();
        if (!(isA || isB)) {
            return {
                success: false,
                msg: "Cannot find match!",
            };
        }
        const otherSquad = isA ? matchInfo.squadB : matchInfo.squadA;
        const otherId = otherSquad._id.toString();

        await SquadMatchs.deleteMany({
            $or: [
                {
                    squadA: matchInfo.squadA,
                    squadB: matchInfo.squadB,
                },
                {
                    squadA: matchInfo.squadB,
                    squadB: matchInfo.squadA,
                },
            ],
        }).exec();
        await MatchMakingQueues.deleteMany({
            $or: [
                {
                    squadA: matchInfo.squadA,
                    squadB: matchInfo.squadB,
                },
                {
                    squadA: matchInfo.squadB,
                    squadB: matchInfo.squadA,
                },
            ],
        }).exec();
        const members = await getMembers(squadId);
        for (const m of members) {
            const mid = m.accountId._id.toString();
            await leaveSquad(squadId, mid);
            await joinSquad(otherSquad.toString(), mid);
        }

        await squadMerged(squadId, otherSquad.toString());
        redir = `/squad/${otherId}/chat`;
    } catch (e) {
        console.error(e);
        return {
            success: false,
            msg: "Cannot accept squad match at the moment! Please try again later.",
        };
    }

    redirect(redir);
}
