/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BikeList from "../pages/BikeList";
import BikeCard from "../components/BikeCard";
import * as asyncHook from "../hooks/useAsync";
import "@testing-library/jest-dom/vitest";

// cleanup to prevent multiple renders stacking
afterEach(() => {
  cleanup();
});

// mock useUser
vi.mock("../context/useUser", () => ({
  useUser: () => ({
    isAuthenticated: true,
  }),
}));

// mock API (not directly used but required)
vi.mock("../api/bikes", () => ({
  getBikes: vi.fn(),
}));

// mock useAsync hook
vi.mock("../hooks/useAsync", () => ({
  useAsync: () => ({
    data: mockBikes,
    loading: false,
    error: null,
  }),
}));

vi.spyOn(asyncHook, "useAsync");

describe("BikeCard rendering", () => {
  const baseProps = {
    bikeId: "B001",
    bikeImg: "https://example.com/bike.jpg",
    bikeName: "TrailBlazer X1",
    typeIcon: "⛰️",
    typeName: "Mountain",
    bikeDesc: "A rugged mountain bike designed for off-road trails.",
    bikePrice: 8,
    availabilityIcon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  };

  const renderComponent = (props = {}) =>
    render(
      // provides React Router context
      <MemoryRouter>
        <BikeCard {...baseProps} {...props} />{" "}
        {/*the ...props overrides whatever is in the baseProps*/}
      </MemoryRouter>,
    );

  // Test that the mock data (baseProps) is rendered onto the BikeCard
  it("renders bike information correctly", () => {
    renderComponent({ isAvailable: true }); // the BikeCard is rendered and the isAvailable status is overridden to true

    expect(screen.getByText("TrailBlazer X1")).toBeInTheDocument();
    expect(
      screen.getByText("A rugged mountain bike designed for off-road trails."),
    ).toBeInTheDocument();

    expect(screen.getByText("Mountain")).toBeInTheDocument();
    expect(screen.getByText("£8/hour")).toBeInTheDocument();

    // image
    expect(screen.getByAltText("TrailBlazer X1")).toBeInTheDocument();
  });

  // Test the available state
  it("shows available state correctly (Book Now)", () => {
    renderComponent({ isAvailable: true });

    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Book Now")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "Book Now" });
    expect(button).not.toBeDisabled();
  });

  // Test the booked (unavailable) state
  it("shows unavailable state correctly (Booked)", () => {
    renderComponent({ isAvailable: false }); // the BikeCard is rendered and the isAvailable status is overridden to false

    expect(screen.getByText("Booked")).toBeInTheDocument();
    expect(screen.getByText("Unavailable")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "Unavailable" });
    expect(button).toBeDisabled();
  });

  // Test the 'Currently Booked' overlay when a bike has been booked
  it("shows 'Currently Booked' overlay when unavailable", () => {
    renderComponent({ isAvailable: false });

    expect(screen.getByText("Currently Booked")).toBeInTheDocument();
  });
});

// mock data (1 bike per type)
const mockBikes = [
  {
    _id: "B001",
    name: "TrailBlazer X1",
    type: "mountain",
    description: "Mountain bike",
    pricePerHour: 10,
    imageUrl: "img1",
    isAvailable: true,
  },
  {
    _id: "B002",
    name: "RoadRunner Pro",
    type: "road",
    description: "Road bike",
    pricePerHour: 12,
    imageUrl: "img2",
    isAvailable: true,
  },
  {
    _id: "B003",
    name: "City Cruiser",
    type: "city",
    description: "City bike",
    pricePerHour: 8,
    imageUrl: "img3",
    isAvailable: true,
  },
  {
    _id: "B004",
    name: "Volt E-Bike",
    type: "electric",
    description: "Electric bike",
    pricePerHour: 15,
    imageUrl: "img4",
    isAvailable: true,
  },
];

const renderComponent = () =>
  render(
    // provides React Router context
    <MemoryRouter>
      <BikeList />
    </MemoryRouter>,
  );

describe("BikeList filtering", () => {
  beforeEach(() => {
    // runs before each test in the 'it' block
    (asyncHook.useAsync as any).mockReturnValue({
      // this replaces the useAsync(getBikes)
      data: mockBikes,
      loading: false,
      error: null,
    });
    /*
      This: 
      const { data: bikes, loading, error } = useAsync(getBikes);

      Becomes these:
      const bikes = mockBikes;
      const loading = false;
      const error = null;

    */
  });

  it("filters bikes by type: all", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /all/i }));

    expect(screen.getByText("TrailBlazer X1")).toBeInTheDocument();
    expect(screen.getByText("RoadRunner Pro")).toBeInTheDocument();
    expect(screen.getByText("City Cruiser")).toBeInTheDocument();
    expect(screen.getByText("Volt E-Bike")).toBeInTheDocument();
  });

  it("filters bikes by type: mountain", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /mountain/i }));

    expect(screen.getByText("TrailBlazer X1")).toBeInTheDocument();
    expect(screen.queryByText("RoadRunner Pro")).not.toBeInTheDocument();
    expect(screen.queryByText("City Cruiser")).not.toBeInTheDocument();
    expect(screen.queryByText("Volt E-Bike")).not.toBeInTheDocument();
  });

  it("filters bikes by type: road", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /road/i }));

    expect(screen.getByText("RoadRunner Pro")).toBeInTheDocument();
    expect(screen.queryByText("TrailBlazer X1")).not.toBeInTheDocument();
    expect(screen.queryByText("City Cruiser")).not.toBeInTheDocument();
    expect(screen.queryByText("Volt E-Bike")).not.toBeInTheDocument();
  });

  it("filters bikes by type: city", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /city/i }));

    expect(screen.getByText("City Cruiser")).toBeInTheDocument();
    expect(screen.queryByText("TrailBlazer X1")).not.toBeInTheDocument();
    expect(screen.queryByText("RoadRunner Pro")).not.toBeInTheDocument();
    expect(screen.queryByText("Volt E-Bike")).not.toBeInTheDocument();
  });

  it("filters bikes by type: electric", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /electric/i }));

    expect(screen.getByText("Volt E-Bike")).toBeInTheDocument();
    expect(screen.queryByText("TrailBlazer X1")).not.toBeInTheDocument();
    expect(screen.queryByText("RoadRunner Pro")).not.toBeInTheDocument();
    expect(screen.queryByText("City Cruiser")).not.toBeInTheDocument();
  });
});

describe("Loading and error state", () => {
  it("shows loading skeletons when loading is true", () => {
    (asyncHook.useAsync as any).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    renderComponent();

    const skeletons = document.querySelectorAll(".skeleton-card");
    expect(skeletons.length).toBe(6);
  });

  it("does NOT show loading skeletons when loading is false", () => {
    (asyncHook.useAsync as any).mockReturnValue({
      data: mockBikes,
      loading: false,
      error: null,
    });

    renderComponent();
    expect(document.querySelector(".skeleton-card")).toBeNull();
  });

  it("displays an error message when the API call fails", () => {
    (asyncHook.useAsync as any).mockReturnValue({
      data: null,
      loading: false,
      error: "Failed to fetch bikes",
    });

    renderComponent();

    expect(
      screen.getByText("Error: Failed to fetch bikes"),
    ).toBeInTheDocument();
  });
});
