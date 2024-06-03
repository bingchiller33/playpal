import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
    },
    token: {
      type: String,
    },
    verified: {
      type: Boolean,
    },
    avatar_url: {
      type: String,
    },
    username: {
      type: String,
    },
    bio: {
      type: String,
    },
    riot_id: {
      type: String,
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
    },
  },
  {
    timestamps: true,
  }
);

const Account =
  mongoose.models.accounts || mongoose.model("accounts", accountSchema);

export default Account;
