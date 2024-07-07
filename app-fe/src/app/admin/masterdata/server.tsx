"use server";

import dbConnect from "@/lib/mongoConnect";
import MasterDatas from "@/models/masterDataModel";
import { adminOrLogin } from "@/utils/server";
import { redirect } from "next/navigation";

export async function saveMasterData(data: FormData) {
    try {
        const session = await adminOrLogin();
        await MasterDatas.updateOne(
            {},
            {
                $set: {
                    premiumPrice: parseFloat(
                        data.get("premiumPrice")?.toString() ?? "19000"
                    ),
                },
            },
            {
                upsert: true,
            }
        ).exec();
    } catch (e) {
        console.error(e);
        return { success: false, msg: "False to sent invitation!" };
    }

    redirect("/admin");
}
