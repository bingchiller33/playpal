"use server";

import dbConnect from "@/lib/mongoConnect";
import MasterDatas from "@/models/masterDataModel";
import { getMasterData } from "@/repositories/masterDataRepository";
import { jsonStrip } from "@/utils";
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
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, msg: "False to sent invitation!" };
    }
}

export async function getMd() {
    try {
        await dbConnect();
        return jsonStrip(await getMasterData());
    } catch (e) {
        console.error(e);
        return { success: false, msg: "False to sent invitation!" };
    }
}
