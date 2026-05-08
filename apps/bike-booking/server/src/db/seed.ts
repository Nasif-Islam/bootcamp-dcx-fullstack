import dotenv from "dotenv";
import { Bike } from "../models/index";
import { bikes } from "../data/data";
import { connectToDB, disconnectFromDB } from "./connection";

dotenv.config();

const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectToDB();

    const deleteResult = await Bike.deleteMany({});
    console.log(`Deleted: ${deleteResult.deletedCount} bikes`);

    const inserted = await Bike.insertMany(bikes);
    console.log(`Inserted: ${inserted.length} bikes`);

    process.exitCode = 0;
  } catch (err) {
    console.error("Error seeding the database:", err);
    process.exitCode = 1;
  } finally {
    try {
      await disconnectFromDB();
      console.log("Database seeding completely successfully");
    } catch (err) {
      console.error("Error disconnecting from MongoDB", err);
      process.exitCode = 1;
    }
  }
};

seedDB();
