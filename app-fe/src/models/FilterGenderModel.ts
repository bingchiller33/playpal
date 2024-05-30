import mongoose, { Schema } from "mongoose";

const FilterGenderSchema = new Schema(
    {
        label: {
            type: String,
            required: [true, "Gender is required!"],
            unique: [true, "Gender must be unique!"],
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const FilterGenders =
    mongoose.models.FilterGenders ||
    mongoose.model("FilterGenders", FilterGenderSchema);

export default FilterGenders;
