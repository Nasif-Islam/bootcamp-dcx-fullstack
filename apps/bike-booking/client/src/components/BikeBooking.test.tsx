import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BikeBooking from "./BikeBooking";
import type { Bike, Booking } from "../api/types";

import { getBikeAvailability } from "../api/bikes";
import { createBooking } from "../api/bookings";

vi.mock("../api/bikes", () => ({
  getBikeAvailability: vi.fn(),
}));

vi.mock("../api/bookings", () => ({
  createBooking: vi.fn(),
}));

const mockedGetBikeAvailability = vi.mocked(getBikeAvailability);
const mockedCreateBooking = vi.mocked(createBooking);

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function makeBike(overrides: Partial<Bike> = {}): Bike {
  return {
    _id: "bike1",
    name: "Test Bike 1",
    type: "road",
    description: "A fast road bike",
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
    startTime: "2026-05-21T11:00:00.000Z",
    endTime: "2026-05-21T12:00:00.000Z",
    status: "confirmed",
    createdAt: "2026-05-20T10:00:00.000Z",
    updatedAt: "2026-05-20T10:00:00.000Z",
    __v: 0,
    duration: 60 * 60 * 1000,
    ...overrides,
  };
}

function renderComponent({
  bike = makeBike(),
  userId = "user1",
  bookingHandler = vi.fn(),
}: {
  bike?: Bike;
  userId?: string;
  bookingHandler?: (b: Booking) => void;
} = {}) {
  render(
    <BikeBooking bike={bike} userId={userId} bookingHandler={bookingHandler} />,
  );
  return { bike, userId, bookingHandler };
}

function setDateTime({
  startDate,
  startTime,
  endDate,
  endTime,
}: {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}) {
  const startDateEl = document.getElementById("start-date") as HTMLInputElement;
  const startTimeEl = document.getElementById("start-time") as HTMLInputElement;
  const endDateEl = document.getElementById("end-date") as HTMLInputElement;
  const endTimeEl = document.getElementById("end-time") as HTMLInputElement;

  fireEvent.change(startDateEl, { target: { value: startDate } });
  fireEvent.change(startTimeEl, { target: { value: startTime } });
  fireEvent.change(endDateEl, { target: { value: endDate } });
  fireEvent.change(endTimeEl, { target: { value: endTime } });
}

function tomorrowISODate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

describe("BikeBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders bike info and navigates back when clicking 'Back to bikes'", async () => {
    renderComponent({ bike: makeBike({ name: "Speedster" }) });

    expect(
      screen.getByRole("heading", { name: "Speedster" }),
    ).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /back to bikes/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("disables 'Check Availability' until all date/time fields are filled", () => {
    renderComponent();

    const checkBtn = screen.getByRole("button", {
      name: /check availability/i,
    });
    expect(checkBtn).toBeDisabled();
  });

  it("shows error when end date/time is before start date/time", async () => {
    renderComponent();

    const date = tomorrowISODate();

    setDateTime({
      startDate: date,
      startTime: "12:00",
      endDate: date,
      endTime: "11:00",
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /check availability/i }),
      ).toBeEnabled();
    });

    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: /check availability/i }),
    );

    expect(
      await screen.findByText(/end date\/time must be after start date\/time/i),
    ).toBeInTheDocument();

    expect(mockedGetBikeAvailability).not.toHaveBeenCalled();
  });

  it("checks availability via API and enables submit when available", async () => {
    const { bike } = renderComponent();

    mockedGetBikeAvailability.mockResolvedValueOnce({
      available: true,
      conflicts: [],
    });

    const date = tomorrowISODate();

    setDateTime({
      startDate: date,
      startTime: "11:00",
      endDate: date,
      endTime: "12:00",
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /check availability/i }),
      ).toBeEnabled();
    });

    expect(
      screen.getByRole("button", { name: /confirm booking/i }),
    ).toBeDisabled();

    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: /check availability/i }),
    );

    expect(await screen.findByText(/bike is available!/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /confirm booking/i }),
    ).toBeEnabled();

    expect(mockedGetBikeAvailability).toHaveBeenCalledWith(
      bike._id,
      expect.stringContaining(`${date}T11:00`),
      expect.stringContaining(`${date}T12:00`),
    );
  });

  it("submits booking when available: calls createBooking and bookingHandler", async () => {
    const bookingHandler = vi.fn();
    const { bike, userId } = renderComponent({ bookingHandler });

    mockedGetBikeAvailability.mockResolvedValueOnce({
      available: true,
      conflicts: [],
    });

    const returnedBooking = makeBooking({ bikeId: bike, userId });
    mockedCreateBooking.mockResolvedValueOnce(returnedBooking);

    const date = tomorrowISODate();

    setDateTime({
      startDate: date,
      startTime: "11:00",
      endDate: date,
      endTime: "12:00",
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /check availability/i }),
      ).toBeEnabled();
    });

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: /check availability/i }),
    );
    await screen.findByText(/bike is available!/i);

    await user.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(mockedCreateBooking).toHaveBeenCalledWith({
      bikeId: bike._id,
      startTime: expect.any(String),
      endTime: expect.any(String),
    });

    expect(bookingHandler).toHaveBeenCalledWith(returnedBooking);
  });
});
