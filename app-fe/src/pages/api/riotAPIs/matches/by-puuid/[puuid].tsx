import type { NextApiRequest, NextApiResponse } from "next";

const QUEUE_ID = "420";
const API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;
const BASE_URL = "https://sea.api.riotgames.com/lol/match/v5/matches";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { puuid } = req.query;

  try {
    const response = await fetch(
      `${BASE_URL}/by-puuid/${puuid}/ids?queue=${QUEUE_ID}&start=0&count=20&api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
