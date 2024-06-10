"use server";
import dbConnect from "@/lib/mongoConnect";
import Chat, { IChat } from "@/models/chatModel";
import { jsonStrip } from "@/utils";



export async function getChat(squadId: String) {
    try {
        await dbConnect();
        const chat = jsonStrip(await Chat.find({squad_id: squadId}).populate('account_id').exec()) ;
        if(chat)
            return {data: chat}
    } catch (error) {
        console.error(error);
    }
}

export async function create_message(squad_id: String, account_id: String, text: String ){
    try{
        await dbConnect();
        const newMessage = await Chat.create({squad_id, account_id, text})
    } catch (error) {
        console.error(error);
    }
}