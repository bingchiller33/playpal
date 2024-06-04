import mongoose, { Model, Schema } from "mongoose";

export interface IFilterPlaystyle {
    label: string;
}

const FilterPlaystyleSchema = new Schema<IFilterPlaystyle>(
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
const FilterPlaystyles: Model<IFilterPlaystyle> =
    mongoose.models.FilterPlaystyles ||
    mongoose.model("FilterPlaystyles", FilterPlaystyleSchema);

export default FilterPlaystyles;
