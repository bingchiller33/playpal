import { useEffect, useRef, useState } from "react";
import styles from "./FriendsModal.module.css";
import { IoCloseOutline } from "react-icons/io5";
import { unfriend } from "@/hooks/useProfile";
import Link from "next/link";
import { FaUserTimes } from "react-icons/fa";
import { toast } from "react-toastify";

type Friend = {
  _id: string;
  username: string;
  avatar: string;
};

type FriendsModalProps = {
  friends: Friend[];
  onClose: () => void;
  isCurrentUser: boolean;
  currentUserId: string;
  setIsFDropdownOpen: (value: boolean) => void;
  setFriends: (friends: Friend[]) => void;
};

const FriendsModal: React.FC<FriendsModalProps> = ({
  friends,
  onClose,
  isCurrentUser,
  currentUserId,
  setIsFDropdownOpen,
  setFriends,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleUnfriend = async (friendId: string) => {
    setIsFDropdownOpen(false);
    const success = await unfriend(currentUserId, friendId);
    if (success) {
      const updatedFriends = friends.filter(
        (friend) => friend._id !== friendId
      );
      setFriends(updatedFriends);
      toast.success("Unfriended successfully");
    } else {
      toast.error("Could not unfriend. Please try again.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalHeader}>
          <div style={{ gridArea: "title" }}>
            <h4 style={{ margin: 0, textAlign: "center", color: "#ED154C" }}>
              FRIENDS
            </h4>
          </div>
          <button
            onClick={onClose}
            className={styles.closeButton}
            style={{ gridArea: "button", color: "#ED154C" }}
          >
            <IoCloseOutline stroke="#ED154C" size={40} />
          </button>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Drop your buddy name here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.friendsList}>
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <div key={friend._id} className={styles.friendItem}>
                <Link href={`/profile/${friend._id}`}>
                  <img
                    src={friend.avatar}
                    alt={friend.username}
                    className={styles.friendAvatar}
                  />
                  <span className={styles.friendName}>{friend.username}</span>
                </Link>
                {isCurrentUser && (
                  <button
                    onClick={() => handleUnfriend(friend._id)}
                    className={styles.unfriendButton}
                  >
                    <FaUserTimes size={26} style={{ marginRight: "3px" }} />
                    Unfriend
                  </button>
                )}
              </div>
            ))
          ) : (
            <img
              src="https://i.imgflip.com/6k6afr.jpg"
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              width="60%"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsModal;
