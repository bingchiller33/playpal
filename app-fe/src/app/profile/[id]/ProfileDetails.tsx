import LeagueInfo from "@/components/LeagueInfo";
import styles from "./page.module.css";

interface ProfileDetailsProps {
  profile: any;
  isCurrentUser: boolean;
}

const ProfileDetails = ({ profile, isCurrentUser }: ProfileDetailsProps) => (
  <div className={styles.playerDetails}>
    <LeagueInfo profile={profile} isCurrentUser={isCurrentUser} />
  </div>
);

export default ProfileDetails;
