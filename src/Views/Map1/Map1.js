// src/Views/Map1.js
import React, { useState, useEffect, useRef } from "react";
import "./Map1.css";

export default function Map1({
  scrollProgress = 0,
  isActive = false,
  onMount,
}) {
  const containerRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    console.log(
      "🟢 Map1 mounted - scrollProgress:",
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
      console.log("📍 Map1 entered for first time");
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
      className={`map1-container scroll-driven${hasEntered ? " has-entered" : ""}${isActive ? " active" : ""}`}
      style={{
        opacity: Math.max(0, Math.min(1, scrollProgress * 2)), // Overall container opacity
      }}
    >
      {/* Map1 specific overlay with scroll-driven opacity and transform */}
      <img
        className="map1-overlay scroll-responsive"
        src="/assets/images/map1_final.svg"
        alt="Map1 overlay"
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
        className="map1-text-bubble scroll-responsive"
        style={{
          opacity: getTextOpacity(),
          transform: getTextTransform(),
          transition: isActive
            ? "none"
            : "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <p>
          The question of whether and how global pressures reduce or eliminate{" "}
          <span className="highlight">local cultural distinctiveness</span> has
          been the subject of considerable research.
        </p>
      </div>

      {/* Optional: Scroll hint for first section */}
      {isActive && scrollProgress < 0.1 && (
        <div className="scroll-hint">
          <div className="scroll-hint-text">Scroll to explore</div>
          <div className="scroll-hint-arrow">↓</div>
        </div>
      )}
    </div>
  );
}
