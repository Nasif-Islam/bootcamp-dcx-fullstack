import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
// import Navigation from "../components/Navigation";
// import MyBookings from "../pages/MyBookings";
import BrowseBikes from "./pages/BrowseBikes";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import BikeBooking from "./components/BikeBooking";

function App() {
  <>
    <Navigation />

    <Routes>
      <Route path="/" element={<Navigate to="/bikes" replace} />
      <Route path="/bikes" element={<BrowseBikes />} />
      // <Route path="/my-bookings" element={<MyBookings />} />    </Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />


      <Route path="*" element={<div>Page not found</div>} />

    </Routes>
  </>;
}

export default App;

// import { getBike } from "./api/bikes";
// import type { Bike } from "./api/types";

// function App() {
//   const [bike, setBike] = useState<Bike | null>(null);

//   useEffect(() => {
//     async function loadBike() {
//       try {
//         const data = await getBike("69fde64c068710ca628e05dc");
//         // console.log("Bike data:", data);
//         setBike(data);
//       } catch (err) {
//         console.error("Failed to fetch bike:", err);
//       }
//     }

//     loadBike();
//   }, []);

//   if (!bike) {
//     return <div>Loading...</div>;
//   }

//   function placeHolder() {
//     return;
//   }

//   return (
//     <>
//       <BikeBooking
//         bike={bike}
//         userId="69fde64c068710ca628e05da"
//         onSuccess={placeHolder}
//         onBack={placeHolder}
//       />
//     </>
//   );
// }

// export default App;
