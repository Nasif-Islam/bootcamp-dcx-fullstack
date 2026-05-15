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
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const { timeoutMs = 12_000, headers, ...rest } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Attach Authorization header if token is present
    const token = localStorage.getItem("token");
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    const mergedHeaders = {
      "Content-Type": "application/json",
      ...(headers ?? {}),
      ...(authHeaders as Record<string, string>),
    };
    const res = await fetch(url, {
      ...rest,
      headers: mergedHeaders,
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
