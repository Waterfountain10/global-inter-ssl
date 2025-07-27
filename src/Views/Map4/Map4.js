// src/Views/Map4/Map4.js
import React, { useEffect, useRef, useState } from "react";
import "./Map4.css";

export default function Map4({ advancing, onMount }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (onMount) onMount();
    setVisible(true);
  }, [onMount]);

  return (
    <div
      ref={containerRef}
      className={`map4-container${visible ? " visible" : ""}${
        advancing ? " advancing" : ""
      }`}
    >
      <img
        className="map4-overlay"
        src="/assets/images/map4_final.svg"
        alt="Map4 overlay"
      />
      <div className="map4-text-bubble">
        <p>
          Using deep learning, we demonstrate that{" "}
          <span className="highlight">geographic proximity</span> and{" "}
          <span className="highlight">degree of globalization</span>{" "}
          significantly correlate with the visual characteristics of indoor
          spaces.
        </p>
      </div>
    </div>
  );
}
