"use client";

import { useState } from "react";
import dbConnect from "@/lib/mongoConnect";
import styles from "@/app/profile/[id]/page.module.css";
import FriendRequest from "@/models/friendRequestModel";

interface AddFriendButtonProps {
  senderId: string;
  receiverId: string;
}

export default function AddFriendButton({
  senderId,
  receiverId,
}: AddFriendButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAddFriend = async () => {
    setLoading(true);

    await dbConnect();
    await FriendRequest.create({ senderId, receiverId });
    alert("Friend request sent!");
    setLoading(false);
  };

  return (
    <button
      onClick={handleAddFriend}
      className={styles.addFriendButton}
      disabled={loading}
    >
      {loading ? "Sending..." : "Add Friend"}
    </button>
  );
}
