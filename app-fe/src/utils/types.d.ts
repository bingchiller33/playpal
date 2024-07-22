import mongoose from "mongoose";

export interface NextPageProps {
    params: Record<string, string>;
    // searchParams: Record<string, string> | never;
}

export type WithId<T> = T & { _id: mongoose.Types.ObjectId };
export type MongooseRef<T> = WithId<T> | mongoose.Types.ObjectId;
