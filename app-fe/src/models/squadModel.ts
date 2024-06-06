import mongoose, { Model, Schema } from "mongoose";
import FilterLanguages from "./filterLanguageModel";
import FilterGenders, { IFilterGender } from "./filterGenderModel";
import FilterGames from "./filterGameModel";
import FilterGameModes from "./filterGameModeModel";
import FilterLOLServers from "./filterLOLServerModel";
import FilterLOLRanks from "./filterLOLRankModel";
import FilterPlaystyles from "./filterPlaystyleModel";
import { GAME_ID_LOL } from "@/utils/constants";
import { IWeight, WeightSchema } from "./weightSchema";
import { WithId } from "@/utils/types";
import Account, { IAccount } from "./account";

export interface ILOLFilter {
    serverId: mongoose.Types.ObjectId;
    rankId: mongoose.Types.ObjectId;
}

const LOLFilterSchema = new Schema({
    serverId: {
        type: mongoose.Types.ObjectId,
        ref: FilterLOLServers,
        required: true,
    },
    rankId: {
        type: mongoose.Types.ObjectId,
        ref: FilterLOLRanks,
        required: true,
    },
});

const SpecFilterSchema = new Schema({}, { discriminatorKey: "mode" });
SpecFilterSchema.discriminator("LOL", LOLFilterSchema);

export interface IFilter {
    langId: mongoose.Types.ObjectId;
    genderId: IFilterGender;
    ageFrom: number;
    ageTo: number;
    memberCount: number;
    activeAllDay: boolean;
    activeFrom: number;
    activeTo: number;
    playstyles: mongoose.Types.ObjectId[];
    gameId: mongoose.Types.ObjectId;
    modeId: mongoose.Types.ObjectId;
    specFilter: ILOLFilter; // This is a catch-all for discriminators
}

export interface IRelevantScore {
    other: mongoose.Types.ObjectId;
    score: number;
}

export type ICommonTrait = Map<string, number>;

export interface ISquad {
    name?: string;
    joinQueue?: Date;
    img?: string;
    leader: WithId<IAccount>;
    filter: IFilter;
    avgTraits: ICommonTrait;
    squadWeights?: IWeight;
    createdAt?: Date;
    updatedAt?: Date;
}

const SquadSchema = new Schema(
    {
        name: {
            type: String,
        },
        joinQueue: {
            type: Date,
        },
        img: {
            type: String,
        },
        leader: {
            type: mongoose.Types.ObjectId,
            ref: Account,
            required: true,
        },
        filter: {
            type: new Schema(
                {
                    langId: {
                        type: mongoose.Types.ObjectId,
                        ref: FilterLanguages,
                        required: [true, "Language id is required!"],
                    },
                    genderId: {
                        type: mongoose.Types.ObjectId,
                        ref: FilterGenders,
                        required: [true, "Gender id is required!"],
                    },
                    ageFrom: {
                        type: Number,
                        default: 0,
                        required: true,
                    },
                    ageTo: {
                        type: Number,
                        default: 100,
                        required: true,
                    },
                    memberCount: {
                        type: Number,
                        default: 4,
                        required: true,
                    },
                    activeAllDay: {
                        type: Boolean,
                        default: false,
                    },
                    activeFrom: {
                        type: Number,
                        default: 0,
                        required: true,
                    },
                    activeTo: {
                        type: Number,
                        default: 85500,
                        required: true,
                    },
                    playstyles: {
                        type: [mongoose.Types.ObjectId],
                        ref: FilterPlaystyles,
                        default: [],
                    },
                    gameId: {
                        type: mongoose.Types.ObjectId,
                        ref: FilterGames,
                        required: true,
                    },
                    modeId: {
                        type: mongoose.Types.ObjectId,
                        ref: FilterGameModes,
                        required: true,
                    },
                    specFilter: {
                        type: SpecFilterSchema,
                        default: {},
                    },
                },
                { _id: false }
            ),
            required: true,
            default: {
                genderId: "6656b7370342bce980eeb7c6",
                gameId: GAME_ID_LOL ?? "6656b7cc0342bce980eeb7cb",
                modeId: "6656b9540342bce980eeb7cf",
                langId: "6656ba8e0342bce980eeb7d6",
            },
        },
        avgTraits: {
            type: Map,
            of: Number,
            default: new Map<string, number>(),
        },
        squadWeights: {
            type: WeightSchema,
            default: null,
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const Squads: Model<ISquad> =
    mongoose.models.Squads || mongoose.model("Squads", SquadSchema);
export default Squads;
