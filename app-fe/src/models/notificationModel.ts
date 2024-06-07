import mongoose, { Model, Schema } from "mongoose";
import { IAccount } from "./account";
import { MongooseRef, WithId } from "@/utils/types";

export interface INotification {
    owner: MongooseRef<IAccount>;
    title: string;
    content: string;
    img?: string;
    href?: string;
    tag?: string;
    data?: string;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        owner: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        img: {
            type: String,
        },
        tag: {
            type: String,
        },
        data: {
            type: String,
        },
        href: {
            type: String,
        },
        isRead: {
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
const Notifications: Model<INotification> =
    mongoose.models.Notifications ||
    mongoose.model("Notifications", NotificationSchema);

export default Notifications;
