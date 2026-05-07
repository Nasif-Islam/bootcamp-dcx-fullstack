import app from "./app";
import * as dotenv from "dotenv";
import { connectDB, disconnectDB } from "./db/connection";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Application started successfully");
    });
  } catch (err) {
    console.error("Failed to start application:", err);
    process.exit(1);
  }
}

startServer();
