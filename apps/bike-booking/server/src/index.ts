import app from "./app";
import dotenv from "dotenv";
import { connectToDB, disconnectFromDB } from "./db/connection";

console.log("CWD:", process.cwd());

dotenv.config();

const PORT = Number(process.env.PORT) || 5001;

async function startServer(): Promise<void> {
  try {
    await connectToDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async (signal: string) => {
      console.log(
        `\n${signal} received. Shutting down server and database connection...`,
      );

      server.close(async () => {
        console.log("Express HTTP server closed");
        try {
          await disconnectFromDB();
        } catch (err) {
          console.error("Error during database disconnection:", err);
        }
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
