import mongoose from "mongoose";

// number to check whether we are already connected or not, its type can also be a string
type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

// void in ts is different from void in cpp
// void in ts -> doesnt care about type of data
async function connectDB(): Promise<void> {

    // check whether DB is already connected or not
    // if already connected then connection object would contain a number otherwise it would be empty
    if (connection.isConnected) {
        console.log("Database already connected")
        return
    }

    // try catch to connect db
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI as string);

        // set that number to non null value if db connected successfully
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected successfully")

    } catch (error) {
        console.log("DB connection failed")
        // exit the process because db is not connected
        process.exit(1);

    }
}

export default connectDB;