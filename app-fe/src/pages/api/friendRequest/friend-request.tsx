import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoConnect";
import FriendRequest from "@/models/friendRequestModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    const { sender_id, receiver_id } = req.body;

    try {
      console.log(sender_id, receiver_id);

      await FriendRequest.create({
        sender_id,
        receiver_id,
      });
      return res.status(201).json({ message: "Friend request sent" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to send friend request", error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
