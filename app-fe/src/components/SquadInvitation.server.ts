'use server'

import dbConnect from "@/lib/mongoConnect";
import { sendNotification } from "@/lib/pusher.server";
import Account, { IAccount } from "@/models/account";
import SquadInvitations, { ISquadInvitation } from "@/models/squadInvitation";
import Squads from "@/models/squadModel";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { createInvitationMember } from "@/repositories/squadRepository";
import { jsonStrip } from "@/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


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

export async function getInvitationToSquad(accountId: string, squadId: string) {
    const invite =  jsonStrip(await SquadInvitations.findOne({accountId: accountId, squadId: squadId}));
    return invite;
}


export async function sendInvitationToSquad(inviterId:string, accountId: string, squadId: string, invitationId: string) {
    const session = await getServerSession(authOptions);
    if(!session){
        redirect("/auth/login");
    }
    const inviterInfo = jsonStrip(await Account.findById(inviterId));
    let inviterName = "";
    inviterInfo?.username ? inviterName = inviterInfo?.username : inviterName = "no username";

    const squadInfo = jsonStrip(await Squads.findById(squadId));
    let squadName = "";
    squadInfo?.name ? squadName = squadInfo.name : squadName = "no squad name";
    

    await dbConnect();
    sendNotification({
        title:"You have an invitation to a squad.",
        content: inviterName + " wants you to join the " + squadName +" squad.",
        tag: "invitation",
        user: accountId,
        saveHistory: true
    })
    
}