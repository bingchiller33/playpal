"use server";

import Account from "@/models/account";
import { jsonStrip } from "@/utils";

export async function searchPlayers(
    q: string,
    roleFilter: string,
    accountStatus: string
) {
    console.log({ q, roleFilter, accountStatus });
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

        const rs = await Account.find({
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
        }).exec();

        return { success: true, data: jsonStrip(rs) };
    } catch (e) {
        console.error(e);
        return { success: false, msg: "Cannot filter players" };
    }
}
