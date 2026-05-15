import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelBooking, getUserBookings } from "../api/bookings";
import type { Booking } from "../api/types";
import { useUser } from "../context/useUser";
import "./MyBookings.css";

export function MyBookings() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      setBookings([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function loadBookings() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserBookings(user.id);
        if (!cancelled) {
          const sorted = [...data].sort(
            (a, b) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
          );
          setBookings(sorted);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load bookings",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user]);

  const grouped = useMemo(() => {
    const now = Date.now();
    const upcoming: Booking[] = [];
    const past: Booking[] = [];

    for (const booking of bookings) {
      const endTimeMs = new Date(booking.endTime).getTime();
      const isCancelled = booking.status === "cancelled";

      if (!isCancelled && endTimeMs >= now) {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    }

    past.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );

    return { upcoming, past };
  }, [bookings]);

  const onBack = () => navigate("/bikes");

  async function onCancel(bookingId: string) {
    setCancellingId(bookingId);
    setError(null);
    try {
      const updated = await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((booking) => (booking._id === bookingId ? updated : booking)),
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="my-bookings-container">
        <div className="my-bookings-header">
          <h2>My Bookings</h2>
          <button className="back-button" onClick={onBack}>
            ← Back to bikes
          </button>
        </div>

        <div className="empty">
          <p>Please log in to see your bookings.</p>
          <button className="browse-button" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  const hasNoBookings =
    grouped.upcoming.length === 0 && grouped.past.length === 0;

  function formatDateTime(value: string): string {
    return new Date(value).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function renderBookingCard(booking: Booking) {
    const isCancelled = booking.status === "cancelled";
    const isPast =
      isCancelled || new Date(booking.endTime).getTime() < Date.now();

    return (
      <div
        key={booking._id}
        className={`booking-card ${isPast ? "past" : ""} ${isCancelled ? "cancelled" : ""}`.trim()}
      >
        <div className="booking-bike">
          <h4>{booking.bikeId?.name ?? "Bike"}</h4>
          <span className="bike-type">
            {booking.bikeId?.type ?? "Unknown type"}
          </span>
        </div>

        <div className="booking-details">
          <div className="booking-time">
            <span className="label">Start:</span>
            <span>{formatDateTime(booking.startTime)}</span>
          </div>
          <div className="booking-time">
            <span className="label">End:</span>
            <span>{formatDateTime(booking.endTime)}</span>
          </div>
        </div>

        <div className="booking-actions">
          <span
            className={`status-badge ${isCancelled ? "cancelled" : "confirmed"}`}
          >
            {booking.status}
          </span>
          {!isCancelled && !isPast && (
            <button
              className="cancel-button"
              onClick={() => onCancel(booking._id)}
              disabled={cancellingId === booking._id}
            >
              {cancellingId === booking._id ? "Cancelling..." : "Cancel"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-container">
      <div className="my-bookings-header">
        <h2>My Bookings</h2>
        <button className="back-button" onClick={onBack}>
          ← Back to bikes
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {hasNoBookings ? (
        <div className="empty">
          <p>You don't have any bookings yet.</p>
          <button className="browse-button" onClick={onBack}>
            Browse Available Bikes
          </button>
        </div>
      ) : (
        <>
          <section className="booking-section">
            <h3>Upcoming Bookings</h3>
            {grouped.upcoming.length === 0 ? (
              <p>No upcoming bookings.</p>
            ) : (
              <div className="bookings-list">
                {grouped.upcoming.map((booking) => renderBookingCard(booking))}
              </div>
            )}
          </section>

          <section className="booking-section">
            <h3>Past Bookings</h3>
            {grouped.past.length === 0 ? (
              <p>No past bookings.</p>
            ) : (
              <div className="bookings-list">
                {grouped.past.map((booking) => renderBookingCard(booking))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default MyBookings;
