import mongoose, { Schema } from "mongoose";
import Account from "./account";
import Squads from "./squadModel";

const SquadEnrollmentSchema = new Schema(
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
        },
        rating: {
            type: Number,
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
const SquadEnrollments =
    mongoose.models.SquadEnrollments ||
    mongoose.model("SquadEnrollments", SquadEnrollmentSchema);

export default SquadEnrollments;
