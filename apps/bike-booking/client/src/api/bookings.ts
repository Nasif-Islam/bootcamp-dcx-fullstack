import { request } from "./client";
import type { Booking, CreateBookingInput } from "./types";

export function getUserBookings(): Promise<Booking[]> {
  return request<Booking[]>(`/bookings`);
}

export function createBooking(
  input: Omit<CreateBookingInput, "userId">,
): Promise<Booking> {
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
