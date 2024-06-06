import mongoose, { Schema } from "mongoose";

export const modes = ["ANY", "LOL"] as const;

export const commonWeights = [
    "gender",
    "age",
    "memberCount",
    "activeHours",
    "playstyles",
] as const;

export const lolWeights = ["rank"] as const;

export type ICommonWeights = Record<(typeof commonWeights)[number], number>;
export type IBaseWeight<
    T extends readonly string[],
    M extends (typeof modes)[number]
> = ICommonWeights &
    Record<T[number], number> & {
        mode: M;
    };

export type ILOLWeight = IBaseWeight<typeof lolWeights, "LOL">;
export type IANYWeight = IBaseWeight<never, "LOL">;
export type IWeight = ILOLWeight | IANYWeight;

const commonWeightsSchemaObject = {} as Record<string, any>;
commonWeights.forEach((x) => {
    commonWeightsSchemaObject[x] = {
        type: Number,
        required: true,
    };
});

export const WeightSchema = new Schema<IWeight>(commonWeightsSchemaObject, {
    _id: false,
    discriminatorKey: "mode",
});

const lolWeightsSchemaObject = {} as Record<string, any>;
lolWeights.forEach((x) => {
    lolWeightsSchemaObject[x] = {
        type: Number,
        required: true,
    };
});

export const LOLWeightSchema = new Schema(lolWeightsSchemaObject, {
    _id: true,
});

export const AnyWeightSchema = new Schema(
    {},
    {
        _id: true,
    }
);

WeightSchema.discriminator("LOL", LOLWeightSchema);
WeightSchema.discriminator("ANY", AnyWeightSchema);
