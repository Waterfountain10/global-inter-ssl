// src/Views/Map3.js
import React, { useState, useEffect, useRef } from "react";
import "./Map3.css";

export default function Map3({
  scrollProgress = 0,
  isActive = false,
  onMount,
}) {
  const containerRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    console.log(
      "🟢 Map3 mounted - scrollProgress:",
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
      console.log("📍 Map3 entered for first time");
    }
  }, [isActive, hasEntered]);

  // Calculate dynamic values based on scroll progress
  const getOverlayOpacity = () => {
    // Fade in overlay as user scrolls into section
    if (scrollProgress < 0.1) return 0;
    if (scrollProgress > 0.9) return 1;
    return (scrollProgress - 0.1) / 0.8; // Smooth fade from 10% to 90%
  };

  const getTextOpacity = () => {
    // Text appears after overlay, disappears before section ends
    if (scrollProgress < 0.2) return 0;
    if (scrollProgress > 0.8) return Math.max(0, (1 - scrollProgress) / 0.2);
    return Math.min(1, (scrollProgress - 0.2) / 0.3);
  };

  const getTextTransform = () => {
    // Subtle movement as user scrolls
    const translateY = (scrollProgress - 0.5) * 20; // Move slightly based on progress
    const scale = 0.95 + scrollProgress * 0.05; // Subtle scale effect
    return `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;
  };

  const getOverlayTransform = () => {
    // Parallax effect for overlay
    const scale = 1 + scrollProgress * 0.02; // Very subtle zoom
    return `scale(${scale})`;
  };

  return (
    <div
      ref={containerRef}
      className={`map3-container scroll-driven${hasEntered ? " has-entered" : ""}${isActive ? " active" : ""}`}
      style={{
        opacity: Math.max(0, Math.min(1, scrollProgress * 2)), // Overall container opacity
      }}
    >
      {/* Map3 specific overlay with scroll-driven opacity and transform */}
      <img
        className="map3-overlay scroll-responsive"
        src="/assets/images/map3_final.svg"
        alt="Map3 overlay"
        style={{
          opacity: getOverlayOpacity(),
          transform: getOverlayTransform(),
          transition: isActive
            ? "none"
            : "opacity 0.3s ease, transform 0.3s ease",
        }}
      />

      {/* Text bubble with scroll-driven animations */}
      <div
        className="map3-text-bubble scroll-responsive"
        style={{
          opacity: getTextOpacity(),
          transform: getTextTransform(),
          transition: isActive
            ? "none"
            : "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <p>
          To study the <span className="highlight">patterns of similarity</span>{" "}
          between kitchens, living rooms, bedrooms, and bathrooms across{" "}
          <span className="highlight">80 global cities</span>.
        </p>
      </div>
    </div>
  );
}
