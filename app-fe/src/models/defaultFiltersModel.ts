import mongoose, { Model, Schema } from "mongoose";

export interface IDefaultFilter {
    lang?: mongoose.ObjectId;
    lolServer?: mongoose.ObjectId;
    lolMode?: mongoose.ObjectId;
}

const DefaultFilterSchema = new Schema<IDefaultFilter>(
    {
        lang: {
            type: mongoose.Types.ObjectId,
            default: null,
        },

        lolServer: {
            type: mongoose.Types.ObjectId,
            default: null,
        },

        lolMode: {
            type: mongoose.Types.ObjectId,
            default: null,
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const DefaultFilters: Model<IDefaultFilter> =
    mongoose.models.DefaultFilters ||
    mongoose.model("DefaultFilters", DefaultFilterSchema);

export default DefaultFilters;
