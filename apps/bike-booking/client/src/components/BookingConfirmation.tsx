import type { Booking } from "../api/types";

interface BookingConfirmationInterface {
  booking: Booking;
}

export function BookingConfirmation({ booking }: BookingConfirmationInterface) {
  const bike = booking.bikeId;

  function totalPrice() {
    const hours = booking.duration / (1000 * 60 * 60);
    return bike.pricePerHour * hours;
  }

  function formatDateTime(time: string) {
    const dateString = new Date(time).toDateString();
    return dateString;
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
            <span>{formatDateTime(booking.startTime)}</span>
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
          <button className="view-button">View My Bookings</button>
          <button className="book-another-button">Book Another Bike</button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
