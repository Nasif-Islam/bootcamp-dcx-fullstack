import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("api/client request()", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("uses default base URL when VITE_API_BASE_URL is not set", async () => {
    vi.resetModules();
    import.meta.env.VITE_API_BASE_URL = "";

    const { request } = await import("./client");

    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }, 200));

    await request("/bikes");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5001/api/bikes",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("uses VITE_API_BASE_URL when provided", async () => {
    vi.resetModules();
    import.meta.env.VITE_API_BASE_URL = "http://example.com/api";

    const { request } = await import("./client");

    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }, 200));

    await request("/bikes");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://example.com/api/bikes",
      expect.any(Object),
    );
  });

  it("adds Authorization header when token exists", async () => {
    vi.resetModules();
    import.meta.env.VITE_API_BASE_URL = "http://localhost:5001/api";

    const { request } = await import("./client");

    localStorage.setItem("token", "abc123");
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }, 200));

    await request("/users/me");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer abc123",
        }),
      }),
    );
  });

  it("throws ApiError with status and message from JSON body on non-OK response", async () => {
    vi.resetModules();
    import.meta.env.VITE_API_BASE_URL = "http://localhost:5001/api";

    const { request, ApiError } = await import("./client");

    fetchMock.mockResolvedValueOnce(
      jsonResponse({ message: "Invalid credentials" }, 400),
    );

    let err: unknown;
    try {
      await request("/users/login", { method: "POST", body: "{}" });
    } catch (e) {
      err = e;
    }

    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 400 });
    expect((err as Error).message).toContain("Invalid credentials");
  });

  it("throws friendly ApiError on fetch network failure", async () => {
    vi.resetModules();
    import.meta.env.VITE_API_BASE_URL = "http://localhost:5001/api";

    const { request } = await import("./client");

    fetchMock.mockRejectedValueOnce(new Error("ECONNREFUSED"));

    await expect(request("/bikes")).rejects.toThrow(
      "Network error. Check your connection or that the API is running",
    );
  });

  it("throws timeout ApiError when fetch aborts (AbortError)", async () => {
    vi.resetModules();
    import.meta.env.VITE_API_BASE_URL = "http://localhost:5001/api";

    const { request } = await import("./client");

    const abortErr = new DOMException("Aborted", "AbortError");
    fetchMock.mockRejectedValueOnce(abortErr);

    await expect(request("/bikes", { timeoutMs: 1 })).rejects.toThrow(
      "Request timed out. Please try again.",
    );
  });
});
