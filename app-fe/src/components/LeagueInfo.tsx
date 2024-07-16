import {
  fetchAccountV1,
  fetchLeagueV4,
  fetchMatchById,
  fetchMatchesByPUUID,
  fetchSummonerV4,
} from "@/hooks/useRiotAPI";
import { useEffect, useState } from "react";
import styles from "./LeagueInfo.module.css";
import { IoIosStats } from "react-icons/io";
import { PiClockCountdownFill } from "react-icons/pi";

interface LeagueInfoProps {
  profile: any;
  isCurrentUser: boolean;
}

const calculateKDA = (kills: number, deaths: number, assists: number) => {
  return deaths === 0 ? kills + assists : (kills + assists) / deaths;
};

const tierIcons: any = {
  unranked: "/assets/games/lol/rank-badges/unranked.webp",
  iron: "/assets/games/lol/rank-badges/iron.webp",
  bronze: "/assets/games/lol/rank-badges/bronze.webp",
  silver: "/assets/games/lol/rank-badges/silver.webp",
  gold: "/assets/games/lol/rank-badges/gold.webp",
  platinum: "/assets/games/lol/rank-badges/platinum.webp",
  emerald: "/assets/games/lol/rank-badges/emerald.webp",
  diamond: "/assets/games/lol/rank-badges/diamond.webp",
  master: "/assets/games/lol/rank-badges/master.webp",
  grandmaster: "/assets/games/lol/rank-badges/grandmaster.webp",
  challenger: "/assets/games/lol/rank-badges/challenger.webp",
};

