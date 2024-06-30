import Account from "@/models/account";
import FilterLOLRanks from "@/models/filterLOLRankModel";
import SquadEnrollments from "@/models/squadEnrollmentModel";
import { IWeight, commonWeights, lolWeights } from "@/models/weightSchema";
import { jsonStrip } from "@/utils";
import { GAME_ID_LOL } from "@/utils/constants";
import {
    nonNormalDynWeight,
    normalizeDynWeight,
} from "@/utils/matchmakingAlgos";

export async function updateAccountWeights(accountId: string, mode: string) {
    let query;
    if (mode === "LOL") {
        query = SquadEnrollments.find({
            accountId,
            leaveDate: { $ne: null },
            rating: { $ne: null },
            sentimentRating: true,
            ["filter.gameId"]: GAME_ID_LOL,
        });
    } else {
        query = SquadEnrollments.find({
            accountId,
            leaveDate: { $ne: null },
            rating: { $ne: null },
            sentimentRating: true,
        });
    }

    let enrolls = await query
        .populate("squadId")
        .populate("squadId.filter.gender")
        .populate("accountId")
        .sort({ createdAt: "desc" })
        .limit(20)
        .exec();

    const gender = enrolls
        .map((x) => {
            let squadTime = +x.leaveDate! - +x.createdAt;
            squadTime /= 86400;

            return nonNormalDynWeight(
                x.squadId.filter.genderId.value,
                x.squadId.avgTraits.get("gender")!,
                x.rating ?? 3,
                squadTime,
                0.1
            );
        })
        .reduce((a, b) => a + b);

    const age = enrolls
        .map((x) => {
            let score = 0;
            let avgAge = x.squadId.avgTraits.get("age")!;

            if (avgAge < x.squadId.filter.ageFrom) {
                score = x.squadId.filter.ageFrom - avgAge;
            } else if (avgAge > x.squadId.filter.ageTo) {
                score = avgAge - x.squadId.filter.ageTo;
            }

            let squadTime = +x.leaveDate! - +x.createdAt;
            squadTime /= 86400;

            return nonNormalDynWeight(score, 0, x.rating ?? 3, squadTime, 0.1);
        })
        .reduce((a, b) => a + b);

    const playstyles = enrolls
        .map((x) => {
            let score = 0;
            for (const ps of x.squadId.filter.playstyles) {
                score += 100 - x.squadId.avgTraits.get(`playstyle_${ps._id}`)!;
            }

            let squadTime = +x.leaveDate! - +x.createdAt;
            squadTime /= 86400;

            return nonNormalDynWeight(score, 0, x.rating ?? 3, squadTime, 0.1);
        })
        .reduce((a, b) => a + b);

    const u = {
        gender,
        age,
        playstyles,
        activeHours: 1,
        memberCount: 1,
    } as Record<string, number>;

    if (mode === "LOL") {
        const ranks = await FilterLOLRanks.find({}).exec();
        const rank = enrolls
            .map((x) => {
                let squadTime = +x.leaveDate! - +x.createdAt;
                squadTime /= 86400;

                const filterRankVal =
                    ranks.find(
                        (r) => r._id === x.squadId.filter.specFilter.rankId
                    )?.value ?? 0;

                return nonNormalDynWeight(
                    filterRankVal,
                    x.squadId.avgTraits.get("rank")!,
                    x.rating ?? 3,
                    squadTime,
                    0.1
                );
            })
            .reduce((a, b) => a + b);

        u.rank = rank;
    }

    normalizeDynWeight(u);
    const weights = u as IWeight;
    weights.mode = mode as any;

    const modeIdx = enrolls[0]?.accountId.matchMakingWeights.find(
        (x) => x.mode === mode
    );

    if (modeIdx === undefined) {
        await Account.updateOne(
            { _id: accountId },
            {
                $push: { matchMakingWeights: weights },
            }
        ).exec();
    } else {
        await Account.updateOne(
            { _id: accountId },
            {
                [`matchMakingWeights.${modeIdx}`]: weights,
            }
        ).exec();
    }
}

export async function getDailyAccountRegistered() {
    const cdata = await Account.aggregate([
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

export async function getFilterDistribution() {
    const cdata = await Account.aggregate([
        {
            $unwind: {
                path: "$matchMakingWeights",
            },
        },
        {
            $group: {
                _id: 1,
                avgGender: {
                    $avg: "$matchMakingWeights.weights.gender",
                },
                avgAge: {
                    $avg: "$matchMakingWeights.weights.age",
                },
                avgMemberCount: {
                    $avg: "$matchMakingWeights.weights.memberCount",
                },
                avgActiveHours: {
                    $avg: "$matchMakingWeights.weights.activeHours",
                },
                avgPlaystyles: {
                    $avg: "$matchMakingWeights.weights.playstyles",
                },
            },
        },
    ]).exec();
    console.log(cdata);

    if (cdata.length > 0) {
        const { _id, ...rest } = jsonStrip(cdata)[0];
        return Object.keys(rest).map((x) => ({
            name: x,
            value: rest[x] as number,
        }));
    } else {
        return [];
    }
}

export async function getTotalAccount() {
    const count = await Account.countDocuments();
    return count;
}

export async function getUserGrowthLastMonth() {
    const from = new Date();
    from.setDate(1);
    const fromMonth = from.getMonth();
    if (fromMonth === 1) {
        from.setMonth(12);
        from.setFullYear(from.getFullYear() - 1);
    } else {
        from.setMonth(fromMonth - 1);
    }

    const to = new Date();
    to.setDate(1);

    const count = await Account.countDocuments({
        createdAt: { $gt: from, $lt: to },
    });
    return count;
}

export async function getUserGrowthThisMonth() {
    const date = new Date();
    date.setDate(1);

    const count = await Account.countDocuments({ createdAt: { $gt: date } });
    return count;
}

export async function initializeWeights() {
    const weights = {
        mode: "LOL",
    } as any;
    const totalWeights = commonWeights.length + lolWeights.length;
    for (const w of commonWeights) {
        weights[w] = 1 / totalWeights;
    }

    return {
        matchMakingWeights: [
            {
                mode: "LOL",
                weights,
            },
        ],
    };
}
