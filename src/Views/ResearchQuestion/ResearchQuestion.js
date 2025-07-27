// src/Views/ResearchQuestion/ResearchQuestion.js
import React from "react";
import "./ResearchQuestion.css";

export default function ResearchQuestion({ progress }) {
  return (
    <div
      className="research-question"
      style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * 50}px)`,
      }}
    >
      <div className="persistent-search-bar">
        <span className="typed-text">
          Does globalization lead to homogeneous interior spaces around the
          world?
        </span>
        <button className="search-button">
          <img
            src="/assets/images/search_button.svg"
            alt="Search"
            className="search-icon"
          />
        </button>
      </div>
    </div>
  );
}
