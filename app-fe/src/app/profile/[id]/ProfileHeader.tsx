import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import FriendsModal from "@/components/FriendsModal/FriendsModal";
import FriendRequests from "@/components/FriendsRequest/FriendRequests";
import styles from "./page.module.css";
import Link from "next/link";
import { IoSettings, IoSettingsOutline } from "react-icons/io5";
import { FaUserCheck } from "react-icons/fa";

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
  setFriends: (friends: any[]) => void;
  handleCancelProfile: () => void;
}

interface Option {
  _id: string;
  label: string;
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
  handleCancelProfile,
  setFriends,
}: ProfileHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFRModalOpen, setIsFRModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openFRModal = () => setIsFRModalOpen(true);
  const closeFRModal = () => setIsFRModalOpen(false);

  const [isFDropdownOpen, setIsFDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsFDropdownOpen(!isFDropdownOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [playstyleOptions, setPlaystyleOptions] = useState<Option[]>([]);
  const [languageOptions, setLanguageOptions] = useState<Option[]>([]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsFDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isFDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFDropdownOpen]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [playstyleRes, languageRes] = await Promise.all([
          fetch("/api/profile/playstyles"),
          fetch("/api/profile/languages"),
        ]);
        setPlaystyleOptions(await playstyleRes.json());
        setLanguageOptions(await languageRes.json());
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  const mapIdsToNames = (ids: string[], options: Option[]) => {
    return ids
      ?.map((id: string) => {
        const option = options.find((opt: Option) => opt._id === id);
        return option ? option.label : null;
      })
      .filter((label) => label !== null);
  };

  const playstyles = profile.playstyles
    ? mapIdsToNames(profile.playstyles, playstyleOptions)
    : [];

  const languages = profile.language
    ? mapIdsToNames(profile.language, languageOptions)
    : [];

  return (
    <div className={styles.profileHeader}>
      {profile.avatar ? (
        <Image
          className={styles.profileImage}
          src={profile.avatar}
          width={350}
          height={350}
        />
      ) : (
        <div className={`${styles.profileImage} ${styles.roundAvatar}`}>
          {profile.username[0].toUpperCase()}
        </div>
      )}
      <div className={styles.profileInfo}>
        <div className={styles.editContainer}>
          <p className={styles.username}>{profile.username}</p>
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

        <div
          className={styles.friendContainer}
          style={{ display: "flex", gap: "30px", marginTop: "10px" }}
        >
          {session?.user.id !== params.id && (
            <div className={styles.friendButtonContainer}>
              {isReceiver ? (
                <div className={styles.friendRequestContainer}>
                  <p>
                    <b
                      className={styles.username}
                      style={{ fontSize: "18px", marginRight: 5 }}
                    >
                      {profile.username}
                    </b>
                    sent you a friend request
                  </p>
                  <div className={styles.friendRequestButtonContainer}>
                    <button
                      onClick={handleAcceptProfile}
                      className={styles.acceptButton}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={handleCancelProfile}
                      className={styles.declineButton}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ) : isFriend ? (
                <div className={styles.friendDropdown} ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className={styles.friendsButton}
                  >
                    <FaUserCheck size={25} style={{ marginRight: "5px" }} />
                    Friends
                  </button>
                  {isFDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      <button
                        onClick={handleAddFriend}
                        className={styles.dropdownItem}
                      >
                        Unfriend
                      </button>
                      {/* Add more options here in the future */}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleAddFriend}
                  disabled={loading}
                  className={styles.addFriendButton}
                >
                  {loading ? (
                    "Sending..."
                  ) : requestSent ? (
                    <>
                      <FaArrowRightLong fill="#ED154C" /> Cancel Request
                    </>
                  ) : (
                    "Add Friend"
                  )}
                </button>
              )}
            </div>
          )}
          <p
            onClick={openModal}
            style={{ cursor: "pointer", fontSize: "22px", marginTop: "8px" }}
          >
            {friends.length} <b>Friends</b>
          </p>

          {session?.user.id === params.id && (
            <p
              onClick={openFRModal}
              style={{ cursor: "pointer", fontSize: "22px", marginTop: "8px" }}
            >
              {friendRequests.length} <b>Friend Requests</b>
            </p>
          )}
        </div>
        <div className={styles.bioContainer}>
          <p style={{ color: "gray" }}>{profile.bio}</p>
        </div>
        <div className={styles.pillsContainer}>
          {playstyles.length > 0 && (
            <div>
              <p style={{ marginBottom: "7px" }}>
                <b>Play Style</b>
              </p>
              {playstyles.map((style) => (
                <span
                  key={style}
                  className={`${styles.pill} ${styles.pillPlayStyle}`}
                >
                  {style}
                </span>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <p style={{ marginBottom: "7px" }}>
                <b>Preferred Languages</b>
              </p>
              {languages.map((lang) => (
                <span
                  key={lang}
                  className={`${styles.pill} ${styles.pillLanguage}`}
                >
                  {lang}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <FriendsModal
          friends={friends}
          onClose={closeModal}
          isCurrentUser={params.id === session?.user.id}
          currentUserId={session?.user.id}
          setIsFDropdownOpen={setIsFDropdownOpen}
          setFriends={setFriends}
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
