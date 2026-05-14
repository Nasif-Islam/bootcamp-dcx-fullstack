import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";

import BikeList from "./pages/BikeList";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MyBookings from "./components/MyBookings";

import BookingPage from "./pages/BookingPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";

function App() {
  return (
    <>
      <Navigation />

      <Routes>
        <Route path="/" element={<Navigate to="/bikes" replace />} />
        <Route path="/bikes" element={<BikeList />} />

        <Route path="/booking/:bikeId" element={<BookingPage />} />
        <Route
          path="/booking-confirmation"
          element={<BookingConfirmationPage />}
        />

        <Route path="/my-bookings" element={<MyBookings />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </>
  );
}

export default App;

// TODO - place in relevant files - state should not be handled in app.tsx

// const navigate = useNavigate();

// // STATE
// const [previousBooking, setPreviousBooking] = useState<Booking | null>(null);
// const [bike, setBike] = useState<Bike | null>(null);
// const [bikeLoading, setBikeLoading] = useState(true);
// const [bikeError, setBikeError] = useState<string | null>(null);

// // LOAD BIKE

// useEffect(() => {
//   async function loadBike() {
//     try {
//       setBikeLoading(true);
//       setBikeError(null);

//       const data = await getBike("69fde64c068710ca628e05dc");
//       setBike(data);
//     } catch (err) {
//       console.error("Failed to fetch bike:", err);
//       setBikeError("Failed to load bike. Please try again.");
//     } finally {
//       setBikeLoading(false);
//     }
//   }

//   loadBike();
// }, []);

// // HANDLE BOOKING

// function bookingHandler(booking: Booking) {
//   setPreviousBooking(booking);
//   navigate("/booking-confirmation");
// }

// const bookingElement = bikeLoading ? (
//   <div>Loading booking...</div>
// ) : bikeError ? (
//   <div>{bikeError}</div>
// ) : bike ? (
//   <BikeBooking
//     bike={bike}
//     userId="69fde64c068710ca628e05da"
//     bookingHandler={bookingHandler}
//   />
// ) : (
//   <div>No bike found.</div>
// );

// return (
//     <Routes>
//       {/* Default redirect */}
//       <Route path="/" element={<Navigate to="/bikes" replace />} />

//       {/* Browse/list page (your teammate's work likely targets this) */}
//       <Route path="/bikes" element={<BikeList />} />

//       {/* Booking page */}
//       <Route path="/booking" element={bookingElement} />

//       {/* Booking confirmation */}
//       <Route
//         path="/booking-confirmation"
//         element={
//           previousBooking ? (
//             <BookingConfirmation booking={previousBooking} />
//           ) : (
//             <div>No booking found. Please complete a booking first.</div>
//           )
//         }
//       />

//       {/* Not found */}
//       <Route path="*" element={<div>Page not found</div>} />
//     </Routes>
//   );
// }

// // import { getBike } from "./api/bikes";
// // import type { Bike } from "./api/types";

// // function App() {
// //   const [bike, setBike] = useState<Bike | null>(null);

// //   useEffect(() => {
// //     async function loadBike() {
// //       try {
// //         const data = await getBike("69fde64c068710ca628e05dc");
// //         // console.log("Bike data:", data);
// //         setBike(data);
// //       } catch (err) {
// //         console.error("Failed to fetch bike:", err);
// //       }
// //     }

// //     loadBike();
// //   }, []);

// //   if (!bike) {
// //     return <div>Loading...</div>;
// //   }

// //   function placeHolder() {
// //     return;
// //   }

// //   return (
// //     <>
// //       <BikeBooking
// //         bike={bike}
// //         userId="69fde64c068710ca628e05da"
// //         onSuccess={placeHolder}
// //         onBack={placeHolder}
// //       />
// //     </>
// //   );
// // }
