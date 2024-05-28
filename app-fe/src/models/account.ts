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
        }
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const Account = mongoose.models.accounts || mongoose.model("accounts", AccountSchema);

export default Account;
