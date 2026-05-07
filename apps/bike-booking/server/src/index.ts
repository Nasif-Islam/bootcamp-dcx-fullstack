import app from "./app";
import * as dotenv from "dotenv";
import connectDb from "./db/connection";

dotenv.config({ path: "../../../.env" });

const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start application:", err);
    process.exit(1);
  }
  console.log("Application started successfully");
}

startServer();
