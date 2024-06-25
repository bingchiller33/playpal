import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoConnect";
import Feedback from "@/models/feedbackModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const feedback = await Feedback.find({ reciever_id: id }).lean();
      return res.status(200).json(feedback);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
