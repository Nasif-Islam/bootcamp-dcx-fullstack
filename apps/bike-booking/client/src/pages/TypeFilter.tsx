import "./TypeButton.css";

const TypeFilter = () => {
  return (
    <div>
      <div className="filter-container">
        <button type="button" className="type-btn" aria-pressed="false">All</button>
        <button type="button" className="type-btn" aria-pressed="false">Mountain</button>
        <button type="button" className="type-btn" aria-pressed="false">Road</button>
        <button type="button" className="type-btn" aria-pressed="false">City</button>
        <button type="button" className="type-btn" aria-pressed="false">Electric</button>
      </div>
    </div>
  );
};

export default TypeFilter;
