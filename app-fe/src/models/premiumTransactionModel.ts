import { MongooseRef } from "@/utils/types";
import mongoose, { Model, Schema } from "mongoose";
import Account, { IAccount } from "./account";

export interface IPremiumTransaction {
    subId: MongooseRef<IAccount>;
    from: Date;
    to: Date;
    finalPrice: number;
    status: string;
}

export enum PremiumStatus {
    ORDER_CREATED = "ORDER_CREATED",
    PAID = "PAID",
}

const premiumtransactionSchema = new Schema<IPremiumTransaction>(
    {
        subId: {
            type: mongoose.Types.ObjectId,
            ref: Account,
            required: true,
        },
        from: {
            type: Date,
            required: true,
        },
        to: {
            type: Date,
            required: true,
        },
        finalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: PremiumStatus.ORDER_CREATED,
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const PremiumTransactions: Model<IPremiumTransaction> =
    mongoose.models.premiumtransactions ||
    mongoose.model("premiumtransactions", premiumtransactionSchema);

export default PremiumTransactions;
