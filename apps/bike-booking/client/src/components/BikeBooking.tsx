import "./BikeBook.css";

const today = new Date();
console.log(today);

function BikeBooking() {
  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Bike Name</h2>
        <button className="back-button">← Back to bikes</button>
      </div>

      <div className="form-content">
        <div className="bike-info">
          <img
            className="bike-image"
            src="https://keyassets.timeincuk.net/inspirewp/live/wp-content/uploads/sites/11/2023/08/Canyon-Torque-Mullet-AL-6-Aug292.jpg"
          ></img>
          <p className="bike-type">Bike Type</p>
          <p className="">Description</p>
          <p className="price-info">Bike Price</p>
        </div>
        <div className="form">
          <div className="form-row">
            <div className="form-item">
              <label>Start Date</label>
              <input
                type="date"
                id="start-date"
                name="start-date"
                value="2018-07-22"
                min="2018-01-01"
                max="2018-12-31"
              />
            </div>

            <div className="form-item">
              <label>Start Time</label>
              <input type="time" id="start-time" name="start-time" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-item">
              <label>End Date</label>
              <input
                type="date"
                id="end-date"
                name="end-date"
                value="2018-07-22"
                min="2018-01-01"
                max="2018-12-31"
              />
            </div>

            <div className="form-item">
              <label>End Time</label>
              <input type="time" id="end-time" name="end-time" required />
            </div>
          </div>
          <div className="form-row">
            <button className="check-button">Check Availability</button>
            <button className="submit-button">Confirm Booking</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BikeBooking;
