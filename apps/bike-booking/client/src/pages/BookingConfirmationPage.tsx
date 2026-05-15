import { useLocation, useNavigate } from "react-router-dom";
import type { Booking } from "../api/types";
import { BookingConfirmation } from "../components/BookingConfirmation";

type BookingConfirmationLocationState = {
  booking?: Booking;
};

export default function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = (location.state as BookingConfirmationLocationState | null)
    ?.booking;

  if (!booking) {
    return (
      <div>
        <h2>No booking confirmation found.</h2>
        <p>Please complete a booking first.</p>
        <button type="button" onClick={() => navigate("/bikes")}>
          Browse Bikes
        </button>
      </div>
    );
  }

  return <BookingConfirmation booking={booking} />;
}
