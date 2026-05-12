export * from "./client";
export * from "./types";
export * from "./bikes";
export * from "./bookings";
export * from "./users";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001/api";

// Error handling
type ApiErrorBody = {
  error?: string;
  message?: string;
};

type RequestOptions = RequestInit & {
  timeoutMs?: number;
};

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// Request helper function
async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const { timeoutMs = 12_000, headers, ...rest } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(headers ?? {}),
      },
      signal: controller.signal,
    });

    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    const body = isJson
      ? await res.json().catch(() => null)
      : await res.text().catch(() => "");

    if (!res.ok) {
      const b = body as ApiErrorBody;
      const message =
        b?.error ||
        b?.message ||
        (typeof body === "string" && body) ||
        `Request failed (${res.status})`;

      throw new ApiError(message, res.status, body);
    }

    return body as T;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Request timed out. Please try again.", 0);
    }

    if (err instanceof ApiError) throw err;

    throw new ApiError(
      "Network error. Check your connection or that the API is running",
      0,
      err,
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

// Type definitions for backend response shapes
export type BikeListItem = {
  _id: string;
  name: string;
  type: string;
  description: string;
  pricePerHour: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  isAvailable: boolean;
};

export type Bike = Omit<BikeListItem, "isAvailable">;

export type Booking = {
  _id: string;
  id: string;
  bikeId: Bike;
  userId: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "cancelled" | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  duration: number;
};

export type CreateBookingInput = {
  bikeId: string;
  userId: string;
  startTime: string;
  endTime: string;
};

export type BookingConflict = {
  _id: string;
  id: string;
  bikeId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "cancelled" | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  duration: number;
};

export type CreateBookingConflictResponse = {
  error: string;
  conflicts: BookingConflict[];
};

export type AvailabilityResponse = {
  available: boolean;
  conflicts: BookingConflict[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

// Api call functions
export function getBikes(): Promise<BikeListItem[]> {
  return request<BikeListItem[]>("/bikes");
}

export function getBike(id: string): Promise<Bike> {
  return request<Bike>(`/bikes/${id}`);
}

export function getBikeAvailability(
  bikeId: string,
  startTime: string,
  endTime: string,
): Promise<AvailabilityResponse> {
  const params = new URLSearchParams({ startTime, endTime });
  return request<AvailabilityResponse>(
    `/bikes/${bikeId}/availability?${params.toString()}`,
  );
}

export function createBooking(input: CreateBookingInput): Promise<Booking> {
  return request<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function cancelBooking(bookingId: string): Promise<Booking> {
  return request<Booking>(`/bookings/${bookingId}`, {
    method: "DELETE",
  });
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const user = await request<User>("/users/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

  localStorage.setItem("bb_user_id", user.id);

  return user;
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<User> {
  const user = await request<User>("/users/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  localStorage.setItem("bb_user_id", user.id);

  return user;
}

export function getUser(id: string): Promise<User> {
  return request<User>(`/users/${id}`);
}
