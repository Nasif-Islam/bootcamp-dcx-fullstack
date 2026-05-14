import BikeCard from "./BikeCard";
import "./BikeCard.css";
import TypeFilter from "./TypeFilter";
import { getBikes } from "../api/bikes";
import type { BikeListItem } from "../api/types";
import { useState, useEffect } from "react";

const BikeList = () => {
  // Helper function to get the appropriate icon for each bike type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mountain":
        return "⛰️";
      case "road":
        return "🏎️";
      case "city":
        return "🏙️";
      case "electric":
        return "⚡";
      default:
        return "🚲";
    }
  };

  const [bikes, setBikes] = useState<BikeListItem[]>([]); // State to hold the list of bikes
  const [selectedType, setSelectedType] = useState<string | null>(null); // State to hold the currently selected bike type for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bikes from the API when the component mounts
  useEffect(() => {
    getBikes()
      .then(setBikes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filter bikes based on the selected type. If no type is selected, show all bikes
  const filteredBikes = selectedType
    ? bikes.filter((bike) => bike.type === selectedType)
    : bikes;

  if (loading) return <p>Loading bikes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="bike-list-container">
        <h2 className="title">Available Bikes</h2>
        <TypeFilter
          selectedType={selectedType}
          onSelectType={setSelectedType}
        />
        <div className="bike-cards-grid">
          {filteredBikes.map((bike) => (
            <BikeCard
              key={bike._id}
              bikeImg={bike.imageUrl}
              bikeName={bike.name}
              typeIcon={getTypeIcon(bike.type)}
              typeName={bike.type.charAt(0).toUpperCase() + bike.type.slice(1)}
              bikeDesc={bike.description}
              bikePrice={bike.pricePerHour}
              availabilityIcon="https://cdn-icons-png.flaticon.com/512/190/190411.png"
              availabilityStatus={
                bike.isAvailable ? "Available" : "Unavailable"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BikeList;
