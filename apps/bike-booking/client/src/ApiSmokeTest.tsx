import { useState } from "react";
import {
  ApiError,
  getBikes,
  getBike,
  getBikeAvailability,
  createBooking,
  cancelBooking,
  register,
  login,
  getUser,
  type BikeListItem,
  type Booking,
  type User,
  type CreateBookingConflictResponse,
} from "./api/api";

type LogItem = {
  ts: string;
  level: "info" | "success" | "warn" | "error";
  msg: string;
};

function nowIso() {
  return new Date().toISOString();
}

export default function ApiSmokeTest() {
  const [log, setLog] = useState<LogItem[]>([]);
  const [bikes, setBikes] = useState<BikeListItem[]>([]);
  const [user, setUserState] = useState<User | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  // Inputs you might want to control:
  const [email, setEmail] = useState("test.user@example.com");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("Test User");
  const [selectedBikeId, setSelectedBikeId] = useState<string>("");

  const [startTime, setStartTime] = useState(() => new Date().toISOString());
  const [endTime, setEndTime] = useState(() =>
    new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  );

  function addLog(level: LogItem["level"], msg: string) {
    setLog((prev) => [{ ts: nowIso(), level, msg }, ...prev]);
  }

  function handleErr(action: string, err: unknown) {
    if (err instanceof ApiError) {
      addLog("error", `❌ ${action} → (${err.status}) ${err.message}`);
      return;
    }
    if (err instanceof Error) {
      addLog("error", `❌ ${action} → ${err.message}`);
      return;
    }
    addLog("error", `❌ ${action} → Unknown error`);
  }

  async function runGetBikes() {
    try {
      const data = await getBikes();
      setBikes(data);
      // auto-select first bike for convenience
      if (data.length > 0) setSelectedBikeId(data[0]._id);
      addLog("success", `✅ getBikes → ${data.length} bikes`);
    } catch (err) {
      handleErr("getBikes", err);
    }
  }

  async function runGetBike() {
    try {
      if (!selectedBikeId) {
        addLog("info", "ℹ️ getBike → select a bike (or run getBikes first)");
        return;
      }
      const data = await getBike(selectedBikeId);
      addLog("success", `✅ getBike → ${data.name} (${data.type})`);
    } catch (err) {
      handleErr("getBike", err);
    }
  }

  async function runRegister() {
    try {
      // Avoid duplicate email by adding a random suffix
      const random = Math.floor(Math.random() * 100000);
      const uniqueEmail = email.includes("@")
        ? email.replace("@", `.${random}@`)
        : `test.user.${random}@example.com`;

      const newUser = await register({ name, email: uniqueEmail, password });
      setUserState(newUser);
      addLog("success", `✅ register → ${newUser.email} (id: ${newUser.id})`);
    } catch (err) {
      handleErr("register", err);
    }
  }

  async function runLogin() {
    try {
      const loggedIn = await login({ email, password });
      setUserState(loggedIn);
      addLog("success", `✅ login → ${loggedIn.email} (id: ${loggedIn.id})`);
    } catch (err) {
      handleErr("login", err);
    }
  }

  async function runGetUser() {
    try {
      if (!user) {
        addLog("info", "ℹ️ getUser → login/register first");
        return;
      }
      const data = await getUser(user.id);
      addLog("success", `✅ getUser → ${data.email}`);
    } catch (err) {
      handleErr("getUser", err);
    }
  }

  async function runCreateBooking() {
    try {
      if (!user) {
        addLog("info", "ℹ️ createBooking → login/register first");
        return;
      }
      if (!selectedBikeId) {
        addLog(
          "info",
          "ℹ️ createBooking → select a bike (or run getBikes first)",
        );
        return;
      }

      const data = await createBooking({
        bikeId: selectedBikeId,
        userId: user.id,
        startTime,
        endTime,
      });

      setBooking(data);
      addLog(
        "success",
        `✅ createBooking → booking ${data.id} (status: ${data.status}) for bike ${data.bikeId.name}`,
      );
    } catch (err: unknown) {
      // Special handling for booking conflicts (409)
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as CreateBookingConflictResponse;
        addLog(
          "warn",
          `⚠️ createBooking conflict → ${body.error} (conflicts: ${body.conflicts.length})`,
        );
        // Log first conflict window if present
        if (body.conflicts[0]) {
          addLog(
            "info",
            `ℹ️ conflict window → ${body.conflicts[0].startTime} → ${body.conflicts[0].endTime}`,
          );
        }
        return;
      }
      handleErr("createBooking", err);
    }
  }

  async function runCancelBooking() {
    try {
      if (!booking) {
        addLog("info", "ℹ️ cancelBooking → create a booking first");
        return;
      }
      const data = await cancelBooking(booking.id);
      setBooking(data);
      addLog(
        "success",
        `✅ cancelBooking → ${data.id} (status: ${data.status})`,
      );
    } catch (err) {
      handleErr("cancelBooking", err);
    }
  }

  async function runBikeAvailability() {
    try {
      if (!selectedBikeId) {
        addLog(
          "info",
          "ℹ️ getBikeAvailability → select a bike (or run getBikes first)",
        );
        return;
      }

      const result = await getBikeAvailability(
        selectedBikeId,
        startTime,
        endTime,
      );
      addLog(
        "success",
        `✅ getBikeAvailability → available: ${result.available}, conflicts: ${result.conflicts.length}`,
      );
    } catch (err) {
      handleErr("getBikeAvailability", err);
    }
  }

  function clearLog() {
    setLog([]);
  }

  return (
    <div
      style={{
        padding: 16,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      }}
    >
      <h2 style={{ marginBottom: 8 }}>API Smoke Test</h2>
      <p style={{ marginTop: 0, color: "#555" }}>
        Use these buttons to prove all endpoints are callable from the frontend,
        and errors are handled.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          maxWidth: 900,
        }}
      >
        {/* Left panel: inputs */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Inputs</h3>

          <div style={{ display: "grid", gap: 8 }}>
            <label>
              Email
              <input
                style={{ width: "100%", padding: 8, marginTop: 4 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              Password
              <input
                style={{ width: "100%", padding: 8, marginTop: 4 }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <label>
              Name (for register)
              <input
                style={{ width: "100%", padding: 8, marginTop: 4 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label>
              Selected Bike
              <select
                style={{ width: "100%", padding: 8, marginTop: 4 }}
                value={selectedBikeId}
                onChange={(e) => setSelectedBikeId(e.target.value)}
              >
                <option value="">-- select --</option>
                {bikes.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name} ({b.type}) {b.isAvailable ? "✅" : "❌"}
                  </option>
                ))}
              </select>
            </label>

            <label>
              startTime (ISO)
              <input
                style={{ width: "100%", padding: 8, marginTop: 4 }}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </label>

            <label>
              endTime (ISO)
              <input
                style={{ width: "100%", padding: 8, marginTop: 4 }}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </label>
          </div>

          <div style={{ marginTop: 12, color: "#444", fontSize: 13 }}>
            <div>
              <strong>Current user:</strong>{" "}
              {user ? `${user.email} (id: ${user.id})` : "none"}
            </div>
            <div>
              <strong>Last booking:</strong>{" "}
              {booking ? `${booking.id} (${booking.status})` : "none"}
            </div>
          </div>
        </div>

        {/* Right panel: actions */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Actions</h3>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={runGetBikes}>getBikes</button>
            <button onClick={runGetBike}>getBike</button>
            <button onClick={runRegister}>register</button>
            <button onClick={runLogin}>login</button>
            <button onClick={runGetUser}>getUser</button>
            <button onClick={runCreateBooking}>createBooking</button>
            <button onClick={runCancelBooking}>cancelBooking</button>
            <button onClick={runBikeAvailability}>getBikeAvailability</button>
            <button onClick={clearLog}>clear log</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <h4 style={{ margin: "12px 0 6px" }}>Log</h4>
            <div
              style={{
                background: "#111",
                color: "#eee",
                padding: 12,
                borderRadius: 8,
                minHeight: 260,
                maxHeight: 360,
                overflow: "auto",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: 12,
              }}
            >
              {log.length === 0 ? (
                <div style={{ color: "#888" }}>
                  No logs yet. Click a button.
                </div>
              ) : (
                log.map((l, idx) => (
                  <div key={idx} style={{ marginBottom: 6 }}>
                    <span style={{ color: "#888" }}>{l.ts}</span>{" "}
                    <span>
                      {l.level === "success" && (
                        <span style={{ color: "#0f0" }}>[OK]</span>
                      )}
                      {l.level === "warn" && (
                        <span style={{ color: "#ff0" }}>[WARN]</span>
                      )}
                      {l.level === "error" && (
                        <span style={{ color: "#f55" }}>[ERR]</span>
                      )}
                      {l.level === "info" && (
                        <span style={{ color: "#5af" }}>[INFO]</span>
                      )}
                    </span>{" "}
                    <span>{l.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <p style={{ color: "#666", fontSize: 13, marginTop: 12 }}>
        Tip: If you stop the backend server, you should see your graceful
        network error handling in action.
      </p>
    </div>
  );
}
