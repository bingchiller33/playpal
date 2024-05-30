"use server";

import dbConnect from "@/lib/mongoConnect";
import FriendRequest from "@/models/friendRequestModel";
import Profiles from "@/models/profileModel";

export const fetchProfile = async (profile_id: string) => {
  await dbConnect();

  const profile = await Profiles.findOne({ profile_id }).lean();
  return profile;
};

export const handleFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  await dbConnect();

  await FriendRequest.create({ senderId, receiverId });
};
