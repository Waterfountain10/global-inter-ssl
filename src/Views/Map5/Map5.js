// src/Views/Map5/Map5.js
import React, { useEffect, useRef, useState } from "react";
import "./Map5.css";

export default function Map5({ advancing, onMount }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (onMount) onMount();
    setVisible(true);
  }, [onMount]);

  return (
    <div
      ref={containerRef}
      className={`map5-container${visible ? " visible" : ""}${
        advancing ? " advancing" : ""
      }`}
    >
      <img
        className="map5-overlay"
        src="/assets/images/map5_final.svg"
        alt="Map5 overlay"
      />
      <div className="map5-text-bubble">
        <p>
          Revealing that certain <span className="highlight">objects</span> —
          either through their presence or unique appearance — serve as{" "}
          <span className="highlight">markers of visual identity</span>.
        </p>
      </div>
    </div>
  );
}
