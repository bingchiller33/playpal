import { WithId } from "@/utils/types";
import Account, { IAccount } from "./account";
import Squads, { ISquad } from "./squadModel";
import mongoose, { Model, Schema } from "mongoose";


export interface ISquadInvitation {
    accountId: IAccount;
    inviterId: IAccount;
    squadId: WithId<ISquad>;
    createdAt: Date;
    updatedAt?: Date;
}

const SquadInvitationSchema = new Schema<ISquadInvitation>(
    {
        accountId: {
            type: mongoose.Types.ObjectId,
            ref: Account,
            required: true,
        },

        inviterId: {
            type: mongoose.Types.ObjectId,
            ref: Account,
            required: true,
        },

        squadId: {
            type: mongoose.Types.ObjectId,
            ref: Squads,
            required: true,
        },
    },
    {
        timestamps: true,
    }

)

const SquadInvitations: Model<ISquadInvitation> =
    mongoose.models.SquadInvitations ||
    mongoose.model("SquadInvitations", SquadInvitationSchema);

export default SquadInvitations;