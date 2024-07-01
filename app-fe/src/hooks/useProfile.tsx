export const sendFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  const response = await fetch("/api/friendRequest/friend-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender_id: senderId,
      receiver_id: receiverId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to send friend request: ${errorData.message}`);
  }

  return response.json();
};

export const cancelFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  const response = await fetch("/api/friendRequest/unrequest", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender_id: senderId,
      receiver_id: receiverId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to cancel friend request: ${errorData.message}`);
  }

  return response.json();
};

export const unfriend = async (senderId: string, receiverId: string) => {
  const response = await fetch("/api/friendRequest/unfriend", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender_id: senderId,
      receiver_id: receiverId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to unfriend: ${errorData.message}`);
  }

  return response.json();
};

export const acceptFriendRequest = async (requestId: string) => {
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

export const fetchProfile = async (id: string) => {
  const response = await fetch(`/api/profile/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return response.json();
};

export const fetchFriends = async (id: string) => {
  const response = await fetch(`/api/profile/${id}/friends`);
  if (!response.ok) {
    throw new Error("Failed to fetch friends");
  }
  const data = await response.json();
  return data;
};

export const fetchFriendRequests = async () => {
  const response = await fetch(`/api/friendRequest/requests`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch friend requests");
  }

  const friendRequests = await response.json();
  return friendRequests;
};

export const fetchFeedback = async (id: string) => {
  const response = await fetch(`/api/profile/${id}/feedback`, {
    method: "GET",
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error("Failed to fetch feedback");
  }
  const data = await response.json();
  return data;
};

export const voteFeedback = async (id: string, user: string) => {
  const response = await fetch(`/api/feedback/vote/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch feedback");
  }
  const data = await response.json();
  return data;
};

export const unvoteFeedback = async (id: string, user: string) => {
  const response = await fetch(`/api/feedback/unvote/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch feedback");
  }
  const data = await response.json();
  return data;
};

export const reviewPlayer = async (
  id: string,
  sender_id: string,
  rate: number,
  text: string
) => {
  const response = await fetch(`/api/profile/${id}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sender_id, rate, text }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch feedback");
  }
  const data = await response.json();
  return data;
};

export const DeleteFeedback = async (id: string) => {
  const response = await fetch(`/api/feedback/${id}`, {
    method: "DELETE",
  });
  if(!response.ok) {
    throw new Error("Failed to delete feedback");
  }
}

export const UpdateFeedback = async (id:string, rate:number, text:string) => {
  const response = await fetch(`/api/feedback/${id}`,{
    method:"PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rate, text }),
    credentials: "include",
  });
  if(!response.ok) {
    throw new Error("Failed to update feedback");
  }
}
