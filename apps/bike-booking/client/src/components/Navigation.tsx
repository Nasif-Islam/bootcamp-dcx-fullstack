import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../context/useUser";
import "./Navigation.css";

export default function Navigation() {
  const { user, isAuthenticated, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="nav">
      <div className="nav__brand">
        <span className="nav__icon" aria-hidden="true">
          🚲
        </span>
        <span className="nav__title">Bike Booking</span>
      </div>

      <button
        type="button"
        className={`nav__menu-button ${isMenuOpen ? "nav__menu-button--open" : ""}`}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className="nav__menu-line" aria-hidden="true" />
        <span className="nav__menu-line" aria-hidden="true" />
        <span className="nav__menu-line" aria-hidden="true" />
      </button>

      <div
        id="primary-navigation"
        className={`nav__actions ${isMenuOpen ? "nav__actions--open" : ""}`}
      >
        <NavLink
          to="/bikes"
          end
          className={({ isActive }) =>
            `nav__pill ${isActive ? "nav__pill--active" : ""}`
          }
          onClick={closeMenu}
        >
          Browse Bikes
        </NavLink>

        {isAuthenticated && (
          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              `nav__pill ${isActive ? "nav__pill--active" : ""}`
            }
            onClick={closeMenu}
          >
            My Bookings
          </NavLink>
        )}

        {isAuthenticated ? (
          <>
            <span id="user" className="nav__hello">
              Hi, {user!.name}
            </span>

            <NavLink
              to="/"
              type="button"
              className="nav__pill nav__pill--logout"
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Logout
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `nav__pill nav__pill--login ${isActive ? "nav__pill--active" : ""}`
              }
              onClick={closeMenu}
            >
              Login
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
