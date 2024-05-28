import styles from "./page.module.css";
import dbConnect from "@/lib/mongoConnect";
import Profiles from "@/models/profileModel";
import AddFriendButton from "@/components/AddFriendButton";

const fetchProfile = async (profile_id: string) => {
  await dbConnect();

  const profile = await Profiles.findOne({ profile_id }).lean();
  return profile;
};

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await fetchProfile(params.id);

  const senderId = "1";

  if (!profile) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img src={profile.avatar_url} alt="Profile Picture" />
        <div className={styles.profileInfo}>
          <h1>{profile.username}</h1>
          <p>Friends Count Placeholder</p>
          <AddFriendButton senderId={senderId} receiverId={params.id} />
        </div>
      </div>
      <div className={styles.playerDetails}>
        <h2>Player Details</h2>
        <p>Bio: {profile.bio}</p>
        <p>Riot ID: {profile.riot_id}</p>
        <p>Preferences: {JSON.stringify(profile.preferences)}</p>
      </div>
      <div className={styles.feedbacks}>
        <h2>Feedbacks</h2>
        {/* Feedbacks placeholder */}
      </div>
      <div className={styles.highlights}>
        <h2>Highlights</h2>
        {/* Highlights placeholder */}
      </div>
    </div>
  );
}
