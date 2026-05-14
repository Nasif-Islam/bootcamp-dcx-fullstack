import { useNavigate } from "react-router-dom";
import type { Booking } from "../api/types";
import "./BookingConfirmation.css";

interface BookingConfirmationInterface {
  booking: Booking;
}

export function BookingConfirmation({ booking }: BookingConfirmationInterface) {
  const bike = booking.bikeId;
  const navigate = useNavigate();

  function totalPrice() {
    const hours = booking.duration / (1000 * 60 * 60);
    return bike.pricePerHour * hours;
  }

  function formatDateTime(time: string) {
    const startDateTime = new Date(time);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    } as const;

    const formattedDate = startDateTime.toLocaleDateString(undefined, options);

    const formattedTime = startDateTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    console.log(`${formattedDate} at ${formattedTime}`);
    return `${formattedDate} at ${formattedTime}`;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="success-icon">✓</div>
        <h2>Booking Confirmed!</h2>
        <p className="message">Your bike has been successfully booked.</p>

        <div className="booking-summary">
          <h3>{bike.name}</h3>

          <div className="row">
            <span className="label">Start:</span>
            <span className="">{formatDateTime(booking.startTime)}</span>
          </div>

          <div className="row">
            <span className="label">End:</span>
            <span>{formatDateTime(booking.endTime)}</span>
          </div>

          {totalPrice() && (
            <div className="row total">
              <span className="label">Total:</span>
              <span>£{totalPrice().toFixed(2)}</span>
            </div>
          )}

          <div className="booking-id">Booking ID: {booking.id}</div>
        </div>

        <div className="actions">
          <button
            className="view-button"
            onClick={() => navigate("/MyBookings")}
          >
            View My Bookings
          </button>
          <button
            className="book-another-button"
            onClick={() => navigate("/Bikes")}
          >
            Book Another Bike
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
