import React from "react";

function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-icon">⚠️</div>

      <h2>Something went wrong</h2>

      <p>
        {message || "We couldn't load the tutors. Please try again."}
      </p>

      <button onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}

export default ErrorState;