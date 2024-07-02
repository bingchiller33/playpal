import { useEffect, useRef } from "react";
import styles from "../FriendsModal/FriendsModal.module.css";
import { IoCloseOutline } from "react-icons/io5";

type FriendRequest = {
  id: string;
  username: string;
  avatar: string;
};

type FriendRequestsProps = {
  friendRequests: FriendRequest[];
  onAccept: (requestId: string) => void;
  onClose: () => void;
};

const FriendRequests: React.FC<FriendRequestsProps> = ({
  friendRequests,
  onAccept,
  onClose,
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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h4 style={{ margin: 0, textAlign: "center", color: "#ED154C" }}>
            FRIEND REQUESTS
          </h4>
          <button onClick={onClose} className={styles.closeButton}>
            <IoCloseOutline stroke="#ED154C" size={40} />
          </button>
        </div>
        <div className={styles.friendsList}>
          {friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <div key={request._id} className={styles.friendItem}>
                <img
                  src={request.avatar}
                  alt={request.username}
                  className={styles.friendAvatar}
                />
                <span className={styles.friendName}>{request.username}</span>
                <button
                  onClick={() => onAccept(request._id)}
                  className={styles.acceptButton}
                >
                  Accept
                </button>
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

export default FriendRequests;
