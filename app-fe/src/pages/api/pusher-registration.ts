import { beamServer } from "@/lib/pusher.server";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    const beamsToken = beamServer.generateToken(session!.user.id);
    res.send(JSON.stringify(beamsToken));
}
