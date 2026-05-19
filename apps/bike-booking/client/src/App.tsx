import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import BikeList from "./pages/BikeList";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MyBookings from "./components/MyBookings";
import BookingPage from "./pages/BookingPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";

export default function App() {
  return (
    <div className="app">
      <Navigation />

      <main className="app__content">
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
      </main>

      <Footer />
    </div>
  );
}
