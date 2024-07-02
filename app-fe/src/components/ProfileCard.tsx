import React from "react";
import styles from "../app/profile/page.module.css";

type ProfileCardProps = {
  username: string;
  avatar: string;
  bio: string;
  riot_id: string;
  preferences: {
    language: string | string[];
    server: string;
    style: string;
  };
  rating: string;
};
const ProfileCard: React.FC<ProfileCardProps> = ({
  username,
  avatar,
  bio,
  riot_id,
  preferences,
  rating,
}) => {
  return (
    <div className={styles.card}>
      <img src={avatar} alt={username} className={styles.profileImage} />
      <div className={styles.cardInfo}>
        <div className={styles.infoLine}>
          <h3 style={{ fontWeight: "bold" }}>{username}</h3>
          <h3 style={{ fontWeight: "bold" }}>{riot_id}</h3>
        </div>
        <div className={styles.infoLine}>
          <p>Language</p>
          <div className={styles.pillGroup}>
            {Array.isArray(preferences?.language) ? (
              preferences?.language.map((lang, index) => (
                <span key={index} className={styles.pill}>
                  {lang}
                </span>
              ))
            ) : (
              <span className={styles.pill}>{preferences?.language}</span>
            )}
          </div>
        </div>
        <div className={styles.infoLine}>
          <p>Server</p>
          <span>{preferences?.server}</span>
        </div>
        <div className={styles.infoLine}>
          <p>Style</p>
          <span>{preferences?.style}</span>
        </div>
        <div className={styles.infoLine}>
          <p>Rating</p>
          <span>{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
