import { describe, it, expect, vi, beforeEach } from "vitest";
import { request } from "./client";
import { register, login, getUser } from "./users";
import type { LoginInput, RegisterInput, LoginResponse, User } from "./types";

vi.mock("./client", () => ({
  request: vi.fn(),
}));

const requestMock = vi.mocked(request);

describe("api/users", () => {
  beforeEach(() => {
    requestMock.mockReset();
    localStorage.clear();
  });

  it("register POSTs /users/register, returns User, and stores bb_user_id", async () => {
    const input: RegisterInput = {
      name: "user0",
      email: "a@b.com",
      password: "password123",
    };

    const mockUser: User = {
      id: "u1",
      name: input.name,
      email: input.email,
      createdAt: "2026-05-18T10:00:00.000Z",
      updatedAt: "2026-05-18T10:00:00.000Z",
    };

    requestMock.mockResolvedValueOnce(mockUser);

    const result = await register(input);

    expect(requestMock).toHaveBeenCalledWith("/users/register", {
      method: "POST",
      body: JSON.stringify(input),
    });

    expect(result).toEqual(mockUser);
    expect(localStorage.getItem("bb_user_id")).toBe("u1");
  });

  it("login POSTs /users/login, returns User, and stores token + bb_user_id", async () => {
    const input: LoginInput = { email: "a@b.com", password: "pass" };

    const mockUser: User = {
      id: "u1",
      name: "User One",
      email: input.email,
      createdAt: "2026-05-18T10:00:00.000Z",
      updatedAt: "2026-05-18T10:00:00.000Z",
    };

    const mockResponse: LoginResponse = {
      user: mockUser,
      token: "t",
    };

    requestMock.mockResolvedValueOnce(mockResponse as unknown as LoginResponse);

    const result = await login(input);

    expect(requestMock).toHaveBeenCalledWith("/users/login", {
      method: "POST",
      body: JSON.stringify(input),
    });

    expect(result).toEqual(mockUser);

    expect(localStorage.getItem("token")).toBe("t");
    expect(localStorage.getItem("bb_user_id")).toBe("u1");
  });

  it("getUser calls /users/:id and returns User", async () => {
    const mockUser: User = {
      id: "u1",
      name: "User One",
      email: "a@b.com",
      createdAt: "2026-05-18T10:00:00.000Z",
      updatedAt: "2026-05-18T10:00:00.000Z",
    };

    requestMock.mockResolvedValueOnce(mockUser);

    const result = await getUser("u1");

    expect(requestMock).toHaveBeenCalledWith("/users/u1");
    expect(result).toEqual(mockUser);
  });

  it("propagates request() errors", async () => {
    requestMock.mockRejectedValueOnce(new Error("Unauthorized"));

    await expect(getUser("u1")).rejects.toThrow("Unauthorized");
  });
});
