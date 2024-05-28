import mongoose, { Schema } from "mongoose";

const friendSchema = new Schema(
  {
    account_id_1: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    account_id_2: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Friend = mongoose.models.Friend || mongoose.model("Friend", friendSchema);

export default Friend;
