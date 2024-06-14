import {
    notifySquadFilterUpdated,
    queueWaitTimeUpdated,
    sendNotification,
    squadMatched,
} from "@/lib/pusher.server";
import Account, { IAccount } from "@/models/account";
import FilterLOLRanks from "@/models/filterLOLRankModel";
import FilterPlaystyles from "@/models/filterPlaystyleModel";
import MatchMakingQueues, {
    IMatchMakingQueue,
} from "@/models/matchMakingQueueModel";
import SquadEnrollments, {
    ISquadEnrollment,
} from "@/models/squadEnrollmentModel";
import SquadInvitations, { ISquadInvitation } from "@/models/squadInvitation";
import SquadMatchs from "@/models/squadMatchModel";
import Squads, { ISquad } from "@/models/squadModel";
import {
    ILOLWeight,
    IWeight,
    commonWeights,
    lolWeights,
} from "@/models/weightSchema";
import { jsonStrip } from "@/utils";
import { GAME_ID_LOL } from "@/utils/constants";
import { SquadInput, matchTime, varianceRand } from "@/utils/matchmakingAlgos";
import { WithId } from "@/utils/types";

// Write common database query here, dont write basic crud here, use the Collection directly
export async function createSquad(leader: string) {
    const newSquad = await Squads.create({ leader });
    return newSquad;
}

export async function createSquadByPlayer(accountId: string) {
    const newSquad = await createSquad(accountId);
    await joinSquad(newSquad._id.toString(), accountId);
    return newSquad;
}

export async function joinSquad(squadId: string, accountId: string) {
    const join = await SquadEnrollments.create({
        accountId,
        squadId,
    });

    await updateSquadAvgStats(squadId);
    return join;
}

export async function getMembers(squadId: string) {
    const members = await SquadEnrollments.find({
        squadId,
        leaveDate: { $eq: null },
    })
        .populate("accountId")
        .exec();

    return members;
}

export async function getMembersRecommend(accId: string, members: ISquadEnrollment[]) {
    const result: IAccount[] = [];
    const invitationMembers: ISquadInvitation[] = jsonStrip(await SquadInvitations.find());
    const accounts = (await Account.find()).filter(acc => {
        for (const mem of members) {
            if (mem.accountId._id !== acc._id.toString()) {
                result.push(acc);
            }
        }
    }
    );
    for (const mem of result) {
        for (const inv of invitationMembers) {
            if (accId === inv.squadId) {
                if (inv.accountId === mem._id.toString()) {
                    result.pop();
                }
            }
        }
    }
    return result;
}

export async function getUserActiveSquads(accountId: string) {
    const squads = await SquadEnrollments.find({
        leaveDate: { $eq: null },
        squadId: { $ne: null },
        accountId,
    })
        .populate("squadId")
        .sort({ createdAt: "desc" })
        .exec();

    return squads.filter((x) => x.squadId);
}

export async function leaveSquad(
    squadId: string,
    accountId: string,
    rating: number
) {
    const update = await SquadEnrollments.updateOne(
        { squadId: squadId, accountId, leaveDate: null },
        { leaveDate: new Date(), rating }
    );

    return update.modifiedCount > 0;
}

export function getModeDiscriminant(gameId: string, modeId: string) {
    // TODO: Remove hard code id when creating admin screen
    if (gameId == (GAME_ID_LOL ?? "6656b7cc0342bce980eeb7cb")) {
        return "LOL";
    } else {
        return "ANY";
    }
}

export async function updateSquadAvgStats(squadId: string) {
    await calcAvgTraits(squadId);
    await calcAvgWeights(squadId);
}

async function calcAvgWeights(squadId: string) {
    const squad = await Squads.findById(squadId).exec();
    if (!squad) {
        return;
    }

    const enrolls = await SquadEnrollments.find({
        squadId,
        leaveDate: { $eq: null },
    })
        .populate("accountId")
        .exec();
    const mode = getModeDiscriminant(
        squad.filter.gameId.toString(),
        squad.filter.modeId.toString()
    );

    switch (mode) {
        case "LOL":
            const avgWeights = avgWeightOf(enrolls, "LOL", lolWeights);
            await Squads.updateOne(
                { _id: squadId },
                { $set: { squadWeights: avgWeights } }
            ).exec();
            break;
    }
}

