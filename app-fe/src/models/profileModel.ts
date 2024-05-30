import { Schema, model, models } from "mongoose";

const profileSchema = new Schema(
  {
    profile_id: {
      type: String,
      required: [true, "Profile ID is required"],
      unique: [true, "Profile ID must be unique"],
    },
    account_id: {
      type: String,
      required: [true, "Account ID is required"],
    },
    avatar_url: {
      type: String,
      required: [true, "Avatar URL is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
    },
    riot_id: {
      type: String,
      required: [true, "Riot ID is required"],
    },
    preferences: {
      language: {
        type: [String],
      },
      server: {
        type: String,
      },
    },
    rating: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Profiles = models.profiles || model("profiles", profileSchema);

export default Profiles;
