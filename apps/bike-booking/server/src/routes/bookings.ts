import express from 'express';
import mongoose from 'mongoose';
import { Bike } from '../models/Bike';
import { Booking } from '../models/Booking';
import { checkBikeAvailability } from '../services/availabilityService';

const router = express.Router();

router.get('/', async (req, res) => {
  const filter: Record<string, unknown> = {};
  const userId = req.query.userId as string | undefined;

  if (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
    filter.userId = new mongoose.Types.ObjectId(userId);
  }

  try {
    const bookings = await Booking.find(filter).populate('bikeId').exec();
    return res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.get('/availability', async (req, res) => {
  const bikeId = req.query.bikeId as string | undefined;
  const startTime = req.query.startTime as string | undefined;
  const endTime = req.query.endTime as string | undefined;

  if (!bikeId || !startTime || !endTime) {
    return res.status(400).json({ error: 'bikeId, startTime, and endTime are required' });
  }

  if (!mongoose.Types.ObjectId.isValid(bikeId)) {
    return res.status(400).json({ error: 'Invalid bikeId' });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
    return res.status(400).json({ error: 'Invalid booking window' });
  }

  try {
    const availability = await checkBikeAvailability(bikeId, start, end);
    return res.json({ bikeId, startTime: start.toISOString(), endTime: end.toISOString(), ...availability });
  } catch (error) {
    console.error('Error checking availability:', error);
    return res.status(500).json({ error: 'Failed to check availability' });
  }
});

router.post('/', async (req, res) => {
  const { bikeId, userId, startTime, endTime } = req.body;

  if (!bikeId || !userId || !startTime || !endTime) {
    return res.status(400).json({ error: 'bikeId, userId, startTime, and endTime are required' });
  }

  if (!mongoose.Types.ObjectId.isValid(bikeId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid bikeId or userId' });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
    return res.status(400).json({ error: 'Invalid booking window' });
  }

  try {
    const bike = await Bike.findById(bikeId).exec();
    if (!bike) {
      return res.status(404).json({ error: 'Bike not found' });
    }

    const availability = await checkBikeAvailability(bikeId, start, end);
    if (!availability.available) {
      return res.status(409).json({
        error: 'Bike is not available for the selected time window',
        conflicts: availability.conflicts,
      });
    }

    const booking = await Booking.create({
      bikeId: new mongoose.Types.ObjectId(bikeId),
      userId: new mongoose.Types.ObjectId(userId),
      startTime: start,
      endTime: end,
    });

    const populatedBooking = await Booking.findById(booking._id).populate('bikeId').exec();
    return res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid booking id' });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true },
    )
      .populate('bikeId')
      .exec();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;
