import mongoose, { Schema } from "mongoose";

const FilterLanguageSchema = new Schema(
    {
        label: {
            type: String,
            required: [true, "Language is required!"],
            unique: [true, "Language must be unique!"],
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const FilterLanguages =
    mongoose.models.FilterLanguages ||
    mongoose.model("FilterLanguages", FilterLanguageSchema);

export default FilterLanguages;
