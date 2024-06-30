import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoConnect";
import Feedback from "@/models/feedbackModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      const deletedFeedback = await Feedback.deleteOne({_id: id})
      return res.status(200).json(deletedFeedback);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  } 
  else if (req.method === "PUT") {
    const {rate, text} = req.body
    try {
      const updatedFeedback = await Feedback.updateOne({_id: id},{$set:{rate:rate, text:text}})
      return res.status(200).json(updatedFeedback);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  
}
