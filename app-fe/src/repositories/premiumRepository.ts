import PremiumTransactions, {
    PremiumStatus,
} from "@/models/premiumTransactionModel";
import { addMonth } from "@/utils";

async function latestOrder(userId: string) {
    const existSub = await PremiumTransactions.findOne({
        subId: userId,
        status: PremiumStatus.PAID,
    })
        .sort({
            to: "desc",
        })
        .exec();

    return existSub;
}

export async function getFutPremiumExpiry(userId: string) {
    const lastSup = await latestOrder(userId);
    if (!lastSup) {
        return undefined;
    }

    if (lastSup.to < new Date()) {
        return undefined;
    }

    return lastSup.to;
}

export async function createOrder(
    userId: string,
    months: number,
    price: number
) {
    const current = (await getFutPremiumExpiry(userId)) ?? new Date();
    const newExpiry = new Date(current);
    addMonth(newExpiry, months);

    const newOrder = await PremiumTransactions.create({
        subId: userId,
        from: current,
        to: newExpiry,
        finalPrice: price,
    });

    return newOrder;
}

export async function setExpiry(userId: string, date: Date) {
    const existSub = await latestOrder(userId);

    if (existSub) {
        await PremiumTransactions.updateOne(
            { _id: existSub._id },
            { to: date }
        ).exec();
    } else {
        await PremiumTransactions.create({
            subId: userId,
            status: PremiumStatus.PAID,
            finalPrice: 0,
            from: new Date(),
            to: date,
        });
    }
}

export async function removeSubscription(userId: string) {
    const existSub = await latestOrder(userId);
    if (!existSub) {
        return;
    }

    const newExp = new Date();
    newExp.setHours(0);
    newExp.setMinutes(0);
    newExp.setSeconds(0);
    await PremiumTransactions.updateOne(
        { _id: existSub._id },
        { to: newExp }
    ).exec();
}
