import mongoose, { Model, Schema } from "mongoose";
import Squads, { ISquad } from "./squadModel";

export interface IMatchMakingQueue {
    squadA: ISquad | mongoose.ObjectId;
    squadB: ISquad | mongoose.ObjectId;
    willMatchAt: Date;
}

const MatchMakingQueueSchema = new Schema<IMatchMakingQueue>(
    {
        squadA: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: Squads,
        },
        squadB: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: Squads,
        },
        willMatchAt: {
            type: Date,
            required: true,
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
).index({ squadA: 1, squadB: 1 }, { unique: true });

// Mapping to Collection
const MatchMakingQueues: Model<IMatchMakingQueue> =
    mongoose.models.MatchMakingQueues ||
    mongoose.model("MatchMakingQueues", MatchMakingQueueSchema);

export default MatchMakingQueues;
