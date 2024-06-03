import mongoose, { Schema, Model } from "mongoose";
import { WeightSchema, IWeight, modes } from "./weightSchema";
import FilterLOLRanks, { IFilterLOLRank } from "./filterLOLRankModel";
import FilterPlaystyles, { IFilterPlaystyle } from "./filterPlaystyleModel";
import { WithId } from "@/utils/types";
import FilterGenders, { IFilterGender } from "./filterGenderModel";

export interface MatchMakingWeight {
    mode: (typeof modes)[number];
    weights: IWeight;
}

export interface IAccount {
    email?: string;
    password?: string;
    token?: string;
    age?: number;
    gender?: WithId<IFilterGender>;
    playstyles: WithId<IFilterPlaystyle>[];
    // TODO: Change this after riot integration!
    lolRank?: IFilterLOLRank;
    verified?: boolean;
    matchMakingWeights: MatchMakingWeight[];
    createdAt?: Date;
    updatedAt?: Date;
}

const AccountSchema = new Schema<IAccount>(
    {
        email: {
            type: String,
            required: [true, "email is Requiredd"],
            unique: [true, "email is not duplicate"],
        },
        password: {
            type: String,
            required: [false],
        },
        token: {
            type: String,
        },
        verified: {
            type: Boolean,
        },
        age: {
            type: Number,
        },
        gender: {
            type: mongoose.Types.ObjectId,
            ref: FilterGenders,
        },
        playstyles: {
            type: [mongoose.Types.ObjectId],
            ref: FilterPlaystyles,
            default: [],
        },
        lolRank: {
            type: mongoose.Types.ObjectId,
            ref: FilterLOLRanks,
        },
        matchMakingWeights: {
            type: [
                new Schema(
                    {
                        mode: {
                            type: String,
                            required: true,
                        },
                        weights: {
                            type: WeightSchema,
                        },
                    },
                    { _id: false }
                ),
            ],
            default: [],
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const Account: Model<IAccount> =
    mongoose.models.accounts ||
    mongoose.model<IAccount>("accounts", AccountSchema);

export default Account;
