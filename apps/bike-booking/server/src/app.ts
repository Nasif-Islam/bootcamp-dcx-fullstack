import express from "express";
import bookingsRouter from "./routes/bookings";
import usersRouter from "./routes/users";

const app = express();

app.use(express.json());

app.use("/api/bookings", bookingsRouter);

app.use("/api/users", usersRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
