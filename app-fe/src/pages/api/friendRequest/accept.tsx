import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/mongoConnect";
import FriendRequest from "@/models/friendRequestModel";
import Friend from "@/models/friendModel";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method } = req;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    console.log("No token found");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = token.sub;

  switch (method) {
    case "POST":
      try {

        const { requestId } = req.body;

        if (!requestId) {
          return res.status(400).json({ message: "Request ID is required" });
        }

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
          return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.receiver_id !== userId) {
          return res.status(403).json({
            message: "You are not authorized to accept this friend request",
          });
        }

        const newFriendship = new Friend({
          account_id_1: friendRequest.sender_id,
          account_id_2: userId,
        });
        await newFriendship.save();

        friendRequest.status = "accepted";
        await friendRequest.save();

        res.status(200).json({ message: "Friend request accepted" });
      } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: "Internal server error", error });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
