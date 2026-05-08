import { Bike } from "../models/Bike";
import { bikes } from "../data/data";
import { connectToDB, disconnectFromDB } from "./connection";

const seedDB = async () => {
  try {
    await connectToDB();

    const deleteResult = await Bike.deleteMany({});
    console.log(`Deleted: ${deleteResult.deletedCount} bikes`);

    const inserted = await Bike.insertMany(bikes);
    console.log(`Inserted: ${inserted.length} bikes`);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding the database:", err);
    process.exit(1);
  } finally {
    await disconnectFromDB();
  }
};

seedDB();
