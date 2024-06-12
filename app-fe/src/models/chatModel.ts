import mongoose, { Schema, Model } from "mongoose";
import { WithId } from "@/utils/types";
import Account, { IAccount } from "./account";
import Squads, { ISquad } from "./squadModel";

export interface IChat{
    squad_id?: WithId<ISquad>;
    account_id?: WithId<IAccount>;
    text?: string;
}

const ChatSchema = new Schema<IChat>(
    {
        squad_id: {
            type: mongoose.Types.ObjectId,
            ref: Squads
        },
        account_id: {
            type: mongoose.Types.ObjectId,
            ref: Account
        },
        text: {
            type: String,
            required: [true, "Content is required"]
        }
    },
    {
        timestamps: true
    }
);

const Chat: Model<IChat> =
  mongoose.models.chats ||
  mongoose.model<IChat>("chats", ChatSchema);

export default Chat;