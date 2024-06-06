import Account from "@/models/account";
import FilterLOLRanks from "@/models/filterLOLRankModel";
import SquadEnrollments from "@/models/squadEnrollmentModel";
import { IWeight } from "@/models/weightSchema";
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
