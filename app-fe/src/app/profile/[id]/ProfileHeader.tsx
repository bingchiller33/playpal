import { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import FriendsModal from "@/components/FriendsModal/FriendsModal";
import FriendRequests from "@/components/FriendsRequest/FriendRequests";
import styles from "./page.module.css";
import Link from "next/link";
import { IoSettings, IoSettingsOutline } from "react-icons/io5";

interface ProfileHeaderProps {
  profile: any;
  friends: any[];
  session: any;
  params: any;
  loading: boolean;
  requestSent: boolean;
  isFriend: boolean;
  isReceiver: boolean;
  friendRequests: any[];
  handleAcceptProfile: () => void;
  handleAddFriend: () => void;
  handleAccept: (requestId: string) => void;
}

const ProfileHeader = ({
  profile,
  friends,
  session,
  params,
  loading,
  requestSent,
  isFriend,
  friendRequests,
  isReceiver,
  handleAddFriend,
  handleAccept,
  handleAcceptProfile,
}: ProfileHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFRModalOpen, setIsFRModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openFRModal = () => setIsFRModalOpen(true);
  const closeFRModal = () => setIsFRModalOpen(false);

  return (
    <div className={styles.profileHeader}>
      <Image
        width={350}
        height={350}
        src={profile.avatar}
        alt="Profile Picture"
        className={styles.profileImage}
      />
      <div className={styles.profileInfo}>
        <div className={styles.editContainer}>
          <h1 className={styles.username}>{profile.username}</h1>
          {session?.user.id === params.id && (
            <Link
              href={`/profile/${params.id}/edit`}
              className={styles.editButton}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <IoSettingsOutline style={{ marginRight: "10px" }} size={30} />
                <span>Edit</span>
              </div>
            </Link>
          )}
        </div>

        <div style={{ display: "flex", gap: "30px" }}>
          <p onClick={openModal} style={{ cursor: "pointer" }}>
            {friends.length} Friends
          </p>
          {session?.user.id === params.id && (
            <p onClick={openFRModal} style={{ cursor: "pointer" }}>
              {friendRequests.length} Friend Requests
            </p>
          )}
        </div>
        <div
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
            maxWidth: "500px",
          }}
        >
          <p style={{ color: "gray" }}>{profile.bio}</p>
        </div>

        {session?.user.id !== params.id &&
          (isReceiver ? (
            <div>
              <p>{profile.username} has sent you a friend request</p>
              <button onClick={() => handleAcceptProfile()}>Confirm</button>
              <button>Decline</button>
            </div>
          ) : (
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
              )}
            </button>
          ))}
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
  );
};

export default ProfileHeader;
