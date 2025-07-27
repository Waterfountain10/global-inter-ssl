// src/Views/Map1.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Map1.css";

export default function Map1({ progress }) {
  return (
    <div
      className="map1-container"
      style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * 50}px) scale(${1 + progress * 0.05})`,
      }}
    >
      <img
        className="map1-overlay"
        src="/assets/images/map1_final.svg"
        alt="Map1 overlay"
      />
      <div
        className="map1-text-bubble"
        style={{
          opacity: progress,
          transform: `translate(-50%, calc(-50% - ${progress * 200}px))`,
        }}
      >
        <p>
          The question of whether and how global pressures reduce or eliminate{" "}
          <span className="highlight">local cultural distinctiveness</span> has
          been the subject of considerable research.
        </p>
      </div>
    </div>
  );
}