const LeagueInfo = ({ profile, isCurrentUser }: LeagueInfoProps) => {
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [summonerInfo, setSummonerInfo] = useState<any>(null);
  const [leagueInfo, setLeagueInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [matches, setMatches] = useState<any[]>([]);
  const [matchDetails, setMatchDetails] = useState<any[]>([]);
  const [tierIcon, setTierIcon] = useState<string>("unranked");

  const [riotId, setRiotId] = useState<string>("");
  const [showRiotIdInput, setShowRiotIdInput] = useState<boolean>(
    !profile.riot_id
  );

  const [player, id] = profile.riot_id ? profile.riot_id.split("#") : ["", ""];

  const fetchData = async () => {
    setLoading(true);
    if (profile.riot_id) {
      try {
        const accountData = await fetchAccountV1(player, id);
        setAccountInfo(accountData);

        const summonerData = await fetchSummonerV4(accountData.puuid);
        setSummonerInfo(summonerData);

        const leagueData = await fetchLeagueV4(summonerData.id);
        setLeagueInfo(leagueData);
        if (leagueData.length > 0) {
          const tier = leagueData[0]?.tier.toLowerCase();
          setTierIcon(tierIcons[tier] || tierIcons["unranked"]);
        }

        const matchIds = await fetchMatchesByPUUID(accountData.puuid);
        setMatches(matchIds);

        const matchDataPromises = matchIds.map((matchId: string) =>
          fetchMatchById(matchId)
        );
        const matchesData = await Promise.all(matchDataPromises);
        setMatchDetails(matchesData);
      } catch (error) {
        console.error("Failed to fetch Riot information", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile.riot_id]);

  const handleRiotIdSave = async () => {
    if (riotId.includes("#")) {
      try {
        const response = await fetch(
          `/api/profile/${profile._id}/updateProfile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              riot_id: riotId,
            }),
          }
        );

        if (response.ok) {
          setShowRiotIdInput(false);
          profile.riot_id = riotId;
          fetchData();
        } else {
          const error = await response.json();
          console.error(error.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else {
      alert("Please enter a valid Riot ID (e.g., player#1234).");
    }
  };

  // Caculate Stats
  let totalKills = 0,
    totalDeaths = 0,
    totalAssists = 0,
    totalCS = 0,
    totalVisionScore = 0,
    totalDuration = 0,
    totalGold = 0,
    totalDamage = 0;

  matchDetails.forEach((match: any) => {
    const participant = match.info.participants.find(
      (p: any) => p.puuid === accountInfo.puuid
    );
    totalKills += participant.kills;
    totalDeaths += participant.deaths;
    totalAssists += participant.assists;
    totalCS +=
      participant.totalMinionsKilled + participant.neutralMinionsKilled;
    totalVisionScore += participant.visionScore;
    totalDuration += match.info.gameDuration / 60;
    totalGold += participant.goldEarned;
    totalDamage += participant.totalDamageDealtToChampions;
  });

  const averageKDA = calculateKDA(totalKills, totalDeaths, totalAssists);
  const averageCSPerMin = totalCS / totalDuration;
  const averageVisionScore = totalVisionScore / matchDetails.length;
  const averageGoldPerMin = totalGold / totalDuration;
  const averageDamagePerGold = totalDamage / totalGold;

  return (
    <div
      className={`${styles.container} ${
        loading ? styles.blurred : styles.unblur
      }`}
    >
      {loading && (
        <div className={styles.overlay}>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      )}
      {showRiotIdInput && (
        <div className={styles.overlay}>
          <div className={styles.inputContainer}>
            <h3 className={styles.inputHeader}>
              Please enter your Riot ID to fetch your League of Legends data:
            </h3>
            <input
              type="text"
              value={riotId}
              onChange={(e) => setRiotId(e.target.value)}
              placeholder="player#1234"
              className={styles.inputField}
            />
            <button onClick={handleRiotIdSave} className={styles.saveButton}>
              Save
            </button>
          </div>
        </div>
      )}
      <div className={styles.tabContainer}>
        <button className={styles.tabButton}>Valorant</button>
        <button className={`${styles.tabButton} ${styles.activeTab}`}>
          League Of Legends
        </button>
      </div>
      <div
        className={`${styles.content} ${showRiotIdInput ? styles.blurred : ""}`}
      >
        <div className={styles.playerInfo}>
          <h3>Player</h3>
          <div className={styles.iconContainer}>
            <img
              src="https://opgg-static.akamaized.net/meta/images/profile_icons/profileIcon6621.jpg?image=q_auto:good,a_0,f_webp,w_auto&v=1717557723274"
              alt="Player Icon"
              className={styles.playerIcon}
            />
            <span className={styles.level}>{summonerInfo?.summonerLevel}</span>
          </div>
          <div className={styles.nameTagContainer}>
            <p>{accountInfo?.gameName}</p>
            <p style={{ color: "gray" }}> #{accountInfo?.tagLine}</p>
          </div>
        </div>
        <div className={styles.overview}>
          <div className={styles.overviewTitles}>
            <div className={styles.iconAndTitle}>
              <IoIosStats fill={"#ed154c"} size={32} />
              <h3> Ranked Solo Overview</h3>
            </div>
            <div className={styles.playtimeAndMatches}>
              <p style={{ color: "#ed154c" }}>
                <PiClockCountdownFill size={24} fill="#ed154c" />
                {(totalDuration / 60).toFixed(1)}h Playtime
              </p>
              <p style={{ color: "#ed154c" }}>{matches.length} Matches</p>
            </div>
          </div>
          <div className={styles.overviewHeader}>
            <img
              width={250}
              src={tierIcon || tierIcons["unranked"]}
              alt="Rank Icon"
              className={styles.rankIcon}
            />
            <div className={styles.rankWRContainer}>
              <div className={styles.tierRankContainer}>
                <p style={{ color: "grey", fontWeight: "bold" }}>
                  {leagueInfo?.[0]?.tier} {leagueInfo?.[0]?.rank}
                </p>
                <p className={styles.bigBold}>
                  {leagueInfo?.[0]?.leaguePoints} LP
                </p>
              </div>
              <div className={styles.winrateContainer}>
                <p style={{ color: "grey", fontWeight: "bold" }}>Win Rate:</p>
                <p className={styles.bigBold}>
                  {(
                    (leagueInfo?.[0]?.wins /
                      (leagueInfo?.[0]?.wins + leagueInfo?.[0]?.losses)) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </div>
          <div className={styles.statsContainer}>
            <div className={styles.statBox}>
              <p>KDA</p>
              <p>{averageKDA.toFixed(2)}</p>
            </div>
            <div className={styles.statBox}>
              <p>Average K / D / A</p>
              <p>
                {totalKills / matchDetails.length} /
                {totalDeaths / matchDetails.length} /
                {totalAssists / matchDetails.length}
              </p>
            </div>
            <div className={styles.statBox}>
              <p>CS/min</p>
              <p>{averageCSPerMin.toFixed(2)}</p>
            </div>
            <div className={styles.statBox}>
              <p>Vision Score</p>
              <p>{averageVisionScore.toFixed(2)}</p>
            </div>
            <div className={styles.statBox}>
              <p>Gold/min</p>
              <p>{averageGoldPerMin.toFixed(2)}</p>
            </div>
            <div className={styles.statBox}>
              <p>Damage/Gold</p>
              <p>{averageDamagePerGold.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueInfo;
