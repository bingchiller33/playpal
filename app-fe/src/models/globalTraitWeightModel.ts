import mongoose, { Schema } from "mongoose";

const GlobalWeightSchema = new Schema(
    {
        mode: {
            type: String,
            required: true,
            unique: true,
        },
        weights: {
            type: Map,
            of: Number,
            default: {},
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const GlobalWeights =
    mongoose.models.GlobalWeights ||
    mongoose.model("GlobalWeights", GlobalWeightSchema);

export default GlobalWeights;
