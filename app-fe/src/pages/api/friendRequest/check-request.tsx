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
      const existingRequest = await FriendRequest.findOne({
        sender_id,
        receiver_id,
      });

      if (existingRequest) {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to check friend request", error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
