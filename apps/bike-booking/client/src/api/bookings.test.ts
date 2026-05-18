import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserBookings, createBooking, cancelBooking } from "./bookings";
import { request } from "./client";
import type { Booking, CreateBookingInput } from "./types";

vi.mock("./client", () => ({
  request: vi.fn(),
}));

const requestMock = vi.mocked(request);

describe("api/bookings", () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it("getUserBookings calls GET /bookings and returns Booking[]", async () => {
    const bookings: Booking[] = [
      {
        _id: "mongo1",
        id: "booking1",
        bikeId: {
          _id: "bike1",
          name: "Roadster",
          type: "Road",
          description: "Fast bike",
          pricePerHour: 10,
          imageUrl: "https://example.com/bike.jpg",
          createdAt: "2026-05-18T10:00:00.000Z",
          updatedAt: "2026-05-18T10:00:00.000Z",
        },
        userId: "user1",
        startTime: "2026-05-18T10:00:00.000Z",
        endTime: "2026-05-18T12:00:00.000Z",
        status: "confirmed",
        createdAt: "2026-05-18T09:00:00.000Z",
        updatedAt: "2026-05-18T09:00:00.000Z",
        __v: 0,
        duration: 2 * 60 * 60 * 1000,
      },
    ];

    requestMock.mockResolvedValueOnce(bookings);

    const result = await getUserBookings();

    expect(requestMock).toHaveBeenCalledWith("/bookings");
    expect(result).toEqual(bookings);
  });

  it("createBooking POSTs /bookings with JSON stringified body (no userId)", async () => {
    const mockBooking = { id: "booking1" } as unknown as Booking;
    requestMock.mockResolvedValueOnce(mockBooking);

    const input: Omit<CreateBookingInput, "userId"> = {
      bikeId: "bike1",
      startTime: "2026-05-18T10:00:00.000Z",
      endTime: "2026-05-18T12:00:00.000Z",
    };

    const result = await createBooking(input);

    expect(requestMock).toHaveBeenCalledWith("/bookings", {
      method: "POST",
      body: JSON.stringify(input),
    });

    expect(result).toBe(mockBooking);
  });

  it("cancelBooking DELETEs /bookings/:id", async () => {
    const mockBooking = { id: "booking123" } as unknown as Booking;
    requestMock.mockResolvedValueOnce(mockBooking);

    const result = await cancelBooking("booking123");

    expect(requestMock).toHaveBeenCalledWith("/bookings/booking123", {
      method: "DELETE",
    });

    expect(result).toBe(mockBooking);
  });

  it("propagates request() errors", async () => {
    requestMock.mockRejectedValueOnce(new Error("API error"));
    await expect(getUserBookings()).rejects.toThrow("API error");
  });
});
