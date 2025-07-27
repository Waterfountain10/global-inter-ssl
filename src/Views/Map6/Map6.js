// src/Views/Map6/Map6.js
import React, { useEffect, useRef, useState } from "react";
import "./Map6.css";

export default function Map6({ advancing, onMount }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (onMount) onMount();
    setVisible(true);
  }, [onMount]);

  return (
    <div
      ref={containerRef}
      className={`map6-container${visible ? " visible" : ""}${
        advancing ? " advancing" : ""
      }`}
    >
      <img
        className="map6-overlay"
        src="/assets/images/map6_final.svg"
        alt="Map6 overlay"
      />
      <div className="map6-text-bubble">
        <p>
          Our findings show that despite global pressures and trends towards
          cultural homogenization,{" "}
          <span className="highlight">
            local cultural identities nevertheless remain
          </span>
          .
        </p>
      </div>
    </div>
  );
}