function avgWeightOf(
    doc: ISquadEnrollment[],
    mode: string,
    modeWeights: readonly string[]
) {
    const totalWeights = commonWeights.length + modeWeights.length;
    const avgWeights = doc
        .map((x) => {
            let weights = x.accountId?.matchMakingWeights?.find(
                (t) => t.mode === mode
            )?.weights;
            if (!weights) {
                const newWeights: any = { mode };
                for (const w of commonWeights) {
                    newWeights[w] = 1 / totalWeights;
                }

                for (const w of modeWeights) {
                    newWeights[w] = 1 / totalWeights;
                }

                weights = newWeights;
            }
            return weights as IWeight;
        })
        .reduce((a: any, b: any) => {
            const res = {} as any;
            [...commonWeights, ...modeWeights].forEach((name) => {
                res[name] = a[name] + b[name] * (1 / doc.length);
            });
            return res;
        });

    return avgWeights;
}

async function calcAvgTraits(squadId: string) {
    const squad = await Squads.findById(squadId).exec();
    if (!squad) {
        return;
    }

    const enrolls = await SquadEnrollments.find({
        squadId,
        leaveDate: { $eq: null },
    })
        .populate("accountId")
        .populate("accountId.gender")
        .exec();
    const mode = getModeDiscriminant(
        squad.filter.gameId.toString(),
        squad.filter.modeId.toString()
    );

    const avgTraits = {} as Record<string, number>;
    avgTraits.gender =
        enrolls
            .map((x) => x.accountId.gender?.value ?? 50)
            .reduce((a, b) => a + b) / enrolls.length;

    avgTraits.age =
        enrolls.map((x) => x.accountId.age ?? 0).reduce((a, b) => a + b) /
        enrolls.length;

    const playstyles = await FilterPlaystyles.find({}).exec();
    playstyles.forEach((ps) => {
        avgTraits[`playstyle_${ps._id}`] =
            enrolls
                .map<number>((x) => {
                    console.log("VL", x.accountId);
                    const aps = x.accountId.playstyles.find(
                        (p) => p._id === ps._id
                    );
                    return aps === undefined ? 0 : 100;
                })
                .reduce((a, b) => a + b) / enrolls.length;
    });

    switch (mode) {
        case "LOL":
            avgTraits.rank =
                enrolls
                    .map((x) => x.accountId.lolRank?.value ?? 0)
                    .reduce((a, b) => a + b) / enrolls.length;
            break;
    }

    await Squads.updateOne(
        { _id: squadId },
        { $set: { avgTraits: avgTraits } }
    ).exec();
}

async function checkForMatchedSquads() {
    const queue = await MatchMakingQueues.find({
        willMatchAt: { $lt: new Date() },
    }).exec();

    await Promise.all(queue.map((x) => matchSquadIfNotExist(x)));
}

async function matchSquadIfNotExist(qi: IMatchMakingQueue) {
    const exists = await SquadMatchs.findOne({
        squadA: qi.squadA,
        squadB: qi.squadB,
    }).exec();

    if (!exists) {
        await SquadMatchs.create({
            squadA: qi.squadA,
            squadB: qi.squadB,
        });

        await squadMatched(qi.squadA.toString(), qi.squadB.toString());
    }
}

async function recalcQueueFor(squadId: string) {
    await updateSquadAvgStats(squadId);
    const squads = await Squads.find({
        joinQueue: { $ne: null },
    })
        .populate("filter.genderId")
        .populate("filter.playstyles")
        .exec();

    const curSquad = squads.find((x) => x._id.toString() === squadId);
    if (!curSquad) {
        return;
    }

    const updateTasks = [] as Promise<Date>[];
    for (const other of squads.filter((x) => x._id.toString() !== squadId)) {
        // TODO: Change 0 to actual random
        const curInput = await squadToAlgoInput(curSquad, other, 0);
        const otherInput = await squadToAlgoInput(other, curSquad, 0);
        const time = matchTime(curInput, otherInput);
        const willMatchAt = new Date(Date.now() + time * 1000);
        const [squadA, squadB] = [squadId, other._id.toString()].toSorted();

        updateTasks.push(
            MatchMakingQueues.findOneAndUpdate(
                {
                    squadA,
                    squadB,
                },
                {
                    $set: {
                        squadA,
                        squadB,
                        willMatchAt,
                    },
                },
                { upsert: true }
            )
                .exec()
                .then(() => willMatchAt)
        );
    }

    const waitTime = await Promise.all(updateTasks).then((x) =>
        x.reduce((a, b) => (a < b ? a : b))
    );
    await queueWaitTimeUpdated(squadId, waitTime);
    await checkForMatchedSquads();
    return waitTime;
}

export async function enterQueue(squadId: string) {
    await Squads.updateOne(
        { _id: squadId },
        { $set: { joinQueue: new Date() } }
    ).exec();
    return await recalcQueueFor(squadId);
}

