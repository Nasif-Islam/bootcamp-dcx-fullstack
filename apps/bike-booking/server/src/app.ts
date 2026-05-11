import express from "express";
import bookingsRouter from "./routes/bookings";
import usersRouter from "./routes/users";
import bikeRouter from "./routes/bikes";


const app = express();

app.use(express.json());

app.use("/api/bookings", bookingsRouter);

app.use("/api/users", usersRouter);

app.use("/api/bikes", bikeRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
