import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/resume-builder";

let isConnected = false;
let usingFallback = false;

// In-memory storage fallback for development
export let inMemoryResumes: any[] = [];

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  // Try to connect to MongoDB
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    usingFallback = false;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.warn(
      "MongoDB connection failed, using in-memory storage for development:",
      error,
    );
    isConnected = true;
    usingFallback = true;
  }
}

export function isUsingFallback() {
  return usingFallback;
}

export default mongoose;
