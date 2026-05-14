import { useEffect, useState } from "react";
import "./App.css";
import BikeBooking from "./components/BikeBooking";
import { getBike } from "./api/bikes";
import type { Bike } from "./api/types";

function App() {
  const [bike, setBike] = useState<Bike | null>(null);

  useEffect(() => {
    async function loadBike() {
      try {
        const data = await getBike("69fde64c068710ca628e05dc");
        // console.log("Bike data:", data);
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

  function placeHolder() {
    return;
  }

  return (
    <>
      <BikeBooking
        bike={bike}
        userId="69fde64c068710ca628e05da"
        onSuccess={placeHolder}
        onBack={placeHolder}
      />
    </>
  );
}

export default App;
