import {
    notifyMemberChanged,
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
import { getData } from "./masterDataAlgoRepository";

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
    const squad = await Squads.findById(squadId);
    if (squad?.disbandedAt) {
        return null;
    }

    const exist = await SquadEnrollments.findOne({ squadId, accountId }).exec();
    if (exist) {
        return exist;
    }

    const join = await SquadEnrollments.create({
        accountId,
        squadId,
    });

    await updateSquadAvgStats(squadId);
    await notifyMemberChanged(squadId);
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

export async function getMembersRecommend(members: ISquadEnrollment[]) {
    const memberIds = members.map((x) => x.accountId._id);
    const accounts = await Account.find({ _id: { $nin: memberIds } })
        .limit(10)
        .exec();
    return accounts;
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
    rating?: number
) {
    let res = 0;
    if (rating !== undefined) {
        const update = await SquadEnrollments.updateOne(
            { squadId: squadId, accountId, leaveDate: null },
            { leaveDate: new Date(), rating, sentimentRating: true }
        );
        res = update.modifiedCount;
    } else {
        const update = await SquadEnrollments.updateOne(
            { squadId: squadId, accountId, leaveDate: null },
            { leaveDate: new Date(), rating: 3, sentimentRating: false }
        );
        res = update.modifiedCount;
    }

    await notifyMemberChanged(squadId);

    const members = await getMembers(squadId);
    if (members.length === 0) {
        deleteSquad(squadId);
    }

    return res > 0;
}

export async function deleteSquad(squadId: string) {
    const tasks = [] as Promise<any>[];

    tasks.push(
        MatchMakingQueues.deleteMany({
            $or: [{ squadA: squadId, squadB: squadId }],
        }).exec()
    );

    tasks.push(
        SquadEnrollments.updateMany(
            { squadId },
            {
                leaveDate: new Date(),
            }
        ).exec()
    );

    tasks.push(
        SquadMatchs.deleteMany({
            $or: [{ squadA: squadId, squadB: squadId }],
        }).exec()
    );

    tasks.push(
        Squads.updateOne({ _id: squadId }, { disbandedAt: new Date() }).exec()
    );

    await Promise.all(tasks);
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
        $or: [
            {
                squadA: qi.squadA,
                squadB: qi.squadB,
            },
            {
                squadA: qi.squadB,
                squadB: qi.squadA,
            },
        ],
    }).exec();

    if (!exists) {
        await SquadMatchs.create({
            squadA: qi.squadA,
            squadB: qi.squadB,
        });

        await squadMatched(qi.squadA.toString(), qi.squadB.toString());

        const squadAInfo = await Squads.findById(qi.squadA).exec();
        const squadAName = squadAInfo?.name ?? "a squad";

        const squadBInfo = await Squads.findById(qi.squadB).exec();
        const squadBName = squadBInfo?.name ?? "a squad";

        await sendNotification({
            title: `You have matched with ${squadBName}!`,
            content: `We have found a squad that have similar interests with yours. Click here to accept!`,
            img: squadBInfo?.img,
            user: squadAInfo!.leader.toString(),
            href: `/squad/${squadAInfo?._id}/request`,
            tag: "request",
            saveHistory: true,
        });

        await sendNotification({
            title: `You have matched with ${squadAName}!`,
            content: `We have found a squad that have similar interests with yours. Click here to accept!`,
            img: squadAInfo?.img,
            user: squadBInfo!.leader.toString(),
            href: `/squad/${squadBInfo?._id}/request`,
            tag: "request",
            saveHistory: true,
        });
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

    const algoSettings = await getData();
    const updateTasks = [] as Promise<Date>[];
    for (const other of squads.filter((x) => x._id.toString() !== squadId)) {
        const curInput = await squadToAlgoInput(
            curSquad,
            other,
            algoSettings.variance
        );
        const otherInput = await squadToAlgoInput(
            other,
            curSquad,
            algoSettings.variance
        );
        const time = matchTime(
            curInput,
            otherInput,
            algoSettings.base,
            algoSettings.exp
        );
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
                        //  TODO: Remove test code
                        willMatchAt: new Date(Date.now() + 10 * 1000),
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
export async function createInvitationMember(
    squadId: string,
    accountId: string,
    inviterId: string
) {
    // TODO: Check for disallow stranger invite!
    const newInvite = await SquadInvitations.findOneAndUpdate(
        { squadId, accountId, inviterId },
        { squadId, accountId, inviterId },
        { upsert: true }
    )
        .populate("inviterId")
        .populate("squadId")
        .exec();

    return newInvite;
}

export async function getAllInvitationToSquad(accountId: string) {
    const inviteToSquad = await SquadInvitations.find({
        accountId: accountId,
    })
        .populate("inviterId")
        .populate("squadId")
        .exec();
    return inviteToSquad;
}

export async function getMatchSquads(squadId: string) {
    const matches = await SquadMatchs.find({
        $or: [
            {
                squadA: squadId,
            },
            {
                squadB: squadId,
            },
        ],
        aAccept: { $ne: false },
        bAccept: { $ne: false },
    })
        .populate("squadA")
        .populate("squadB")
        .exec();

    return matches.map((x) => {
        const sa = x.squadA as WithId<ISquad>;
        const sb = x.squadB as WithId<ISquad>;
        const data = jsonStrip(sa._id.toString() === squadId ? sb : sa);
        return { ...data, matchId: x._id.toString() };
    });
}

export async function getActiveSquad() {
    const cdata = await Squads.aggregate([
        {
            $group: {
                _id: {
                    year: {
                        $year: "$createdAt",
                    },
                    month: {
                        $month: "$createdAt",
                    },
                    day: {
                        $dayOfMonth: "$createdAt",
                    },
                },
                count: {
                    $sum: 1,
                },
            },
        },
        {
            $addFields: {
                date: {
                    $dateFromParts: {
                        year: "$_id.year",
                        month: "$_id.month",
                        day: "$_id.day",
                    },
                },
            },
        },
        { $sort: { date: 1 } },
        {
            $project: {
                _id: 0,
                date: 1,
                count: 1,
            },
        },
    ]).exec();

    const rs: { x: number; y: number }[] = [];
    let total = 0;
    cdata.forEach((x) => {
        rs.push({
            x: Date.parse(x.date),
            y: total + x.count,
        });
        total += x.count;
    });

    return rs;
}

export async function getGameDistribution() {
    const cdata = await Squads.aggregate([
        {
            $group: {
                _id: "$filter.gameId",
                value: {
                    $sum: 1,
                },
            },
        },
        {
            $lookup: {
                from: "filtergames",
                localField: "_id",
                foreignField: "_id",
                as: "data",
            },
        },
        {
            $unwind: {
                path: "$data",
            },
        },
        {
            $addFields: {
                name: "$data.name",
            },
        },
        {
            $project: {
                name: 1,
                value: 1,
                _id: 0,
            },
        },
    ]).exec();

    return cdata as { name: string; value: number }[];
}

export async function getPlayTime() {
    const cdata = await Squads.aggregate([
        {
            $addFields: {
                time: {
                    $min: [new Date(), "$disbandedAt"],
                },
            },
        },
        {
            $addFields: {
                diff: {
                    $dateDiff: {
                        startDate: "$createdAt",
                        endDate: "$time",
                        unit: "hour",
                    },
                },
            },
        },
        {
            $group: {
                _id: 1,
                total: {
                    $sum: "$diff",
                },
            },
        },
    ]);

    return cdata[0]?.total ?? 0;
}
