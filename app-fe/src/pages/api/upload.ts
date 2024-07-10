import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { file } = req.body;

    try {
      const uploadResponse = await cloudinary.v2.uploader.upload(file, {
        upload_preset: "playpal",
      });

      console.log("Cloudinary upload response:", uploadResponse);

      return res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
