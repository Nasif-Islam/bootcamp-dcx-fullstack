import mongoose from 'mongoose';
import Booking from './Booking';
import { connectToDB, disconnectFromDB } from '../db/connection';

beforeAll(async () => {
  // Use a test database so it appears separately in Mongo Compass
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/bike-booking-test';
  await connectToDB();
});

// afterEach(async () => {
//   // Clear bookings between tests to keep data in Compass
//   await Booking.deleteMany({});
// });

afterAll(async () => {
  // Uncomment to clear test data after tests
  // await Booking.deleteMany({});
  await disconnectFromDB();
});

describe('Booking Model', () => {
  test('creates a booking document in MongoDB', async () => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

    const booking = await Booking.create({
      bikeId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      startTime,
      endTime,
    });

    expect(booking._id).toBeDefined();
    expect(booking.status).toBe('confirmed');
    expect(booking.startTime).toEqual(startTime);
    expect(booking.endTime).toEqual(endTime);
  });

  test('retrieves booking by ID from MongoDB', async () => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    const bikeId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    const created = await Booking.create({
      bikeId,
      userId,
      startTime,
      endTime,
    });

    const found = await Booking.findById(created._id);

    expect(found).not.toBeNull();
    expect(found?.bikeId.toString()).toBe(bikeId.toString());
    expect(found?.userId.toString()).toBe(userId.toString());
  });

  test('calculates duration virtual field correctly', async () => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours

    const booking = await Booking.create({
      bikeId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      startTime,
      endTime,
    });

    expect(booking.duration).toBe(2 * 60 * 60 * 1000);
  });

  test('sets status to confirmed by default', async () => {
    const booking = await Booking.create({
      bikeId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
    });

    expect(booking.status).toBe('confirmed');
  });

  test('allows cancelling a booking', async () => {
    const booking = await Booking.create({
      bikeId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
    });

    booking.status = 'cancelled';
    const updated = await booking.save();

    expect(updated.status).toBe('cancelled');

    const found = await Booking.findById(booking._id);
    expect(found?.status).toBe('cancelled');
  });
});
