import mongoose, { Schema } from "mongoose";

const FilterLOLRankSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is required!"],
            unique: [true, "name must be unique!"],
        },
        iconUrl: {
            type: String,
            required: [true, "iconIUrl is required!"],
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const FilterLOLRanks =
    mongoose.models.FilterLOLRanks ||
    mongoose.model("FilterLOLRanks", FilterLOLRankSchema);

export default FilterLOLRanks;
