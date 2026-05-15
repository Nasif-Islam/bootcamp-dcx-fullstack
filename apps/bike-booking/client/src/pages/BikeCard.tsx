import "./BikeCard.css";
import { useNavigate } from "react-router-dom";

interface BikeCardProps {
  bikeId: string;
  bikeImg: string;
  bikeName: string;
  typeIcon: string;
  typeName: string;
  bikeDesc: string;
  bikePrice: number;
  availabilityIcon: string;
  availabilityStatus: string;
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
  availabilityStatus,
  isAvailable,
}: BikeCardProps) => {
  const navigate = useNavigate();

  return (
    <article className="bikeCard">
      <div className="bikeCard__imageWrap">
        <img className="bikeCard__image" src={bikeImg} alt={bikeName} />
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

          <span className="bikeCard__availability">
            <img
              src={availabilityIcon}
              alt=""
              className="bikeCard__availabilityIcon"
            />
            <span className="bikeCard__availabilityText">
              {availabilityStatus}
            </span>
          </span>
        </div>

        <button
          type="button"
          className="bikeCard__bookBtn"
          disabled={!isAvailable}
          onClick={() => isAvailable && navigate(`/booking/${bikeId}`)}
        >
          Book Now
        </button>
      </div>
    </article>
  );
};

export default BikeCard;
