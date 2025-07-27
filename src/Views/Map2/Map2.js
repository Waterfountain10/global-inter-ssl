// src/Views/Map2/Map2.js
import React, { useEffect, useRef, useState } from "react";
import "./Map2.css";

export default function Map2({ advancing, onMount }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (onMount) onMount();
    setVisible(true); // fade in when mounted
  }, [onMount]);

  useEffect(() => {
    console.log("🔄 Map2 advancing state changed:", advancing);
  }, [advancing]);

  return (
    <div
      ref={containerRef}
      className={`map2-container${visible ? " visible" : ""}${
        advancing ? " advancing" : ""
      }`}
    >
      <img
        className="map2-overlay"
        src="/assets/images/map2_final.svg"
        alt="Map2 overlay"
      />

      <div className="map2-text-bubble">
        <p>
          We compared <span className="highlight">400,000+ Airbnb images</span>{" "}
          across 80 cities to uncover global patterns in interior design.
        </p>
      </div>
    </div>
  );
}
