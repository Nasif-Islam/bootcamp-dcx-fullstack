import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MyBookings from "./MyBookings";
import { getUserBookings, cancelBooking } from "../api/bookings";
import { useUser } from "../context/useUser";
import type { Booking, Bike, User } from "../api/types";

vi.mock("../api/bookings", () => ({
  getUserBookings: vi.fn(),
  cancelBooking: vi.fn(),
}));

vi.mock("../context/useUser", () => ({
  useUser: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockedGetUserBookings = vi.mocked(getUserBookings);
const mockedCancelBooking = vi.mocked(cancelBooking);
const mockedUseUser = vi.mocked(useUser);

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: "user1",
  name: "Test User 1",
  email: "test1@example.com",
  createdAt: "2026-05-20T10:00:00.000Z",
  updatedAt: "2026-05-20T10:00:00.000Z",
  ...overrides,
});

const makeBike = (overrides: Partial<Bike> = {}): Bike => ({
  _id: "bike1",
  name: "Test Bike",
  type: "road",
  description: "A test bike",
  pricePerHour: 10,
  imageUrl: "https://example.com/bike.jpg",
  createdAt: "2026-05-20T10:00:00.000Z",
  updatedAt: "2026-05-20T10:00:00.000Z",
  ...overrides,
});

const makeBooking = (overrides: Partial<Booking> = {}): Booking => ({
  _id: "b1",
  id: "b1",
  bikeId: makeBike(),
  userId: "user1",
  startTime: "2026-05-21T09:00:00Z",
  endTime: "2026-05-21T10:00:00Z",
  status: "confirmed",
  createdAt: "2026-05-20T10:00:00.000Z",
  updatedAt: "2026-05-20T10:00:00.000Z",
  __v: 0,
  duration: 1,
  ...overrides,
});

function mockAuth(user: User | null) {
  mockedUseUser.mockReturnValue({
    user,
    isAuthenticated: !!user,
    setUser: vi.fn(),
    logout: vi.fn(),
  });
}

function renderPage() {
  return render(<MyBookings />);
}

describe("MyBookings (simple tests)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth(makeUser());
  });

  it("shows login message when user is not authenticated", () => {
    mockAuth(null);

    renderPage();

    expect(
      screen.getByText(/please log in to see your bookings/i),
    ).toBeInTheDocument();
  });

  it("shows loading then displays bookings", async () => {
    mockedGetUserBookings.mockResolvedValueOnce([makeBooking()]);

    renderPage();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText("Test Bike")).toBeInTheDocument();
  });

  it("shows empty state when no bookings", async () => {
    mockedGetUserBookings.mockResolvedValueOnce([]);

    renderPage();

    expect(
      await screen.findByText(/you don't have any bookings yet/i),
    ).toBeInTheDocument();
  });

  it("cancels a booking when button is clicked", async () => {
    mockedGetUserBookings.mockResolvedValueOnce([makeBooking()]);
    mockedCancelBooking.mockResolvedValueOnce(
      makeBooking({ status: "cancelled" }),
    );

    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderPage();

    expect(await screen.findByText("Test Bike")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockedCancelBooking).toHaveBeenCalledWith("b1");
  });

  it("navigates back when clicking back button", async () => {
    mockedGetUserBookings.mockResolvedValueOnce([]);

    renderPage();

    await screen.findByText(/you don't have any bookings yet/i);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /back to bikes/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/bikes");
  });
});
