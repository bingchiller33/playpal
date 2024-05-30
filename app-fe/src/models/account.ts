import mongoose, { Schema } from "mongoose";

const AccountSchema = new Schema(
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
        matchMakingWeights: {
            type: [
                new Schema(
                    {
                        mode: {
                            type: String,
                            required: true,
                        },
                        weights: {
                            type: Map,
                            of: Number,
                            default: {},
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
const Account =
    mongoose.models.accounts || mongoose.model("accounts", AccountSchema);

export default Account;
