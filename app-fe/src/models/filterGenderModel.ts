import mongoose, { Model, Schema } from "mongoose";

export interface IFilterGender {
    label: string;
    value: number;
}

const FilterGenderSchema = new Schema<IFilterGender>(
    {
        label: {
            type: String,
            required: true,
            unique: true,
        },
        // Also known as Masculinity score
        value: {
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
const FilterGenders: Model<IFilterGender> =
    mongoose.models.FilterGenders ||
    mongoose.model("FilterGenders", FilterGenderSchema);

export default FilterGenders;
