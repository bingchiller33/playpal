import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoConnect";
import FriendRequest from "@/models/friendRequestModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "DELETE") {
    const { sender_id, receiver_id } = req.body;

    try {
      await FriendRequest.findOneAndDelete({
        sender_id,
        receiver_id,
      });

      return res.status(200).json({ message: "Friend request cancelled" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to cancel friend request", error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
