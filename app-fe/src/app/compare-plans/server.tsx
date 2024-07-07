"use server";

import dbConnect from "@/lib/mongoConnect";
import { createPremiumCheckout } from "@/lib/vnpay";
import { createOrder } from "@/repositories/premiumRepository";
import { sessionOrLogin } from "@/utils/server";
import { redirect } from "next/navigation";

export async function pay(months: number) {
    let url = undefined;
    try {
        const session = await sessionOrLogin();
        await dbConnect();
        const order = await createOrder(
            session.user.id,
            months,
            19000 * months
        );
        url = await createPremiumCheckout(order);
    } catch (e) {
        console.error(e);
        return { success: false, msg: "False to sent invitation!" };
    }

    if (url) {
        redirect(url);
    }
}
