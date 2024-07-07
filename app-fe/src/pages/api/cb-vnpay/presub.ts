import { NextApiRequest, NextApiResponse } from "next";
import { vnpay } from "@/lib/vnpay";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoConnect";
import PremiumTransactions, {
    PremiumStatus,
} from "@/models/premiumTransactionModel";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const verify = vnpay.verifyReturnUrl(req.query as any);
        console.log({ verify, query: req.query });
        if (!verify.isVerified) {
            res.redirect("/premium-upgrade-failed");
            return;
        }
        if (!verify.isSuccess) {
            res.redirect("/premium-upgrade-failed");
            return;
        }

        await dbConnect();
        await PremiumTransactions.updateOne(
            { _id: req.query.vnp_TxnRef },
            {
                $set: {
                    status: PremiumStatus.PAID,
                },
            }
        ).exec();

        res.redirect("/premium-upgrade-success");
        return;
    } catch (error) {
        console.error(error);
        res.redirect("/premium-upgrade-failed");
        return;
    }
}
