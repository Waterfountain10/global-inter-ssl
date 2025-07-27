// src/Views/Map3/Map3.js
import React, { useEffect, useRef, useState } from "react";
import "./Map3.css";

export default function Map3({ advancing, onMount }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (onMount) onMount();
    setVisible(true);
  }, [onMount]);

  return (
    <div
      ref={containerRef}
      className={`map3-container${visible ? " visible" : ""}${
        advancing ? " advancing" : ""
      }`}
    >
      <img
        className="map3-overlay"
        src="/assets/images/map3_final.svg"
        alt="Map3 overlay"
      />
      <div className="map3-text-bubble">
        <p>
          We studied <span className="highlight">patterns of similarity</span>{" "}
          in kitchens, bedrooms, and living rooms across global cities.
        </p>
      </div>
    </div>
  );
}
