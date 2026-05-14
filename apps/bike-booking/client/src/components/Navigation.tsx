import "./Navigation.css";

export function Navigation() {
  const loggedIn: boolean = true;
  const user = {
    fname: "Byron",
    lname: "Biggs",
  };
  function placeHolder() {
    return;
  }

  // Need some kind of placeholder for page checking for the active class

  return (
    <div className="navbar">
      <h1>Bike Booking</h1>
      <div className="right-container">
        <button>Browse Bikes</button>
        {loggedIn ? <button>My Bookings</button> : null}
        <span>{loggedIn ? `Hello, ${user.fname}` : "Hello, Guest"}</span>
        {loggedIn ? (
          <button onClick={placeHolder}>Logout</button>
        ) : (
          <button onClick={placeHolder}>Login</button>
        )}
      </div>
    </div>
  );
}

export default Navigation;
