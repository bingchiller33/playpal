import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "POST") {
    const {
      username,
      riot_id,
      bio,
      avatar,
      age,
      gender,
      playstyles,
      language,
      email,
    } = req.body;

    try {
      const profile = await Account.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            username,
            riot_id,
            bio,
            avatar,
            age,
            gender,
            playstyles,
            language,
            email,
          },
        },
        { new: true }
      );
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      return res
        .status(200)
        .json({ message: "Profile updated successfully", profile });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
