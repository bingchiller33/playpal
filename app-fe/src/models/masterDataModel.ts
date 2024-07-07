import mongoose, { Model, Schema } from "mongoose";

export interface IMasterData {
    premiumPrice: number;
}

const masterdataSchema = new Schema<IMasterData>(
    {
        premiumPrice: {
            type: Number,
            required: true,
            default: 19000,
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const MasterDatas: Model<IMasterData> =
    mongoose.models.masterdatas ||
    mongoose.model("masterdatas", masterdataSchema);

export default MasterDatas;
