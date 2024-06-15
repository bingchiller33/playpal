"use server";

import Account from "@/models/account";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { jsonStrip } from "@/utils";
import { getServerSession } from "next-auth";

export async function getAccountInfo() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { success: false, msg: "Unauthenticated!" };
        }
        // TODO: remove sensitive info
        const info = jsonStrip(await Account.findById(session.user.id));
        return { success: true, data: info };
    } catch (e) {
        return { success: false, msg: "Unable to fetch user data!" };
    }
}
