import mongoose, { HydratedDocument } from 'mongoose';
import { Booking, IBooking } from '../models/Booking';

export type BookingDocument = HydratedDocument<IBooking>;

export function ensureObjectId(value: string | mongoose.Types.ObjectId): mongoose.Types.ObjectId {
  if (typeof value === 'string') {
    // valdiate string before converting to ObjectId
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid ObjectId');
    }
    return new mongoose.Types.ObjectId(value); // normalize to ObjectId
  }

  return value; // If already objectId, return
}

export interface AvailabilityResult {
  available: boolean;
  conflicts: BookingDocument[];
}

export async function checkBikeAvailability(
  bikeId: string | mongoose.Types.ObjectId,
  startTime: Date,
  endTime: Date,
  excludeBookingId?: string,
): Promise<AvailabilityResult> {
  const bikeObjectId = ensureObjectId(bikeId); // ensure consistent Id type
  // flexibile Mongo query object (allows dynamic fields like _id_).
  const query: Record<string, unknown> = {
    bikeId: bikeObjectId,
    status: 'confirmed',
    startTime: { $lt: endTime }, // booking starts before end
    endTime: { $gt: startTime }, // booking ends after start
  };

  if (excludeBookingId) {
    // used if updating an existing booking
    if (!mongoose.Types.ObjectId.isValid(excludeBookingId)) {
      throw new Error('Invalid excludeBookingId');
    }
    query._id = { $ne: new mongoose.Types.ObjectId(excludeBookingId) };
  }

  const conflicts = await Booking
    .find(query)
    .sort({ startTime: 1 }) // earliest conflict first
    .exec();

  return {
    available: conflicts.length === 0, // available if no overlaps
    conflicts,
  };
}

export async function getBikeBookings(
  bikeId: string | mongoose.Types.ObjectId,
): Promise<BookingDocument[]> {
  const bikeObjectId = ensureObjectId(bikeId); // normalize Id
  return Booking.find({ bikeId: bikeObjectId, status: 'confirmed' })
    .sort({ startTime: 1 }) 
    .exec();
}
