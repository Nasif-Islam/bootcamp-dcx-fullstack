import mongoose, { Schema, Model } from 'mongoose';

const { ObjectId } = Schema.Types;

// Booking document interface
export interface IBooking {
  bikeId: Schema.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'cancelled';
  duration: number; // virtual (in milliseconds)
}

// Booking Schema
const bookingSchema = new Schema<IBooking>(
  {
    bikeId: {
      type: ObjectId,
      ref: 'Bike',
      required: true,
      index: true,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for availability & conflict checks
bookingSchema.index(
  { bikeId: 1, startTime: 1, status: 1 },
  { name: 'bike_time_status_idx' }
);


// Virtual: booking duration (milliseconds)
bookingSchema.virtual('duration').get(function (this: IBooking) {
  if (!this.startTime || !this.endTime) return 0;
  return this.endTime.getTime() - this.startTime.getTime();
});

// Booking model
export const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
