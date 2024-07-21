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
            const feedback = await Feedback.find({ reciever_id: id })
                .sort({ createdAt: -1 })
                .populate("sender_id")
                .exec();

            const formattedFeedback = feedback.map((fb) => ({
                id: fb._id,
                sender_id: fb.sender_id,
                rate: fb.rate,
                reciever_id: fb.reciever_id,
                createdAt: (fb as any).createdAt,
                text: fb.text,
                vote: fb.vote,
                voteCount: fb.vote.length,
                // Add more fields as necessary
            }));

            return res.status(200).json(formattedFeedback);
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Internal Server Error", error });
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
}
