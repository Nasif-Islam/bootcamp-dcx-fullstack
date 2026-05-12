export type BikeListItem = {
  _id: string;
  name: string;
  type: string;
  description: string;
  pricePerHour: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  isAvailable: boolean;
};

export type Bike = Omit<BikeListItem, "isAvailable">;

export type Booking = {
  _id: string;
  id: string;
  bikeId: Bike;
  userId: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "cancelled" | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  duration: number;
};

export type CreateBookingInput = {
  bikeId: string;
  userId: string;
  startTime: string;
  endTime: string;
};

export type BookingConflict = {
  _id: string;
  id: string;
  bikeId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "cancelled" | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  duration: number;
};

export type CreateBookingConflictResponse = {
  error: string;
  conflicts: BookingConflict[];
};

export type AvailabilityResponse = {
  available: boolean;
  conflicts: BookingConflict[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};
