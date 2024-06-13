"use server";

import SquadEnrollments from "@/models/squadEnrollmentModel";
import { sessionOrLogin } from "@/utils/server";
import * as squadRepo from "@/repositories/squadRepository";

export async function leaveSquad(id: string, rating: number) {
    try {
        const session = await sessionOrLogin();
        if (await squadRepo.leaveSquad(id, session.user.id, rating)) {
            return { success: true };
        } else {
            return {
                success: false,
                msg: "Cannot find squad to leave. Please reload the page and try again!",
            };
        }
    } catch (e) {
        return {
            success: false,
            msg: "Cannot leave squad! Please try again later",
        };
    }
}
