import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoConnect";
import Feedback from "@/models/feedbackModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { id } = req.query;
  const userId = req.body.user;

  if (req.method === "PUT") {
    try {
      const feedback = await Feedback.updateOne({_id: id}, {$push:{vote: userId}})
      return res.status(201).json(feedback);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
