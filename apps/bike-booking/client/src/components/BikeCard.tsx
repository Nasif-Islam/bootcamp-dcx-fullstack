import "./BikeCard.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";

interface BikeCardProps {
  bikeId: string;
  bikeImg: string;
  bikeName: string;
  typeIcon: string;
  typeName: string;
  bikeDesc: string;
  bikePrice: number;
  availabilityIcon: string;
  isAvailable: boolean;
}

const BikeCard = ({
  bikeId,
  bikeImg,
  bikeName,
  typeIcon,
  typeName,
  bikeDesc,
  bikePrice,
  availabilityIcon,
  isAvailable,
}: BikeCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  const isBooked = !isAvailable;
  const badgeText = isAvailable ? "Available" : "Booked";
  const buttonText = isAvailable ? "Book Now" : "Unavailable";
  const badgeClass = isAvailable
    ? "bikeCard__availability--available"
    : "bikeCard__availability--booked";

  const handleBookClick = () => {
    if (isBooked) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/booking/${bikeId}` } });
      return;
    }

    navigate(`/booking/${bikeId}`);
  };

  return (
    <article className="bikeCard">
      <div
        className={`bikeCard__imageWrap ${isBooked ? "bikeCard__imageWrap--booked" : ""}`}
      >
        <img className="bikeCard__image" src={bikeImg} alt={bikeName} />

        {isBooked && (
          <div className="bikeCard__imageOverlay">
            <span className="bikeCard__imageOverlayText">Currently Booked</span>
          </div>
        )}
      </div>

      <div className="bikeCard__content">
        <h3 className="bikeCard__title">{bikeName}</h3>

        <div className="bikeCard__typePill">
          <span className="bikeCard__typeIcon">{typeIcon}</span>
          <span className="bikeCard__typeText">{typeName}</span>
        </div>

        <p className="bikeCard__desc">{bikeDesc}</p>

        <div className="bikeCard__metaRow">
          <span className="bikeCard__price">£{bikePrice}/hour</span>

          <span className={`bikeCard__availability ${badgeClass}`}>
            <img
              src={availabilityIcon}
              alt=""
              className="bikeCard__availabilityIcon"
            />
            <span className="bikeCard__availabilityText">{badgeText}</span>
          </span>
        </div>

        <button
          type="button"
          className="bikeCard__bookBtn"
          disabled={isBooked}
          onClick={handleBookClick}
        >
          {buttonText}
        </button>
      </div>
    </article>
  );
};

export default BikeCard;
