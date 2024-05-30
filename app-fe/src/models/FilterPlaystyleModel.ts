import mongoose, { Schema } from "mongoose";

const FilterPlaystyleSchema = new Schema(
    {
        label: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const FilterPlaystyles =
    mongoose.models.FilterPlaystyles ||
    mongoose.model("FilterPlaystyles", FilterPlaystyleSchema);

export default FilterPlaystyles;
