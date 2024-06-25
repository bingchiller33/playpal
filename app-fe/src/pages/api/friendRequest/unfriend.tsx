import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoConnect";
import Friend from "@/models/friendModel";
import { getToken } from "next-auth/jwt";
import FriendRequest from "@/models/friendRequestModel";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method } = req;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    console.log("No token found");
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (method) {
    case "DELETE":
      try {
        const { sender_id, receiver_id } = req.body;

        if (!sender_id || !receiver_id) {
          return res
            .status(400)
            .json({ message: "Sender and receiver IDs are required" });
        }

        const friendship = await Friend.findOne({
          $or: [
            { account_id_1: sender_id, account_id_2: receiver_id },
            { account_id_1: receiver_id, account_id_2: sender_id },
          ],
        });

        if (!friendship) {
          return res.status(404).json({ message: "Friendship not found" });
        }

        await Friend.deleteOne({
          $or: [
            { account_id_1: sender_id, account_id_2: receiver_id },
            { account_id_1: receiver_id, account_id_2: sender_id },
          ],
        });

        await FriendRequest.deleteOne({
          $or: [
            { sender_id: sender_id, receiver_id: receiver_id },
            { sender_id: receiver_id, receiver_id: sender_id },
          ],
        });

        res.status(200).json({ message: "Friendship ended successfully." });
      } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: "Internal server error", error });
      }
      break;
    default:
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
