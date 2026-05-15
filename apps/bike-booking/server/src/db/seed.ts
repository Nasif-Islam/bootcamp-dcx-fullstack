import dotenv from "dotenv";
import { Bike, User } from "../models/index";
import { bikes, users } from "../data/test-data";
import { connectToDB, disconnectFromDB } from "./connection";

dotenv.config();

const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectToDB();

    const deleteBikesResult = await Bike.deleteMany({});
    console.log(`Deleted: ${deleteBikesResult.deletedCount} bikes`);

    const insertedBikes = await Bike.insertMany(bikes);
    console.log(`Inserted: ${insertedBikes.length} bikes`);

    const deleteUsersResult = await User.deleteMany({});
    console.log(`Deleted: ${deleteUsersResult.deletedCount} users`);

    const insertedUsersResult = await User.create(users);
    console.log(`Inserted: ${insertedUsersResult.length} users`);

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
