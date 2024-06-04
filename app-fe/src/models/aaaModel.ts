import mongoose, { Model, Schema } from "mongoose";

export interface IAaa {
    name: string;
}

const aaaSchema = new Schema<IAaa>(
    {
        name: {
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
const Aaas: Model<IAaa> =
    mongoose.models.aaas || mongoose.model("aaas", aaaSchema);

export default Aaas;
