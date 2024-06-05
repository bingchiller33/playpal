import mongoose, { Schema } from "mongoose";

const FilterLOLServerSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is required!"],
            unique: [true, "name must be unique!"],
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const FilterLOLServers =
    mongoose.models.FilterLOLServers ||
    mongoose.model("FilterLOLServers", FilterLOLServerSchema);

export default FilterLOLServers;
