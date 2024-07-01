import dbConnect from "@/lib/mongoConnect";
import FilterLanguages from "@/models/filterLanguageModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const languages = await FilterLanguages.find({});
      res.status(200).json(languages);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
