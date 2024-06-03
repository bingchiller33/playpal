"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import FriendsModal from "@/components/FriendsModal/FriendsModal";

const fetchProfile = async (id: string) => {
  const response = await fetch(`/api/profile/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return response.json();
};

const fetchFriends = async (id: string) => {
  const response = await fetch(`/api/profile/${id}/friends`);
  if (!response.ok) {
    throw new Error("Failed to fetch friends");
  }
  return response.json();
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);

  const checkFriendRequest = async () => {
    const checkResponse = await fetch("/api/friendRequest/check-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: "66537e33c1e3f5f5fd0ab4cf",
        receiver_id: params.id,
      }),
    });

    const checkData = await checkResponse.json();

    setRequestSent(checkData.exists);
  };

  useEffect(() => {
    const fetchAndSetProfile = async () => {
      const fetchedProfile = await fetchProfile(params.id);
      setProfile(fetchedProfile);
    };

    const fetchAndSetFriends = async () => {
      const fetchedFriends = await fetchFriends(params.id);
      setFriends(fetchedFriends);
    };

    fetchAndSetFriends();
    checkFriendRequest();
    fetchAndSetProfile();
  }, [params.id]);

  const handleAddFriend = async () => {
    setLoading(true);

    try {
      if (requestSent) {
        const response = await fetch("/api/friendRequest/unrequest", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: "66537e33c1e3f5f5fd0ab4cf",
            receiver_id: params.id,
          }),
        });

        if (response.ok) {
          setRequestSent(false);
        } else {
          const errorData = await response.json();
          alert(`Failed to cancel friend request: ${errorData.message}`);
        }

        return;
      }

      const response = await fetch("/api/friendRequest/friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: "66537e33c1e3f5f5fd0ab4cf",
          receiver_id: params.id,
        }),
      });

      if (response.ok) {
      } else {
        const errorData = await response.json();
        alert(`Failed to send friend request: ${errorData.message}`);
      }
    } catch (error) {
      alert("Failed to send friend request");
    } finally {
      setLoading(false);
      checkFriendRequest();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <Image
          width={350}
          height={350}
          src={profile.avatar_url}
          alt="Profile Picture"
          className={styles.profileImage}
        />
        <div className={styles.profileInfo}>
          <h1 className={styles.username}>{profile.username}</h1>
          <p onClick={openModal} style={{ cursor: "pointer" }}>
            {friends.length} Friends
          </p>
          <button
            onClick={handleAddFriend}
            disabled={loading}
            className={styles.addFriendButton}
          >
            {loading ? (
              "Sending..."
            ) : requestSent ? (
              <>
                <FaArrowRightLong fill="#ED154C"/> Cancel Request
              </>
            ) : (
              "Add Friend"
            )}{" "}
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
      {isModalOpen && <FriendsModal friends={friends} onClose={closeModal} />}
    </div>
  );
}
