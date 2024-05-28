"use client";

import { useState } from "react";
import dbConnect from "@/lib/mongoConnect";
import FriendRequest from "@/models/friendRequestModel";
import styles from "@/app/profile/[id]/page.module.css";

interface AddFriendButtonProps {
  senderId: string;
  receiverId: string;
}

const AddFriendButton: React.FC<AddFriendButtonProps> = ({
  senderId,
  receiverId,
}) => {

  console.log(FriendRequest);
  

  const [loading, setLoading] = useState(false);

  const handleAddFriend = async () => {
    setLoading(true);
    await dbConnect();

    const sender_id = 1;
    const receiver_id = 2;

    const newRequest = new FriendRequest({ sender_id, receiver_id });
    await newRequest.save();
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
};

export default AddFriendButton;
