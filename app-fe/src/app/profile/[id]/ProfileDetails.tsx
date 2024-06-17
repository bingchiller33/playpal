import LeagueInfo from "@/components/LeagueInfo";
import styles from "./page.module.css";

interface ProfileDetailsProps {
  profile: any;
}

const ProfileDetails = ({ profile }: ProfileDetailsProps) => (
  <div className={styles.profileDetails}>
    <h2>Player Details</h2>
    <LeagueInfo profile={profile} />
  </div>
);

export default ProfileDetails;
