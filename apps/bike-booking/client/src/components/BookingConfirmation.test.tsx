import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { BookingConfirmation } from "./BookingConfirmation";
import type { Booking, Bike } from "../api/types";

function makeBike(overrides: Partial<Bike> = {}): Bike {
  return {
    _id: "bike1",
    name: "Test Bike 1",
    type: "road",
    description: "A test bike",
    pricePerHour: 10,
    imageUrl: "https://example.com/bike.jpg",
    createdAt: "2026-05-20T10:00:00.000Z",
    updatedAt: "2026-05-20T10:00:00.000Z",
    ...overrides,
  };
}

function makeBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    _id: "b1",
    id: "b1",
    bikeId: makeBike(),
    userId: "user1",
    startTime: "2026-05-21T09:00:00.000Z",
    endTime: "2026-05-21T10:00:00.000Z",
    status: "confirmed",
    createdAt: "2026-05-20T10:00:00.000Z",
    updatedAt: "2026-05-20T10:00:00.000Z",
    __v: 0,
    duration: 60 * 60 * 1000,
    ...overrides,
  };
}

function renderWithRoutes(booking: Booking) {
  return render(
    <MemoryRouter initialEntries={["/confirm"]}>
      <Routes>
        <Route
          path="/confirm"
          element={<BookingConfirmation booking={booking} />}
        />
        <Route path="/my-bookings" element={<h1>My Bookings Page</h1>} />
        <Route path="/bikes" element={<h1>Bikes Page</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("BookingConfirmation", () => {
  it("renders confirmation message and booking summary", () => {
    const booking = makeBooking({
      id: "booking-123",
      bikeId: makeBike({ name: "Speedster 3000" }),
    });

    renderWithRoutes(booking);

    expect(screen.getByText(/booking confirmed!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your bike has been successfully booked/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Speedster 3000" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/booking id:\s*booking-123/i)).toBeInTheDocument();

    expect(screen.getByText(/start:/i)).toBeInTheDocument();
    expect(screen.getByText(/end:/i)).toBeInTheDocument();
  });

  it("shows total price in pounds with 2 decimals", () => {
    const booking = makeBooking({
      duration: 2 * 60 * 60 * 1000,
      bikeId: makeBike({ pricePerHour: 12 }),
    });

    renderWithRoutes(booking);

    expect(screen.getByText("£24.00")).toBeInTheDocument();
  });

  it("navigates to /my-bookings when clicking 'View My Bookings'", async () => {
    const booking = makeBooking();
    renderWithRoutes(booking);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /view my bookings/i }));

    expect(await screen.findByText(/my bookings page/i)).toBeInTheDocument();
  });

  it("navigates to /bikes when clicking 'Book Another Bike'", async () => {
    const booking = makeBooking();
    renderWithRoutes(booking);

    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: /book another bike/i }),
    );

    expect(await screen.findByText(/bikes page/i)).toBeInTheDocument();
  });
});
