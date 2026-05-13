import "./TypeButton.css";

const TypeFilter = () => {
  return (
    <div>
      <div className="filter-container">
        <button type="button" className="type-btn">All</button>
        <button type="button" className="type-btn">Mountain</button>
        <button type="button" className="type-btn">Road</button>
        <button type="button" className="type-btn">City</button>
        <button type="button" className="type-btn">Electric</button>
      </div>
    </div>
  );
};

export default TypeFilter;
