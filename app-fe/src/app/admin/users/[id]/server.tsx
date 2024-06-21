"use server";

import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";
import { adminOrLogin } from "@/utils/server";

export async function changeRole(userId: string, role: string) {
    try {
        await adminOrLogin();
        await dbConnect();
        await Account.updateOne({ _id: userId }, { role }).exec();

        return { success: true };
    } catch (e) {
        return { success: false, msg: "Error: Please try again later" };
    }
}

export async function banUser(
    userId: string,
    banUntil: Date | null,
    banReason: string | null
) {
    try {
        await adminOrLogin();
        await dbConnect();
        await Account.updateOne(
            { _id: userId },
            { banUntil, banReason }
        ).exec();

        return { success: true };
    } catch (e) {
        return { success: false, msg: "Error: Please try again later" };
    }
}
