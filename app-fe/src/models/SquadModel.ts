import mongoose, { Schema } from "mongoose";
import FilterLanguages from "./FilterLanguageModel";
import FilterGenders from "./FilterGenderModel";
import FilterGames from "./FilterGameModel";
import FilterGameModes from "./FilterGameModeModel";
import FilterLOLServers from "./FilterLOLServerModel";
import FilterLOLRanks from "./FilterLOLRankModel";
import FilterPlaystyles from "./FilterPlaystyleModel";

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
        filter: {
            type: new Schema({
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
            }),
            required: true,
            default: {
                genderId: "6656b7370342bce980eeb7c6",
                gameId: "6656b7cc0342bce980eeb7cb",
                modeId: "6656b9540342bce980eeb7cf",
                langId: "6656ba8e0342bce980eeb7d6",
            },
        },
    },
    {
        // auto createAt, updateAt
        timestamps: true,
    }
);

// Mapping to Collection
const Squads = mongoose.models.Squads || mongoose.model("Squads", SquadSchema);
export default Squads;
