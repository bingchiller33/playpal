import { useEffect, useRef, useState } from "react";
import styles from "../FriendsModal/FriendsModal.module.css";
import { IoCloseOutline } from "react-icons/io5";
import { fetchProfile } from "@/hooks/useProfile";

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

type DetailedFriendRequest = {
  id: string;
  sender: { id: string; username: string; avatar: string; };
};

const FriendRequests: React.FC<FriendRequestsProps> = ({
  friendRequests,
  onAccept,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [detailedRequests, setDetailedRequests] = useState<DetailedFriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false); 

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

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true); // Start loading
      try {
        const requestsWithDetails = await Promise.all(friendRequests.map(async (request) => {
          const sender = await fetchProfile(request.sender_id);
          return { id: request._id, sender };
        }));
        setDetailedRequests(requestsWithDetails);
      } catch (error) {
        console.error("Failed to fetch sender details", error);
      } finally {
        setIsLoading(false); 
      }
    };
    
    fetchDetails();
  }, [friendRequests]);
  
  if (isLoading) {
    return <div>Loading...</div>; 
  }

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
          {detailedRequests.length > 0 ? (
            detailedRequests.map((request) => (
              <div key={request.id} className={styles.friendItem}>
                <img
                  src={request.sender.avatar}
                  alt={request.sender.username}
                  className={styles.friendAvatar}
                />
                <span className={styles.friendName}>{request.sender.username}</span>
                <button
                  onClick={() => onAccept(request.id)}
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
