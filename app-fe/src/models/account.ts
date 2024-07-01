import mongoose, { Schema, Model } from "mongoose";
import { WeightSchema, IWeight, modes } from "./weightSchema";
import FilterLOLRanks, { IFilterLOLRank } from "./filterLOLRankModel";
import FilterPlaystyles, { IFilterPlaystyle } from "./filterPlaystyleModel";
import { WithId } from "@/utils/types";
import FilterGenders, { IFilterGender } from "./filterGenderModel";
import FilterLanguages, { IFilterLanguage } from "./filterLanguageModel";

export interface MatchMakingWeight {
  mode: (typeof modes)[number];
  weights: IWeight;
}

export interface IAccount {
  email?: string;
  password?: string;
  username?: string;
  token?: string;
  age?: number;
  avatar?: string;
  role: string;
  gender?: WithId<IFilterGender>;
  playstyles: WithId<IFilterPlaystyle>[];
  // TODO: Change this after riot integration!
  lolRank?: IFilterLOLRank;
  verified?: boolean;
  matchMakingWeights: MatchMakingWeight[];
  createdAt?: Date;
  updatedAt?: Date;
  bio?: string;
  riot_id?: string;
  language?: WithId<IFilterLanguage>[];
  preferences?: {
    server?: string;
  };
  rating?: string;
  banUntil: Date | null;
  banReason: string | null;
}

const AccountSchema = new Schema<IAccount>(
  {
    email: {
      type: String,
      required: [true, "email is Required"],
      unique: [true, "email is not duplicate"],
    },
    password: {
      type: String,
      required: [false],
    },
    username: {
      type: String,
      required: [true],
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
    riot_id: {
      type: String,
    },
    token: {
      type: String,
    },
    verified: {
      type: Boolean,
    },
    age: {
      type: Number,
    },
    gender: {
      type: mongoose.Types.ObjectId,
      ref: FilterGenders,
    },
    playstyles: {
      type: [mongoose.Types.ObjectId],
      ref: FilterPlaystyles,
      default: [],
    },
    language: {
      type: [mongoose.Types.ObjectId],
      ref: FilterLanguages,
      default: [],
    },
    lolRank: {
      type: mongoose.Types.ObjectId,
      ref: FilterLOLRanks,
    },
    matchMakingWeights: {
      type: [
        new Schema(
          {
            mode: {
              type: String,
              required: true,
            },
            weights: {
              type: WeightSchema,
            },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    preferences: {
      server: {
        type: String,
      },
    },
    rating: {
      type: String,
    },
    banUntil: {
      type: Date,
      default: null,
    },
    banReason: {
      type: String,
      default: null,
    },
  },
  {
    // auto createAt, updateAt
    timestamps: true,
  }
);

// Mapping to Collection
const Account: Model<IAccount> =
  mongoose.models.accounts ||
  mongoose.model<IAccount>("accounts", AccountSchema);

export default Account;
