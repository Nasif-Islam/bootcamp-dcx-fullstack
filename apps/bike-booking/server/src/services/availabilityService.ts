import mongoose from 'mongoose';
import { Booking, IBooking } from '../models/Booking';

export type BookingDocument = mongoose.Document<unknown, any, IBooking> & IBooking;

function ensureObjectId(value: string | mongoose.Types.ObjectId): mongoose.Types.ObjectId {
  if (typeof value === 'string') {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid ObjectId');
    }
    return new mongoose.Types.ObjectId(value);
  }

  return value;
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
  const bikeObjectId = ensureObjectId(bikeId);
  const query: Record<string, unknown> = {
    bikeId: bikeObjectId,
    status: 'confirmed',
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  };

  if (excludeBookingId) {
    if (!mongoose.Types.ObjectId.isValid(excludeBookingId)) {
      throw new Error('Invalid excludeBookingId');
    }
    query._id = { $ne: new mongoose.Types.ObjectId(excludeBookingId) };
  }

  const conflicts = await Booking.find(query).sort({ startTime: 1 }).exec();
  return {
    available: conflicts.length === 0,
    conflicts,
  };
}

export async function getBikeBookings(
  bikeId: string | mongoose.Types.ObjectId,
): Promise<BookingDocument[]> {
  const bikeObjectId = ensureObjectId(bikeId);
  return Booking.find({ bikeId: bikeObjectId, status: 'confirmed' })
    .sort({ startTime: 1 })
    .exec();
}
