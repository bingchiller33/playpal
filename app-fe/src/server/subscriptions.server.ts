"use server";

import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";
import PremiumTransactions, {
    PremiumStatus,
} from "@/models/premiumTransactionModel";
import { jsonStrip } from "@/utils";
import { adminOrLogin, sessionOrLogin } from "@/utils/server";
import * as repo from "@/repositories/premiumRepository";
import { revalidatePath } from "next/cache";

export async function getPremiumHistory(
    userId: string,
    page: number,
    pageSize: number = 10
) {
    try {
        const session = await sessionOrLogin();
        await dbConnect();
        const user = jsonStrip(await Account.findById(session.user.id).exec());
        if (!user) {
            return { success: false, msg: "Error: Unauthorized!" };
        }

        if (userId !== user._id.toString() && user.role !== "admin") {
            return { success: false, msg: "Error: Unauthorized!" };
        }

        const data = await PremiumTransactions.find({
            subId: userId,
            status: PremiumStatus.PAID,
        })
            .skip(pageSize * page)
            .limit(pageSize)
            .exec();

        const count = await PremiumTransactions.countDocuments({
            subId: userId,
            status: PremiumStatus.PAID,
        });

        return {
            success: true,
            data: jsonStrip(data),
            count,
            pageCount: Math.ceil(count / pageSize),
        };
    } catch (e) {
        console.error(e);
        return { success: false, msg: "Error: Please try again later" };
    }
}

export async function getFutPremiumExpiry(userId: string) {
    try {
        const session = await sessionOrLogin();
        await dbConnect();
        const user = await Account.findById(session.user.id).exec();
        if (!user) {
            return { success: false, msg: "Error: Unauthorized!" };
        }

        if (userId !== user._id.toString() && user.role !== "admin") {
            return { success: false, msg: "Error: Unauthorized!" };
        }

        return {
            success: true,
            data: await repo.getFutPremiumExpiry(userId),
        };
    } catch (e) {
        console.error(e);
        return { success: false, msg: "Error: Please try again later" };
    }
}

export async function setExpiry(userId: string, date: Date) {
    try {
        const session = await adminOrLogin();
        await dbConnect();
        await repo.setExpiry(userId, date);
        revalidatePath(`/admin/users`);
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, msg: "Error: Please try again later" };
    }
}

export async function removeSubscription(userId: string) {
    try {
        const session = await adminOrLogin();
        await dbConnect();
        await repo.removeSubscription(userId);
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, msg: "Error: Please try again later" };
    }
}
