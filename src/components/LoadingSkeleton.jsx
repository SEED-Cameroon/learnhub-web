import React from "react";

function LoadingSkeleton() {
  return (
    <div className="tutor-grid">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div className="tutor-skeleton" key={item}>
          <div className="skeleton-avatar"></div>

          <div className="skeleton-line skeleton-name"></div>

          <div className="skeleton-line"></div>

          <div className="skeleton-line small"></div>

          <div className="skeleton-button"></div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;