import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongoConnect";
import Account from "@/models/account";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    if (method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        console.log("No token found");
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { password, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        await dbConnect();

        const user = await Account.findById(req.query.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password!);

        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Invalid current password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
