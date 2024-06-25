import mongoose, { Schema, Model } from "mongoose";
import { WithId } from "@/utils/types";
import { IAccount } from "./account";
import { Mode } from "fs";


export interface IFeedback {
    reciever_id: WithId<IAccount>;
    sender_id: WithId<IAccount>;
    rate: number;
    text: string;
    vote: number;
}

const feedbackSchema = new Schema<IFeedback>(
    {
        reciever_id: {
            type: mongoose.Types.ObjectId,
            require: true,
        },
        sender_id: {
            type: mongoose.Types.ObjectId,
            require: true,
        },
        rate: {
            type: Number,
            require: true,
        },
        text: {
            type: String,
            require: true,
        },
        vote: {
            type: Number,
            require: true,
        },
    },
    {
        timestamps: true
    }
)

const Feedback: Model<IFeedback> = mongoose.models.feedbacks || mongoose.model<IFeedback>("feedbacks", feedbackSchema)

export default Feedback;