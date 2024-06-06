import mongoose, { Model, Schema } from "mongoose";
import Account, { IAccount } from "./account";
import Squads, { ISquad } from "./squadModel";
import { WithId } from "@/utils/types";

export interface ISquadEnrollment {
    accountId: IAccount;
    squadId: WithId<ISquad>;
    leaveDate?: Date | null;
    rating?: number | null;
    sentimentRating?: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

const SquadEnrollmentSchema = new Schema<ISquadEnrollment>(
    {
        accountId: {
            type: mongoose.Types.ObjectId,
            ref: Account,
            required: true,
        },
        squadId: {
            type: mongoose.Types.ObjectId,
            ref: Squads,
            required: true,
        },
        leaveDate: {
            type: Date,
            default: null,
        },
        rating: {
            type: Number,
            default: null,
        },
        sentimentRating: {
            type: Boolean,
            default: false,
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const SquadEnrollments: Model<ISquadEnrollment> =
    mongoose.models.SquadEnrollments ||
    mongoose.model("SquadEnrollments", SquadEnrollmentSchema);

export default SquadEnrollments;
