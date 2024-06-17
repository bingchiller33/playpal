import mongoose, { Model, Models, Schema } from "mongoose";

export interface IFilterLanguage {
    label: string;
}

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
const FilterLanguages: Model<IFilterLanguage> =
    mongoose.models.FilterLanguages ||
    mongoose.model("FilterLanguages", FilterLanguageSchema);

export default FilterLanguages;
