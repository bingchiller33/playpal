import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";
import { getSession } from "next-auth/react";
import { hash, compare } from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { currentPassword, newPassword } = req.body;

    try {
      const user = await Account.findOne({ email: session.user.email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValidPassword = await compare(currentPassword, user.password);

      if (!isValidPassword) {
        return res.status(403).json({ message: "Invalid current password" });
      }

      const hashedPassword = await hash(newPassword, 12);

      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
