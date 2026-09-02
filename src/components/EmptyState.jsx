import React from "react";

function EmptyState({ onClear }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">🔍</div>

      <h2>No tutors found</h2>

      <p>
        We couldn't find any tutors matching your search or filter.
      </p>

      <button onClick={onClear}>
        Clear Filters
      </button>
    </div>
  );
}

export default EmptyState;