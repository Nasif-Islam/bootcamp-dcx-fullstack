import { NavLink } from "react-router-dom";
import { useUser } from "../context/useUser";
import "./Navigation.css";

export default function Navigation() {
  const { user, isAuthenticated, logout } = useUser();

  return (
    <header className="nav">
      <div className="nav__brand">
        <span className="nav__icon" aria-hidden="true">
          🚲
        </span>
        <span className="nav__title">Bike Booking</span>
      </div>

      <div className="nav__actions">
        <NavLink
          to="/bikes"
          end
          className={({ isActive }) =>
            `nav__pill ${isActive ? "nav__pill--active" : ""}`
          }
        >
          Browse Bikes
        </NavLink>

        {isAuthenticated && (
          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              `nav__pill ${isActive ? "nav__pill--active" : ""}`
            }
          >
            My Bookings
          </NavLink>
        )}

        {isAuthenticated ? (
          <>
            <span className="nav__hello">Hi, {user!.name}</span>

            <button
              type="button"
              className="nav__pill nav__pill--logout"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `nav__pill nav__pill--login ${isActive ? "nav__pill--active" : ""}`
              }
            >
              Login
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
