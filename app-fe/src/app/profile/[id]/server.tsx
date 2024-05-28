"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import dbConnect from "@/lib/mongoConnect";
import Profiles from "@/models/profileModel";
import FriendRequest from "@/models/friendRequestModel";
import mongoose from "mongoose";

const fetchProfile = async (profile_id: string) => {
  await dbConnect();

  const profile = await Profiles.findOne({ profile_id }).lean();
  return profile;
};

const ProfilePage = ({ params }: { params: { id: string } }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAndSetProfile = async () => {
      const fetchedProfile = await fetchProfile(params.id);
      setProfile(fetchedProfile);
    };

    fetchAndSetProfile();
  }, [params.id]);

  const handleAddFriend = async () => {
    setLoading(true);
    await dbConnect();

    const senderId = "SENDER_PROFILE_ID"; // Replace with the actual sender profile ID
    const sender_id = new mongoose.Types.ObjectId(senderId);
    const receiver_id = new mongoose.Types.ObjectId(params.id);

    const newRequest = new FriendRequest({ sender_id, receiver_id });
    await newRequest.save();

    alert("Friend request sent!");
    setLoading(false);
  };

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
          <button onClick={handleAddFriend} disabled={loading}>
            {loading ? "Sending..." : "Add Friend"}
          </button>
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