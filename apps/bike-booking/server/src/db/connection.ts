import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Database connection string is not configured correctly - Check .env file",
    );
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB successfully");
}

export default connectDB;
