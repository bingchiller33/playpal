import { set } from "mongoose";
import { useEffect, useState } from "react";
import styles from "./FriendRequests.module.css";

interface FriendRequest {
  _id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
}

const fetchFriendRequests = async () => {
  const response = await fetch(`/api/friendRequest/requests`);
  if (!response.ok) {
    throw new Error("Failed to fetch friend requests");
  }

  const friendRequests = await response.json();
  return friendRequests;
};

const acceptFriendRequest = async (requestId: string) => {
  const response = await fetch(`/api/friendRequest/accept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requestId }),
  });
  if (!response.ok) {
    throw new Error("Failed to accept friend request");
  }
  return response.json();
};

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleAccept = async (requestId: string) => {
    setLoading(true);
    try {
      await acceptFriendRequest(requestId);
      setFriendRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <h2>Friend Requests</h2>
      <div className={styles.requestsList}>
        {friendRequests.map((request) => (
          <div key={request._id} className={styles.requestItem}>
            <p>Request from: {request.sender_id}</p>
            <button
              onClick={() => handleAccept(request._id)}
              disabled={loading}
              className={styles.acceptButton}
            >
              {loading ? "Accepting..." : "Accept"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;