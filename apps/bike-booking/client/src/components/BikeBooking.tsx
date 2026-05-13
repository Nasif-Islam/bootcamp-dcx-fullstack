import { useState, type FormEvent } from "react";
import "./BikeBook.css";
import { getBikeAvailability } from "../api/bikes";
import { createBooking } from "../api/bookings";
import type { Booking, Bike } from "../api/types";

interface BookingFormProps {
  bike: Bike;
  userId: string;
  onSuccess: (booking: Booking) => void;
  onBack: () => void;
}

export function BikeBooking({
  bike,
  userId,
  onSuccess,
  onBack,
}: BookingFormProps) {
  // minimal format for todays date
  const today = new Date().toISOString().split("T")[0];

  // variable store for datetimes
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState("");

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

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

    setIsLoading(true);
    setError(null);
    try {
      const available = await getBikeAvailability(
        bike._id,
        startDateTime,
        endDateTime,
      );
      setIsAvailable(available.available);
      if (!available) {
        setError("Bike is not available for selected time slot.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Availability check failed",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    setIsLoading(true);
    setError(null);
    try {
      const booking = await createBooking({
        bikeId: bike._id,
        userId,
        startTime: start,
        endTime: end,
      });
      onSuccess(booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setIsLoading(false);
    }
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
  // console.log("Today's DateTime: " + new Date());
  // console.log("Start DateTime: " + new Date(`${startDate}T${startTime}:00`));

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{bike.name}</h2>
        <button className="back-button" onClick={onBack}>
          ← Back to bikes
        </button>
      </div>

      <div className="form-content">
        <div className="bike-info">
          <img
            className="bike-image"
            src="https://keyassets.timeincuk.net/inspirewp/live/wp-content/uploads/sites/11/2023/08/Canyon-Torque-Mullet-AL-6-Aug292.jpg"
            alt={`${bike.name} image`}
          ></img>
          <span className="bike-type">{bike.type}</span>
          <p className="">{bike.description}</p>
          <p className="price-info">£{bike.pricePerHour}/Hour</p>
        </div>
        <form onSubmit={submit} className="form">
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
                  setIsAvailable(null);
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
                  setIsAvailable(null);
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
                  setIsAvailable(null);
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
                  setIsAvailable(null);
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

          {isAvailable === true && (
            <div className="availability">Bike is available!</div>
          )}

          <div className="form-buttons">
            <button
              type="button"
              className="check-button"
              onClick={checkAvailability}
              disabled={
                isLoading || !startDate || !startTime || !endDate || !endTime
              }
            >
              Check Availability
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading || isAvailable !== true}
            >
              {isLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BikeBooking;
