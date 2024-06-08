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
      const pendingRequest = await FriendRequest.findOne({
        $or: [
          { sender_id, receiver_id, status: "pending" },
          { sender_id: receiver_id, receiver_id: sender_id, status: "pending" },
        ],
      });

      const acceptedRequest = await FriendRequest.findOne({
        $or: [
          { sender_id, receiver_id, status: "accepted" },
          {
            sender_id: receiver_id,
            receiver_id: sender_id,
            status: "accepted",
          },
        ],
      });

      if (pendingRequest) {
        return res.status(200).json({ exists: true, isFriend: false });
      } else if (acceptedRequest) {
        return res.status(200).json({ exists: false, isFriend: true });
      } else {
        return res.status(200).json({ exists: false, isFriend: false });
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
