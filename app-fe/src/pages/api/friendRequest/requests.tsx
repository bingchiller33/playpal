import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "@/lib/mongoConnect";
import FriendRequest from "@/models/friendRequestModel";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method } = req;
  const session = await getSession({ req });

  console.log("Session:", session);

  if (!session) {
    console.log("No session found");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.user.id;

  switch (method) {
    case "GET":
      try {
        const friendRequests = await FriendRequest.find({
          receiver_id: userId,
          status: "pending",
        });

        res.status(200).json(friendRequests);
      } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
