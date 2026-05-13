import "./BikeCard.css";

interface BikeCardProps {
  bikeImg: string;
  bikeName: string;
  typeIcon: string;
  typeName: string;
  bikeDesc: string;
  bikePrice: number;
  availabilityIcon: string;
  availabilityStatus: string;
}

const BikeCard = ({
  bikeImg,
  bikeName,
  typeIcon,
  typeName,
  bikeDesc,
  bikePrice,
  availabilityIcon,
  availabilityStatus,
}: BikeCardProps) => {
  return (
    <div>
      <div className="card-container">
        <div className="bike-img">
          <img src={bikeImg} alt="Bike" />
        </div>
        <div className="bike-info">
          <h3 className="bike-name">{bikeName}</h3>
          <div className="type-container">
            <img src={typeIcon} alt="Type" className="type-icon" />
            <p className="type-name">{typeName}</p>
          </div>
          <p className="bike-desc">{bikeDesc}</p>
          <div className="price-availability-badge-container">
            <span className="price-badge">£{bikePrice}/hour</span>
            <div className="availability-badge-container">
                <div className="availability-badge">
                <img
                    src={availabilityIcon}
                    alt="Availability"
                    className="availability-icon"
                />
                <p className="availability-status">{availabilityStatus}</p>
            </div>
            </div>
            
          </div>
          <button className="book-now-btn">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
