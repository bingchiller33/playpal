import mongoose, { Model, Schema } from "mongoose";
import Squads, { ISquad } from "./squadModel";
import { WithId } from "@/utils/types";

export interface ISquadMatch {
    squadA: WithId<ISquad> | mongoose.Types.ObjectId;
    squadB: WithId<ISquad> | mongoose.Types.ObjectId;
    aAccept: boolean;
    bAccept: boolean;
}

const SquadMatchSchema = new Schema<ISquadMatch>(
    {
        squadA: {
            type: mongoose.Types.ObjectId,
            ref: Squads,
            required: true,
        },
        squadB: {
            type: mongoose.Types.ObjectId,
            ref: Squads,
            required: true,
        },
        aAccept: {
            type: Boolean,
        },
        bAccept: {
            type: Boolean,
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const SquadMatchs: Model<ISquadMatch> =
    mongoose.models.SquadMatchs ||
    mongoose.model("SquadMatchs", SquadMatchSchema);

export default SquadMatchs;
