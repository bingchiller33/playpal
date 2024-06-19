import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q } = req.query;
  if (!q || typeof q !== "string") {
    return res.status(400).json({ message: "Invalid query" });
  }

  try {
    await dbConnect();

    const users = await Account.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { riot_id: { $regex: q, $options: "i" } },
      ],
    }).select("_id username email avatar_url rating riot_id");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
