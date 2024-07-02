import dbConnect from "@/lib/mongoConnect";
import FilterPlaystyles from "@/models/filterPlaystyleModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  if (req.method === "GET") {
    try {
      const playstyles = await FilterPlaystyles.find({});
      res.status(200).json(playstyles);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
