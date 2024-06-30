"use server";

import Account from "@/models/account";
import { jsonStrip } from "@/utils";

export async function searchPlayers(
    q: string,
    roleFilter: string,
    accountStatus: string,
    page: number
) {
    const pageSize = 50;
    try {
        let ban = [] as any[];
        if (accountStatus === "active") {
            ban = [
                { banUntil: { $lt: new Date() } },
                { banUntil: { $eq: null } },
            ];
        } else if (accountStatus === "banned") {
            ban = [{ banUntil: { $gt: new Date() } }];
        } else {
            ban = [{ banUntil: { $ne: "rv" } }];
        }

        const query = {
            $and: [
                {
                    $or: [
                        { username: { $regex: q, $options: "i" } },
                        { email: { $regex: q, $options: "i" } },
                        { riot_id: { $regex: q, $options: "i" } },
                    ],
                },
                {
                    $or: [...ban],
                },
            ],

            role: roleFilter === "all" ? { $ne: "rv" } : roleFilter,
        };

        const rs = await Account.find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .exec();

        const count = await Account.countDocuments(query).exec();
        const pageCount = Math.ceil(count / pageSize);

        return { success: true, data: jsonStrip(rs), count, pageCount };
    } catch (e) {
        console.error(e);
        return { success: false, msg: "Cannot filter players" };
    }
}
