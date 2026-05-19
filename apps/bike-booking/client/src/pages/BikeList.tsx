import BikeCard from "../components/BikeCard";
import TypeFilter from "../components/TypeFilter";
import { getBikes } from "../api/bikes";
import type { BikeListItem } from "../api/types";
import { useState } from "react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useAsync } from "../hooks/useAsync";
import "./BikeList.css";

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

  const [selectedType, setSelectedType] = useState<string | null>(null); // State to hold the currently selected bike type for filtering

  // Use the custom useAsync hook to fetch bikes data from the API
  const { data: bikes, loading, error } = useAsync<BikeListItem[]>(getBikes);

  // Filter bikes based on the selected type. If no type is selected, show all bikes

  const filteredBikes =
    selectedType && bikes
      ? bikes.filter((bike) => bike.type === selectedType)
      : bikes || [];

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
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            : filteredBikes.map((bike) => (
                <BikeCard
                  key={bike._id}
                  bikeId={bike._id}
                  bikeImg={bike.imageUrl}
                  bikeName={bike.name}
                  typeIcon={getTypeIcon(bike.type)}
                  typeName={
                    bike.type.charAt(0).toUpperCase() + bike.type.slice(1)
                  }
                  bikeDesc={bike.description}
                  bikePrice={bike.pricePerHour}
                  availabilityIcon={
                    bike.isAvailable
                      ? "https://cdn-icons-png.flaticon.com/512/190/190411.png"
                      : "https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
                  }
                  isAvailable={bike.isAvailable}
                  availabilityStatus={bike.isAvailable ? "Available" : "Booked"}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default BikeList;
