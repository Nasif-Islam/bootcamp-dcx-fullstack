import express from "express";
import bookingsRouter from "./routes/bookings";

const app = express();

app.use(express.json());
app.use("/api/bookings", bookingsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
