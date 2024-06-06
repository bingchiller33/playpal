import mongoose, { Schema } from "mongoose";
import { WeightSchema } from "./weightSchema";

const GlobalWeightSchema = new Schema(
    {
        mode: {
            type: String,
            required: true,
            unique: true,
        },
        weights: {
            type: WeightSchema,
            required: true,
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
