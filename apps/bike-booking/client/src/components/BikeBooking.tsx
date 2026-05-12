import { useState } from "react";
import "./BikeBook.css";
import { getBikeAvailability } from "../api/bikes";
import { createBooking } from "../api/bookings";
import type { Booking, Bike } from "../api/types";

interface BookingFormProps {
  bike: Bike;
  userId: string;
}

function BikeBooking({ bike, userId }: BookingFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState("");

  const [isAvailable, setIsAvailable] = useState("");
  const [error, setError] = useState("");

  async function checkAvailability() {
    if (!startDate || !startTime || !endDate || !endTime) {
      return "Please fill in all date/time fields";
    }

    const startDateTime = `${startDate}T${startTime}:00`;
    const endDateTime = `${endDate}T${endTime}:00`;

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      return "End datetime must be after start datetime";
    }

    if (new Date() > new Date(startDateTime)) {
      return "Cannot book in the past";
    }

    const available = getBikeAvailability(u);
  }

  async function submit() {
    return;
  }

  function getEstimatedPrice(): number | null {
    const pricePerHour: number = 15;
    if (!startDate || !startTime || !endDate || !endTime) return null;
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (hours < 0) return null;
    // Place holder price
    return Math.round(hours * pricePerHour);
  }

  const estimatedPrice = getEstimatedPrice();
  console.log("Today's DateTime: " + new Date());
  console.log("Start DateTime: " + new Date(`${startDate}T${startTime}:00`));

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{bike.name}</h2>
        <button className="back-button">← Back to bikes</button>
      </div>

      <div className="form-content">
        <div className="bike-info">
          <img
            className="bike-image"
            src="https://keyassets.timeincuk.net/inspirewp/live/wp-content/uploads/sites/11/2023/08/Canyon-Torque-Mullet-AL-6-Aug292.jpg"
          ></img>
          <span className="bike-type">{bike.type}</span>
          <p className="">{bike.description}</p>
          <p className="price-info">£{bike.pricePerHour}/Hour</p>
        </div>
        <div className="form">
          <div className="form-row">
            <div className="form-item">
              <label>Start Date</label>
              <input
                type="date"
                id="start-date"
                name="start-date"
                value={startDate}
                min={today}
                onChange={(event) => {
                  setStartDate(event.target.value);
                }}
              />
            </div>

            <div className="form-item">
              <label>Start Time</label>
              <input
                type="time"
                id="start-time"
                name="start-time"
                onChange={(event) => {
                  setStartTime(event.target.value);
                }}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-item">
              <label>End Date</label>
              <input
                type="date"
                id="end-date"
                name="end-date"
                value={endDate}
                min={today}
                onChange={(event) => {
                  setEndDate(event.target.value);
                }}
              />
            </div>

            <div className="form-item">
              <label>End Time</label>
              <input
                type="time"
                id="end-time"
                name="end-time"
                onChange={(event) => {
                  setEndTime(event.target.value);
                }}
                required
              />
            </div>
          </div>

          {estimatedPrice !== null && (
            <div className="price-estimate">
              <span>Estimated Total:</span>
              <span className="price">£{estimatedPrice}</span>
            </div>
          )}

          {error && <div className="form-error">{error}</div>}

          <div className="form-buttons">
            <button
              className="check-button"
              onClick={checkAvailability}
              disabled={!startDate || !startTime || !endDate || !endTime}
            >
              Check Availability
            </button>
            <button className="submit-button" disabled={true}>
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BikeBooking;