export async function checkQueueTime(squadId: string) {
    const soonestMatch = await MatchMakingQueues.findOne({
        $or: [{ squadA: squadId }, { squadB: squadId }],
    })
        .sort({ willMatchAt: "asc" })
        .exec();

    await checkForMatchedSquads();
    return soonestMatch?.willMatchAt;
}

export async function exitQueue(squadId: string) {
    await Squads.updateOne(
        { _id: squadId },
        { $set: { joinQueue: null } }
    ).exec();
    await MatchMakingQueues.deleteMany({
        $or: [
            {
                squadA: squadId,
            },
            {
                squadB: squadId,
            },
        ],
    }).exec();
    await SquadMatchs.deleteMany({
        $or: [
            {
                squadA: squadId,
            },
            {
                squadB: squadId,
            },
        ],
    }).exec();
}

export async function squadToAlgoInput(
    squad: WithId<ISquad>,
    other: WithId<ISquad>,
    randomVariance: number
) {
    console.log(squad);
    const otherAge = other.avgTraits.get("age")!;
    let ageScore = 0; // default case when other age in within squad age filter rage
    if (otherAge < squad.filter.ageFrom) {
        ageScore = squad.filter.ageFrom - otherAge;
    } else if (otherAge > squad.filter.ageTo) {
        ageScore = otherAge - squad.filter.ageTo;
    }

    const idealTraits: SquadInput = {
        squadId: squad._id.toString(),
        traits: {
            gender: {
                avg: squad.avgTraits.get("gender") ?? -1,
                ideal: squad.filter.genderId.value,
                random: varianceRand(randomVariance),
                weight: squad.squadWeights!.gender,
            },
            age: {
                avg: 0, // to convert from range to single value, we already calculate the difference at the prev step
                ideal: ageScore,
                random: varianceRand(randomVariance),
                weight: squad.squadWeights!.age,
            },
            activeFrom: {
                avg: squad.filter.activeFrom,
                ideal: squad.filter.activeFrom,
                random: varianceRand(randomVariance),
                weight: squad.squadWeights!.activeHours,
            },
            activeTo: {
                avg: squad.filter.activeTo,
                ideal: squad.filter.activeTo,
                random: varianceRand(randomVariance),
                weight: squad.squadWeights!.activeHours,
            },
            memberCount: {
                avg: squad.filter.memberCount,
                ideal: squad.filter.memberCount,
                random: varianceRand(randomVariance),
                weight: squad.squadWeights!.memberCount,
            },
        },
    };

    squad.filter.playstyles.forEach((x) => {
        idealTraits.traits[`playstyle_${x._id}`] = {
            avg: squad.avgTraits.get(`playstyle_${x._id}`)!,
            ideal: 100,
            random: varianceRand(randomVariance),
            weight: squad.squadWeights!.playstyles,
        };
    });

    const mode = getModeDiscriminant(
        squad.filter.gameId.toString(),
        squad.filter.modeId.toString()
    );

    const rankInfo = await FilterLOLRanks.findById(
        squad.filter.specFilter.rankId
    );

    switch (mode) {
        case "LOL":
            idealTraits.traits.rank = {
                avg: squad.avgTraits.get("rank")!,
                ideal: rankInfo?.value ?? 0,
                random: varianceRand(randomVariance),
                weight: (squad.squadWeights as ILOLWeight).rank,
            };
            break;
    }

    return idealTraits;
}

//create invitation
export async function createInvitationMember(invitation: ISquadInvitation) {
    const newInvite = await SquadInvitations.create({ ...invitation });
    return newInvite;
}

export async function getAllInvitationToSquad(accountId: String) {
    const inviteToSquad = await SquadInvitations.find({ accountId: accountId }).exec();
    return inviteToSquad;
}




// Invitation To join the Squad

export async function AnswerInvitationToJoinTheSquad(inv: ISquadInvitation, status: boolean, squadName: string, accountName: string) {
    let join;
    if (status) {
        join = joinSquad(inv.squadId.toString(), inv.accountId.toString());
    }
    await SquadInvitations.deleteOne(inv);

    if (join) {
        sendNotification({
            title: accountName + " accepts your invitation.",
            content: accountName + " accepts your invitation to join the " + squadName + " squad.",
            tag: "acceptInv",
            user: inv.inviterId.toString(),
        });
    } else {
        sendNotification({
            title: accountName + " declines your invitation.",
            content: accountName + " declines your invitation to join the " + squadName + " squad.",
            tag: "declinesInv",
            user: inv.inviterId.toString(),
        });
    }
    return join;

}