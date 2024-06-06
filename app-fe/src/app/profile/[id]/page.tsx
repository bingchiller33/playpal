"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import FriendsModal from "@/components/FriendsModal/FriendsModal";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FriendRequests from "@/components/FriendsRequest/FriendRequests";

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
  const data = await response.json();
  console.log("Response data:", data);
  return data;
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [isFriend, setIsFriend] = useState(false);

  // FR: might put this in Header later
  const [isFRModalOpen, setIsFRModalOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  const checkFriendRequest = async () => {
    if (!session) {
      return;
    }

    const checkResponse = await fetch("/api/friendRequest/check-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: session.user.id,
        receiver_id: params.id,
      }),
    });

    const checkData = await checkResponse.json();

    setRequestSent(checkData.exists);
    setIsFriend(checkData.isFriend);
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

    const fetchData = async () => {
      await fetchAndSetProfile();
      await fetchAndSetFriends();
      await checkFriendRequest();
    };

    fetchData();
  }, [params.id, session]);

  const handleAddFriend = async () => {
    if (!session) {
      alert("You need to be logged in to send friend requests");
      return;
    }

    setLoading(true);

    try {
      if (isFriend) {
        // unfriend APi
      } else if (requestSent) {
        const response = await fetch("/api/friendRequest/unrequest", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: session.user.id,
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
          sender_id: session.user.id,
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

  // FR: might put this in Header later
  const fetchFriendRequests = async () => {
    const response = await fetch(`/api/friendRequest/requests`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch friend requests");
    }

    const friendRequests = await response.json();
    return friendRequests;
  };

  useEffect(() => {
    const fetchAndSetFriendRequests = async () => {
      try {
        const requests = await fetchFriendRequests();
        setFriendRequests(requests);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAndSetFriendRequests();
  }, []);

  const acceptFriendRequest = async (requestId: string) => {
    const response = await fetch(`/api/friendRequest/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId }),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to accept friend request");
    }
    return response.json();
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error(error);
    }
  };
  //

  const openFRModal = () => {
    setIsFRModalOpen(true);
  };

  const closeFRModal = () => {
    setIsFRModalOpen(false);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p onClick={openModal} style={{ cursor: "pointer" }}>
                {friends.length} Friends
              </p>
              {session?.user.id === params.id && (
                <p onClick={openFRModal} style={{ cursor: "pointer" }}>
                  {friendRequests.length} Friend Requests
                </p>
              )}
            </div>

            {session?.user.id !== params.id && (
              <button
                onClick={handleAddFriend}
                disabled={loading}
                className={styles.addFriendButton}
              >
                {loading ? (
                  "Sending..."
                ) : isFriend ? (
                  "Unfriend"
                ) : requestSent ? (
                  <>
                    <FaArrowRightLong fill="#ED154C" /> Cancel Request
                  </>
                ) : (
                  "Add Friend"
                )}{" "}
              </button>
            )}
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
        {isModalOpen && (
          <FriendsModal
            friends={friends}
            onClose={closeModal}
            isCurrentUser={params.id === session?.user.id}
          />
        )}
        {isFRModalOpen && (
          <FriendRequests
            friendRequests={friendRequests}
            onAccept={handleAccept}
            onClose={closeFRModal}
          />
        )}
      </div>
      <Footer />
    </>
  );
}
