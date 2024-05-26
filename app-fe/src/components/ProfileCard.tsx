import React from "react";
import styles from "../app/profile/page.module.css";

type ProfileCardProps = {
  username: string;
  rank: string;
  language: string | string[];
  server: string;
  style: string;
  rating: string;
  image: string;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  username,
  rank,
  language,
  server,
  style,
  rating,
  image,
}) => {
  return (
    <div className={styles.card}>
      <img src={image} alt={username} className={styles.profileImage} />
      <div className={styles.cardInfo}>
        <div className={styles.infoLine}>
          <h3 style={{ fontWeight: "bold" }}>{username}</h3>
          <h3 style={{ fontWeight: "bold" }}>{rank}</h3>
        </div>
        <div className={styles.infoLine}>
          <p>Language</p>
          <div className={styles.pillGroup}>
            {Array.isArray(language) ? (
              language.map((lang, index) => (
                <span key={index} className={styles.pill}>
                  {lang}
                </span>
              ))
            ) : (
              <span className={styles.pill}>{language}</span>
            )}
          </div>
        </div>
        <div className={styles.infoLine}>
          <p>Server</p>
          <span>{server}</span>
        </div>
        <div className={styles.infoLine}>
          <p>Style</p>
          <span>{style}</span>
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
