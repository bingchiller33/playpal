import { useEffect, useRef, useState } from "react";
import styles from "./FriendsModal.module.css";
import { IoClose, IoCloseOutline } from "react-icons/io5";

type Friend = {
  id: string;
  username: string;
  avatar_url: string;
};

type FriendsModalProps = {
  friends: Friend[];
  onClose: () => void;
};

const FriendsModal: React.FC<FriendsModalProps> = ({ friends, onClose }) => {
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
    alert(`Unfriend ${friendId}`);
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalHeader}>
          <div style={{ gridArea: "title" }}>
            <h4 style={{ margin: 0, textAlign: "center" }}>FRIENDS</h4>
          </div>
          <button
            onClick={onClose}
            className={styles.closeButton}
            style={{ gridArea: "button" }}
          >
            <IoCloseOutline size={40} />
          </button>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Type something here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.friendsList}>
          {filteredFriends.map((friend) => (
            <div key={friend.id} className={styles.friendItem}>
              <img
                src={friend.avatar_url}
                alt={friend.username}
                className={styles.friendAvatar}
              />
              <span className={styles.friendName}>{friend.username}</span>
              <button
                onClick={() => handleUnfriend(friend.id)}
                className={styles.unfriendButton}
              >
                Unfriend
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsModal;
