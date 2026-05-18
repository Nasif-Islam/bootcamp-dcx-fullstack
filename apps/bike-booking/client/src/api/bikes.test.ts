import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBikes, getBike, getBikeAvailability } from "./bikes";
import { request } from "./client";
import type { BikeListItem, Bike, AvailabilityResponse } from "./types";

vi.mock("./client", () => ({
  request: vi.fn(),
}));

const requestMock = vi.mocked(request);

describe("api/bikes", () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it("getBikes calls /bikes and returns BikeListItem[]", async () => {
    const bikes: BikeListItem[] = [
      {
        _id: "bike1",
        name: "Roadster",
        type: "Road",
        description: "Fast bike",
        pricePerHour: 10,
        imageUrl: "https://example.com/bike.jpg",
        createdAt: "2026-05-18T10:00:00.000Z",
        updatedAt: "2026-05-18T10:00:00.000Z",
        isAvailable: true,
      },
    ];

    requestMock.mockResolvedValueOnce(bikes);

    const result = await getBikes();

    expect(requestMock).toHaveBeenCalledWith("/bikes");
    expect(result).toEqual(bikes);
    expect(result[0].isAvailable).toBe(true);
  });

  it("getBike calls /bikes/:id and returns Bike", async () => {
    const bike: Bike = {
      _id: "bike1",
      name: "Roadster",
      type: "Road",
      description: "Fast bike",
      pricePerHour: 10,
      imageUrl: "https://example.com/bike.jpg",
      createdAt: "2026-05-18T10:00:00.000Z",
      updatedAt: "2026-05-18T10:00:00.000Z",
    };

    requestMock.mockResolvedValueOnce(bike);

    const result = await getBike("bike1");

    expect(requestMock).toHaveBeenCalledWith("/bikes/bike1");
    expect(result).toEqual(bike);
    expect(result._id).toBe("bike1");
  });

  it("getBikeAvailability calls /bikes/:id/availability with startTime/endTime query params and returns AvailabilityResponse", async () => {
    const startTime = "2026-05-18T10:00:00.000Z";
    const endTime = "2026-05-18T12:00:00.000Z";

    const availability: AvailabilityResponse = {
      available: true,
      conflicts: [],
    };

    requestMock.mockResolvedValueOnce(availability);

    const result = await getBikeAvailability("bike1", startTime, endTime);

    const params = new URLSearchParams({ startTime, endTime }).toString();
    expect(requestMock).toHaveBeenCalledWith(
      `/bikes/bike1/availability?${params}`,
    );

    expect(result.available).toBe(true);
    expect(result.conflicts).toEqual([]);
  });

  it("propagates errors from request()", async () => {
    requestMock.mockRejectedValueOnce(new Error("Network down"));

    await expect(getBikes()).rejects.toThrow("Network down");
  });
});
