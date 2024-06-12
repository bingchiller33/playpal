'use server'

import { ISquadInvitation } from "@/models/squadInvitation";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { createInvitationMember } from "@/repositories/squadRepository";
import { getServerSession } from "next-auth";

export async function createInvitation(inviation: ISquadInvitation){
    try {
        console.log(inviation);
        const session = await getServerSession(authOptions);
        if(!session){
            return {success: false, msg: "Unauthenticated!"};
        }

        const info = createInvitationMember(inviation);
        return {success: true, data: info}
        
    }catch(e){
        return {success: false, msg: "False to sent invitation!"}
    }
}