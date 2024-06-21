import mongoose, { Model, Schema } from "mongoose";

export interface IMasterDataAlgo {
    variance: number;
    base: number;
    exp: number;
}

const MasterDataAlgoSchema = new Schema<IMasterDataAlgo>(
    {
        variance: {
            type: Number,
            required: true,
        },
        base: {
            type: Number,
            required: true,
        },
        exp: {
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
const MasterDataAlgos: Model<IMasterDataAlgo> =
    mongoose.models.MasterDataAlgos ||
    mongoose.model("MasterDataAlgos", MasterDataAlgoSchema);

export default MasterDataAlgos;
