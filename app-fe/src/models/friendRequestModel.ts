import mongoose, { Schema } from "mongoose";

const friendRequestSchema = new Schema(
  {
    sender_id: {
      type: String,
      required: true,
    },
    receiver_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const FriendRequest = mongoose.model("friendrequest", friendRequestSchema);

export default FriendRequest;
