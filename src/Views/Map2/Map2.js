// src/Views/Map2.js
import React, { useState, useEffect, useRef } from "react";
import "./Map2.css";

export default function Map2({
  scrollProgress = 0,
  isActive = false,
  onMount,
}) {
  const containerRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    console.log(
      "🟢 Map2 mounted - scrollProgress:",
      scrollProgress,
      "isActive:",
      isActive,
    );
    if (onMount) onMount();
  }, [onMount]);

  // Track when the section first becomes active
  useEffect(() => {
    if (isActive && !hasEntered) {
      setHasEntered(true);
      console.log("📍 Map2 entered for first time");
    }
  }, [isActive, hasEntered]);

  // Calculate dynamic values based on scroll progress
  const getOverlayOpacity = () => {
    if (scrollProgress < 0.1) return 0;
    if (scrollProgress > 0.9) return 1;
    return (scrollProgress - 0.1) / 0.8;
  };

  const getTextOpacity = () => {
    if (scrollProgress < 0.2) return 0;
    if (scrollProgress > 0.8) return Math.max(0, (1 - scrollProgress) / 0.2);
    return Math.min(1, (scrollProgress - 0.2) / 0.3);
  };

  const getTextTransform = () => {
    const translateY = (scrollProgress - 0.5) * 20;
    const scale = 0.95 + scrollProgress * 0.05;
    return `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;
  };

  const getOverlayTransform = () => {
    const scale = 1 + scrollProgress * 0.02;
    return `scale(${scale})`;
  };

  return (
    <div
      ref={containerRef}
      className={`map2-container scroll-driven${hasEntered ? " has-entered" : ""}${isActive ? " active" : ""}`}
      style={{
        opacity: Math.max(0, Math.min(1, scrollProgress * 2)),
      }}
    >
      {/* Map2 specific overlay */}
      <img
        className="map2-overlay scroll-responsive"
        src="/assets/images/map2_final.svg"
        alt="Map2 overlay"
        style={{
          opacity: getOverlayOpacity(),
          transform: getOverlayTransform(),
          transition: isActive
            ? "none"
            : "opacity 0.3s ease, transform 0.3s ease",
        }}
      />

      {/* Text bubble */}
      <div
        className="map2-text-bubble scroll-responsive"
        style={{
          opacity: getTextOpacity(),
          transform: getTextTransform(),
          transition: isActive
            ? "none"
            : "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <p>
          To answer this, we used a{" "}
          <span className="highlight">visual AI model</span> to analyze a unique
          dataset of over <span className="highlight">400k indoor images</span>.
        </p>
      </div>
    </div>
  );
}
