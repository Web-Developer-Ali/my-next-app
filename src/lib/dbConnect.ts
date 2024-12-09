import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
    if (connection.isConnected) {
        console.log("Database is already connected.");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.DB_URL || "", {
            maxPoolSize: 50,
            minPoolSize: 10,
        });

        connection.isConnected = db.connections[0].readyState;
        console.log("Database connected successfully.");
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1); // Exit process in case of failure
    }

    mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected. Attempting to reconnect...");
        dbConnection();
    });

    mongoose.set("debug", false);
}

export default dbConnection;
