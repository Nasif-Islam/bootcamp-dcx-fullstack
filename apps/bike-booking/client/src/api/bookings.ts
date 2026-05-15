import { request } from "./client";
import type { Booking, CreateBookingInput } from "./types";

export function getUserBookings(userId: string): Promise<Booking[]> {
  const params = new URLSearchParams({ userId });
  return request<Booking[]>(`/bookings?${params.toString()}`);
}

export function createBooking(input: CreateBookingInput): Promise<Booking> {
  return request<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function cancelBooking(bookingId: string): Promise<Booking> {
  return request<Booking>(`/bookings/${bookingId}`, {
    method: "DELETE",
  });
}
