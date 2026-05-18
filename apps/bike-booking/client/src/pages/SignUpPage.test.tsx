import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import SignUpPage from "./SignUpPage";
import * as api from "../api/api";

vi.mock("../api/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/api")>();
  return { ...actual, register: vi.fn() };
});

const registerMock = api.register as ReturnType<typeof vi.fn>;

function renderRoutes(initialRoute = "/signup") {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<h1>Login Page</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

function setup(initialRoute = "/signup") {
  const user = userEvent.setup();
  renderRoutes(initialRoute);
  return { user };
}

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const validForm: FormValues = {
  name: "TestUser0",
  email: "TESTUSER0@TEST.COM",
  password: "password123",
  confirmPassword: "password123",
};

async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  overrides: Partial<FormValues> = {},
) {
  const values = { ...validForm, ...overrides };

  const nameInput = screen.getByLabelText(/full name/i);
  const emailInput = screen.getByLabelText(/^email$/i);
  const passwordInput = screen.getByLabelText(/^password$/i);
  const confirmInput = screen.getByLabelText(/confirm password/i);

  await user.clear(nameInput);
  await user.type(nameInput, values.name);

  await user.clear(emailInput);
  await user.type(emailInput, values.email);

  await user.clear(passwordInput);
  await user.type(passwordInput, values.password);

  await user.clear(confirmInput);
  await user.type(confirmInput, values.confirmPassword);
}

async function submit(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /create account/i }));
}

function mockRegisterSuccess() {
  registerMock.mockResolvedValueOnce({
    id: "u1",
    name: "TestUser0",
    email: "testuser0@test.com",
    createdAt: "2026-05-18T10:00:00.000Z",
    updatedAt: "2026-05-18T10:00:00.000Z",
  });
}

function mockDuplicateEmailError() {
  const dupErr = new api.ApiError("Request failed (409)", 409, {
    message: "Email already in use",
  });
  registerMock.mockRejectedValueOnce(dupErr);
}

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    registerMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays name, email, password and confirm password fields", () => {
    setup();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("validates email must contain @ and does not call register", async () => {
    const { user } = setup();

    await fillForm(user, { email: "invalid-email" });
    await submit(user);

    expect(await screen.findByText("Email must contain @")).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("enforces password minimum length (6) and does not call register", async () => {
    const { user } = setup();

    await fillForm(user, { password: "12345", confirmPassword: "12345" });
    await submit(user);

    expect(
      await screen.findByText("Password must be at least 6 characters"),
    ).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("shows duplicate email error on email field when ApiError matches", async () => {
    const { user } = setup();
    mockDuplicateEmailError();

    await fillForm(user);
    await submit(user);

    expect(
      await screen.findByText(/email already in use/i),
    ).toBeInTheDocument();
  });

  it("normalizes email to lowercase before API call", async () => {
    const { user } = setup();
    mockRegisterSuccess();

    await fillForm(user, { email: "UPPER@CASE.COM" });
    await submit(user);

    expect(api.register).toHaveBeenCalledWith(
      expect.objectContaining({ email: "upper@case.com" }),
    );
  });

  it("shows error when passwords do not match", async () => {
    const { user } = setup();

    await fillForm(user, {
      password: "password123",
      confirmPassword: "different123",
    });
    await submit(user);

    expect(
      await screen.findByText(/passwords do not match/i),
    ).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("redirects to /login after successful registration", async () => {
    const { user } = setup();
    mockRegisterSuccess();

    const realSetTimeout: typeof setTimeout = globalThis.setTimeout;

    let redirectCb: (() => void) | null = null;

    const timeoutSpy = vi.spyOn(globalThis, "setTimeout").mockImplementation(((
      cb: TimerHandler,
      ms?: number,
    ) => {
      if (ms === 700 && typeof cb === "function") {
        redirectCb = cb as () => void;
        return 0 as unknown as ReturnType<typeof setTimeout>;
      }

      return realSetTimeout(cb, ms);
    }) as typeof setTimeout);

    await fillForm(user);
    await submit(user);

    expect(
      await screen.findByText(
        "Account created successfully! Redirecting to login...",
      ),
    ).toBeInTheDocument();

    expect(redirectCb).not.toBeNull();
    await act(async () => {
      redirectCb?.();
    });

    expect(await screen.findByText(/login page/i)).toBeInTheDocument();

    timeoutSpy.mockRestore();
  });
});
