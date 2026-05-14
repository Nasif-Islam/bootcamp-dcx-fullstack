import { useEffect, useState } from "react";
import "./App.css";
// import ApiSmokeTest from "./ApiSmokeTest";
import BikeList from "./pages/BikeList";
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
      <h1>Bike Booking App</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      {/* ignore smoke test component - for dev purposes */}
      {/* <ApiSmokeTest>  */}
      <BikeList />
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
