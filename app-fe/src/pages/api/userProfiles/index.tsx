import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  await dbConnect();

  try {
    const userProfiles = await Account.find({}).lean();
    console.log(userProfiles.length);

    res.status(200).json(userProfiles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profiles" });
  }
}
