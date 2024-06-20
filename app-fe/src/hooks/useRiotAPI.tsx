const API_KEY = "RGAPI-3197410a-a5fd-440d-8bde-c1da766cf50f";
const BASE_API_URL = "/api/riotAPIs";

export const fetchAccountV1 = async (gameName: string, tagLine: string) => {
  const response = await fetch(
    `${BASE_API_URL}/account?gameName=${gameName}&tagLine=${tagLine}&apiKey=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};

export const fetchSummonerV4 = async (encryptedPUUID: string) => {
  const response = await fetch(
    `${BASE_API_URL}/summoner?encryptedPUUID=${encryptedPUUID}&apiKey=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};

export const fetchLeagueV4 = async (encryptedSummonerId: string) => {
  const response = await fetch(
    `${BASE_API_URL}/league?encryptedSummonerId=${encryptedSummonerId}&apiKey=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};

export const fetchMatchesByPUUID = async (puuid: string) => {
  const response = await fetch(`${BASE_API_URL}/matches/by-puuid/${puuid}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};

export const fetchMatchById = async (matchId: string) => {
  const response = await fetch(`${BASE_API_URL}/matches/${matchId}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};
