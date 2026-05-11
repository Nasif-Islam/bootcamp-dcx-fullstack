import express from "express";
import mongoose from "mongoose";
import { Bike } from "../models/Bike";
import {
  ensureObjectId,
  checkBikeAvailability,
} from "../services/availabilityService";

const bikeRouter = express.Router();

// Function to check availability for time range
async function isAvailable(
  bikeId: string,
  startTime?: Date,
  endTime?: Date,
): Promise<boolean> {
  const start = startTime || new Date(); // default to now if not provided
  const end = endTime || new Date(start.getTime() + 60 * 60 * 1000); // 1 hour from now, the default booking duration

  try {
    const result = await checkBikeAvailability(bikeId, start, end);
    return result.available; // return the availability status
  } catch (error) {
    console.error(`Error checking availability for bike ${bikeId}:`, error);
    return false; // Assume unavailable on error
  }
}

// List all bikes with availability status
bikeRouter.get("/", async (req, res) => {
  try {
    const type =
      typeof req.query.type === "string" ? req.query.type : undefined;
    const filter = type ? { type } : {};
    const bikes = await Bike.find(filter); // fetch bikes from MongoDB with optional type filter

    // Add availability status to each bike
    const bikesWithAvailability = await Promise.all(
      bikes.map(async (bike) => ({
        ...bike.toObject(),
        isAvailable: await isAvailable(bike._id.toString()),
      })),
    );

    res.json(bikesWithAvailability);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bikes" });
  }
});

// Get single bike details
bikeRouter.get("/:id", async (req, res) => {
  try {
    const bikeId: string = req.params.id;
    const bikeObjectId = ensureObjectId(bikeId); // check if valid ObjectID
    const bike = await Bike.findById(bikeObjectId); // fetch bike details from MongoDB

    if (!bike) {
      return res.status(404).json({ error: "Bike not found" });
    }
    res.status(200).json(bike);
  } catch (error) {
    console.error("Error fetching bike details:", error);
    return res.status(400).json({ error: "Invalid ObjectID format" });
  }
});

// Check availability for time range
bikeRouter.get("/:id/availability", async (req, res) => {
  try {
    const bikeID: string = req.params.id; // grab the bike ID from the URL parameter
    const { startTime, endTime } = req.query; // grab startTime and endTime from query parameters

    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ error: "startTime and endTime query parameters are required" });
    }
    const result = await checkBikeAvailability(
      bikeID,
      new Date(startTime as string),
      new Date(endTime as string),
    ); // check if bike is available for the given time range
    res.json(result);
  } catch (error) {
    console.error("Error checking bike availability:", error);
    return res.status(500).json({ error: "Failed to check bike availability" });
  }
});

export default bikeRouter;
