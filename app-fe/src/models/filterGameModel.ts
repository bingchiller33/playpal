import mongoose, { Schema } from "mongoose";

const FilterGameSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is required!"],
            unique: [true, "name must be unique!"],
        },
        iconUrl: {
            type: String,
            required: [true, "iconUrl is required!"],
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const FilterGames =
    mongoose.models.FilterGames ||
    mongoose.model("FilterGames", FilterGameSchema);

export default FilterGames;
