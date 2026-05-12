import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BikeBooking from "./BikeBooking";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("BikeBooking", () => {
  it("renders bike details from the API", async () => {
    const sampleBike = {
      _id: "bike-1",
      name: "Rapid Rider",
      type: "road",
      description: "A fast road bike for city and sport rides.",
      pricePerHour: 22,
      imageUrl: "",
      isAvailable: true,
    };

    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true,
      json: async () => [sampleBike],
    })));

    render(<BikeBooking />);

    expect(await screen.findByRole("heading", { level: 3 })).toHaveTextContent(
      "Rapid Rider",
    );
    expect(screen.getByText(/Type:/i)).toHaveTextContent("Type: road");
    expect(screen.getByText(/Description:/i)).toHaveTextContent(
      "Description: A fast road bike for city and sport rides.",
    );
    expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
      "Price: $22.00 / hour",
    );
    expect(screen.getByText(/Available now/i)).toBeInTheDocument();
  });

  it("shows loading text while the bike is being fetched", async () => {
    const fetchPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ok: true, json: async () => [{ _id: "bike-2", name: "Slow Bike", type: "city", description: "A slow bike.", pricePerHour: 10 }] });
      }, 0);
    });

    vi.stubGlobal("fetch", vi.fn(() => fetchPromise as any));

    render(<BikeBooking />);

    expect(screen.getByText(/Loading bike details.../i)).toBeInTheDocument();
    expect(await screen.findByText(/Slow Bike/i)).toBeInTheDocument();
  });
});
