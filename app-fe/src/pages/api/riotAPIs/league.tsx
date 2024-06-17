import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { encryptedSummonerId, apiKey } = req.query;

  try {
    const response = await fetch(
      `https://vn2.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(
        encryptedSummonerId
      )}?api_key=${apiKey}`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch data from Riot API" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
