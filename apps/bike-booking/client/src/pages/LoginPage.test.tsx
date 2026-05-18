import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./LoginPage";
import * as api from "../api/api";

vi.mock("../api/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/api")>();
  return { ...actual, login: vi.fn() };
});

const setUserMock = vi.fn();
vi.mock("../context/useUser", () => ({
  useUser: () => ({ setUser: setUserMock }),
}));

const loginMock = api.login as unknown as ReturnType<typeof vi.fn>;

function renderRoutes(initialRoute = "./login") {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/bikes" element={<h1>Bikes Page</h1>} />
        <Route path="/register" element={<h1>Register Page</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

function setup(initialRoute = "/login") {
  const user = userEvent.setup();
  renderRoutes(initialRoute);
  return { user };
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loginMock.mockReset();
    setUserMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders email + password fields and Sign In button", () => {
    setup();

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("shows required field errors and does not call login when empty", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Email is a required field"),
    ).toBeInTheDocument();

    expect(
      await screen.findByText("Password is a required field"),
    ).toBeInTheDocument();

    expect(loginMock).not.toHaveBeenCalled();
    expect(setUserMock).not.toHaveBeenCalled();
  });

  it("shows email format validation when email does not contain @ (custom validation)", async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText(/^email$/i), "invalid-email");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Email must contain @")).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("calls login with trimmed + lowercased email, sets user, and redirects to /bikes on success", async () => {
    const { user } = setup();

    const mockUser = {
      id: "u1",
      name: "Test User",
      email: "testuser@test.com",
      createdAt: "2026-05-18T10:00:00.000Z",
      updatedAt: "2026-05-18T10:00:00.000Z",
    };

    loginMock.mockResolvedValueOnce(mockUser);

    await user.type(screen.getByLabelText(/^email$/i), " TESTUSER@TEST.COM ");
    await user.type(screen.getByLabelText(/^password$/i), "password123");

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(loginMock).toHaveBeenCalledWith({
      email: "testuser@test.com",
      password: "password123",
    });

    expect(setUserMock).toHaveBeenCalledWith(mockUser);

    expect(await screen.findByText(/bikes page/i)).toBeInTheDocument();
  });

  it("shows 'Invalid email or password' when ApiError matches invalid credentials pattern", async () => {
    const { user } = setup();

    const err = new api.ApiError("Request failed (400)", 400, {
      message: "Invalid email or password",
    });

    loginMock.mockRejectedValueOnce(err);

    await user.type(screen.getByLabelText(/^email$/i), "testuser@test.com");
    await user.type(screen.getByLabelText(/^password$/i), "wrongpass");

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Invalid email or password"),
    ).toBeInTheDocument();
    expect(setUserMock).not.toHaveBeenCalled();
  });

  it("navigates to /register when clicking 'Create one' link", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("link", { name: /create one/i }));

    expect(await screen.findByText(/register page/i)).toBeInTheDocument();
  });
});
