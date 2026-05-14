import { useEffect, useState } from "react";
import "./App.css";
import BikeBooking from "./components/BikeBooking";
import { getBike } from "./api/bikes";
import type { Bike, Booking } from "./api/types";
import { Routes, Route, useNavigate } from "react-router-dom";
import BookingConfirmation from "./components/BookingConfirmation";

function App() {
  const navigate = useNavigate();

  // STATE
  const [previousBooking, setPreviousBooking] = useState<Booking | null>(null);
  const [bike, setBike] = useState<Bike | null>(null);

  // LOAD BIKE
  useEffect(() => {
    async function loadBike() {
      try {
        const data = await getBike("69fde64c068710ca628e05dc");
        setBike(data);
      } catch (err) {
        console.error("Failed to fetch bike:", err);
      }
    }

    loadBike();
  }, []);

  if (!bike) {
    return <div>Loading...</div>;
  }

  // HANDLE BOOKING
  function bookingHandler(booking: Booking) {
    setPreviousBooking(booking);

    // Navigate to confirmation page
    navigate("/BookingConfirmation");
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <BikeBooking
            bike={bike}
            userId="69fde64c068710ca628e05da"
            bookingHandler={bookingHandler}
          />
        }
      />

      <Route
        path="/Booking"
        element={
          <BikeBooking
            bike={bike}
            userId="69fde64c068710ca628e05da"
            bookingHandler={bookingHandler}
          />
        }
      />

      <Route
        path="/BookingConfirmation"
        element={
          previousBooking ? (
            <BookingConfirmation booking={previousBooking} />
          ) : (
            <div>No booking found. Please complete a booking first.</div>
          )
        }
      />

      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

export default App;
