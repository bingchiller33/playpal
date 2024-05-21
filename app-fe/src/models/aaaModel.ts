import mongoose, { Schema } from "mongoose";

const aaaSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "aaa name is Requiredd"],
            unique: [true, "aaa name is not duplicate"],
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const Aaas = mongoose.models.aaas || mongoose.model("aaas", aaaSchema);

export default Aaas;
