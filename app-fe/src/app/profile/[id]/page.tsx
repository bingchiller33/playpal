import Image from "next/image";
import styles from "./page.module.css";
import { use, useEffect, useState } from "react";
import { NextPageProps } from "@/utils/types";

interface Profile {
  profile_id: string;
  account_id: string;
  avatar_url: string;
  username: string;
  bio: string;
  riot_id: string;
  preferences: any;
}

const mockProfiles: Record<string, Profile> = {
  profile1: {
    profile_id: "1",
    account_id: "account1",
    avatar_url:
      "https://res.cloudinary.com/dnzy2vddm/image/upload/v1709534551/avatar-guest_2x_nbk1bw.png",
    username: "Test User 1",
    bio: "This is test user 1.",
    riot_id: "test123",
    preferences: {},
  },
  profile2: {
    profile_id: "2",
    account_id: "account2",
    avatar_url:
      "https://res.cloudinary.com/dnzy2vddm/image/upload/v1709534551/avatar-guest_2x_nbk1bw.png",
    username: "Test User 2",
    bio: "This is test user 2.",
    riot_id: "test456",
    preferences: {},
  },
};

const fetchProfile = (profile_id: string): Profile | null => {
  return mockProfiles[profile_id] || null;
};

const ProfilePage = ({ params }: NextPageProps) => {
  const { id } = params;
  const profile: Profile | null = fetchProfile(id);
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
          <button className={styles.addFriendButton}>Add Friend</button>
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
};

export default ProfilePage;
