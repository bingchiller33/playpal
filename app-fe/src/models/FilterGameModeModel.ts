import mongoose, { Schema } from "mongoose";
import FilterGames from "./FilterGameModel";

const FilterGameModeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is required!"],
        },
        gameId: {
            type: mongoose.Types.ObjectId,
            ref: FilterGames,
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const FilterGameModes =
    mongoose.models.FilterGameModes ||
    mongoose.model("FilterGameModes", FilterGameModeSchema);

export default FilterGameModes;
