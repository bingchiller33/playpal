import mongoose, { connection } from "mongoose";
import { loadEnvConfig } from "@next/env";

const connectData = {
    isConnected: 0,
};

async function dbConnect() {
    if (connectData.isConnected) {
        return;
    }

    const db = await mongoose.connect(process.env.MONGO_URI!);
    connectData.isConnected = db.connections[0].readyState;
}

export default dbConnect;
