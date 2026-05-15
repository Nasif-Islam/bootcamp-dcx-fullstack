import express from "express";
import mongoose from "mongoose";
import { Bike } from "../models/Bike";
import { Booking } from "../models/Booking";
import { checkBikeAvailability } from "../services/availabilityService";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res) => {
  const filter: Record<string, unknown> = {};
  // Only allow bookings for the authenticated user
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  filter.userId = new mongoose.Types.ObjectId(req.userId);

  try {
    const bookings = await Booking.find(filter).populate("bikeId").exec();
    return res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.get("/availability", async (req, res) => {
  const bikeId = req.query.bikeId as string | undefined;
  const startTime = req.query.startTime as string | undefined;
  const endTime = req.query.endTime as string | undefined;

  if (!bikeId || !startTime || !endTime) {
    return res
      .status(400)
      .json({ error: "bikeId, startTime, and endTime are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(bikeId)) {
    return res.status(400).json({ error: "Invalid bikeId" });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start >= end
  ) {
    return res.status(400).json({ error: "Invalid booking window" });
  }

  try {
    const availability = await checkBikeAvailability(bikeId, start, end);
    return res.json({
      bikeId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      ...availability,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return res.status(500).json({ error: "Failed to check availability" });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  const { bikeId, startTime, endTime } = req.body;
  const userId = req.userId;

  if (!bikeId || !userId || !startTime || !endTime) {
    return res
      .status(400)
      .json({ error: "bikeId, startTime, and endTime are required" });
  }

  if (
    !mongoose.Types.ObjectId.isValid(bikeId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({ error: "Invalid bikeId or userId" });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start >= end
  ) {
    return res.status(400).json({ error: "Invalid booking window" });
  }

  try {
    const bike = await Bike.findById(bikeId).exec();
    if (!bike) {
      return res.status(404).json({ error: "Bike not found" });
    }

    const availability = await checkBikeAvailability(bikeId, start, end);
    if (!availability.available) {
      return res.status(409).json({
        error: "Bike is not available for the selected time window",
        conflicts: availability.conflicts,
      });
    }

    const booking = await Booking.create({
      bikeId: new mongoose.Types.ObjectId(bikeId),
      userId: new mongoose.Types.ObjectId(userId),
      startTime: start,
      endTime: end,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("bikeId")
      .exec();
    return res.status(201).json(populatedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ error: "Failed to create booking" });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const bookingId = Array.isArray(id) ? id[0] : id;
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ error: "Invalid booking id" });
  }

  try {
    // Only allow the owner to cancel their booking
    const booking = await Booking.findById(bookingId).exec();
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (!userId || booking.userId.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden: Not your booking" });
    }
    const cancelled = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true },
    )
      .populate("bikeId")
      .exec();
    return res.json(cancelled);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({ error: "Failed to cancel booking" });
  }
});

export default router;
