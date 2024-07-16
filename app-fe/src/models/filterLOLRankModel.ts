import mongoose, { Model, Schema } from "mongoose";

export interface IFilterLOLRank {
    name: string;
    iconUrl: string;
    value: number;
    order: number;
}

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
        value: {
            type: Number,
            required: true,
        },
        order: {
            type: Number,
            required: true,
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const FilterLOLRanks: Model<IFilterLOLRank> =
    mongoose.models.FilterLOLRanks ||
    mongoose.model("FilterLOLRanks", FilterLOLRankSchema);

export default FilterLOLRanks;
