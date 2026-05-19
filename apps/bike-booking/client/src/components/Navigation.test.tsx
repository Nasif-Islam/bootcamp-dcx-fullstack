import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Navigation from "./Navigation";

import { UserContext } from "../context/UserContextDef";
import type { UserContextType } from "../context/UserContextDef";
import type { User } from "../api/types";

const testUser1: User = {
  id: "user-1",
  name: "Test User 1",
  email: "testuser1@example.com",
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

function renderNavigation(contextValue: UserContextType, initialRoute = "/") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <UserContext.Provider value={contextValue}>
        <Navigation />
      </UserContext.Provider>
    </MemoryRouter>,
  );
}

const loggedOutContext = (): UserContextType => ({
  user: null,
  isAuthenticated: false,
  setUser: vi.fn(),
  logout: vi.fn(),
});

const loggedInContext = (logout = vi.fn()): UserContextType => ({
  user: testUser1,
  isAuthenticated: true,
  setUser: vi.fn(),
  logout,
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Navigation", () => {
  it("shows Login when logged out", () => {
    renderNavigation(loggedOutContext());

    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /my bookings/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  it("shows My Bookings, greeting, and Logout when logged in", () => {
    renderNavigation(loggedInContext());

    expect(
      screen.getByRole("link", { name: /my bookings/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/hi,\s*test user 1/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /logout/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /login/i }),
    ).not.toBeInTheDocument();
  });

  it("toggles burger menu aria-expanded when clicked", async () => {
    const user = userEvent.setup();
    renderNavigation(loggedOutContext());

    const toggleBtn = screen.getByRole("button", {
      name: /toggle navigation menu/i,
    });

    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");

    await user.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

    await user.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the menu when a nav link is clicked", async () => {
    const user = userEvent.setup();
    renderNavigation(loggedOutContext());

    const toggleBtn = screen.getByRole("button", {
      name: /toggle navigation menu/i,
    });

    await user.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("link", { name: /browse bikes/i }));
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("calls logout when Logout is clicked", async () => {
    const user = userEvent.setup();
    const logout = vi.fn();

    renderNavigation(loggedInContext(logout));

    const toggleBtn = screen.getByRole("button", {
      name: /toggle navigation menu/i,
    });

    await user.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("link", { name: /logout/i }));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
  });
});
