import PremiumTransactions, {
    PremiumStatus,
} from "@/models/premiumTransactionModel";
import { addMonth } from "@/utils";

export async function getPremiumExpiry(userId: string) {
    const lastSup = await PremiumTransactions.findOne({
        status: PremiumStatus.PAID,
        subId: userId,
    }).sort({
        to: "desc",
    });

    return lastSup?.to;
}

export async function createOrder(
    userId: string,
    months: number,
    price: number
) {
    const current = (await getPremiumExpiry(userId)) ?? new Date();
    const newExpiry = new Date(current);
    addMonth(newExpiry, 3);

    const newOrder = await PremiumTransactions.create({
        subId: userId,
        from: current,
        to: newExpiry,
        finalPrice: price,
    });

    return newOrder;
}
