import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBike } from "../api/bikes";
import type { Bike, Booking } from "../api/types";
import BikeBooking from "../components/BikeBooking";
import { useUser } from "../context/useUser";

export function BookingPage() {
  const { bikeId } = useParams<{ bikeId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();

  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBike() {
      if (!bikeId) {
        setError("Bike ID missing from URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const bikeData = await getBike(bikeId);
        setBike(bikeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bike.");
      } finally {
        setLoading(false);
      }
    }

    void loadBike();
  }, [bikeId]);

  function handleBooking(booking: Booking) {
    navigate("/booking-confirmation", { state: { booking } });
  }

  if (!isAuthenticated || !user) {
    return (
      <div>
        <h2>Please log in to book a bike</h2>
        <button type="button" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return <div>Loading booking...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!bike) {
    return <div>No bike found.</div>;
  }

  return (
    <BikeBooking bike={bike} userId={user.id} bookingHandler={handleBooking} />
  );
}

export default BookingPage;
