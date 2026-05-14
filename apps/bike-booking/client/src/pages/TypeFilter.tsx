import "./TypeButton.css";

// const TypeFilter = () => {
//   return (
//     <div>
//       <div className="filter-container">
//         <button type="button" className="type-btn">All</button>
//         <button type="button" className="type-btn">Mountain</button>
//         <button type="button" className="type-btn">Road</button>
//         <button type="button" className="type-btn">City</button>
//         <button type="button" className="type-btn">Electric</button>
//       </div>
//     </div>
//   );
// };

interface TypeFilterProps {
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
}

const types = ["mountain", "road", "city", "electric"];

const TypeFilter = ({ selectedType, onSelectType }: TypeFilterProps) => {
  return (
    <div className="filter-container">
      <button
        className={`type-btn ${selectedType === null ? "active" : ""}`}
        onClick={() => onSelectType(null)}
      >
        All
      </button>
      {types.map((type) => (
        <button
          key={type}
          className={`type-btn ${selectedType === type ? "active" : ""}`}
          onClick={() => onSelectType(type)}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default TypeFilter;
