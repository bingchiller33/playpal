import { Schema, model, models } from "mongoose";

const friendRequestSchema = new Schema(
  {
    sender_id: {
      type: String,
      required: [true, "Sender ID is required"],
    },
    receiver_id: {
      type: String,
      required: [true, "Receiver ID is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const FriendRequest =
  models.FriendRequest || model("FriendRequest", friendRequestSchema);

export default FriendRequest;
