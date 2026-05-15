import "./LoadingSkeleton.css";

const LoadingSkeleton = () => {
  return (
    <div>
      <div className="skeleton-card">
        <div className="skeleton-bike-img"></div>
        <div className="skeleton-bike-info">
          <div className="skeleton-bike-name"></div>
          <div className="skeleton-type-container"></div>
          <div className="skeleton-bike-desc"></div>
          <div className="skeleton-price-availability-badge-container">
            <div className="skeleton-price"></div>
            <div className="skeleton-availability-badge"></div>
          </div>
          <div className="skeleton-book-now-btn"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
