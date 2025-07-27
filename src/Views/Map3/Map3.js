// src/Views/Map3.js - Updated for scroll-driven animations
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
      className={`map3-container scroll-driven${hasEntered ? " has-entered" : ""}${isActive ? " active" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "auto",
        opacity: Math.max(0, Math.min(1, scrollProgress * 2)),
      }}
    >
      {/* Map3 specific overlay */}
      <img
        className="map3-overlay scroll-responsive"
        src="/assets/images/map3_final.svg"
        alt="Map3 overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 2,
          opacity: getOverlayOpacity(),
          transform: getOverlayTransform(),
          transition: isActive
            ? "none"
            : "opacity 0.3s ease, transform 0.3s ease",
        }}
      />

      {/* Text bubble */}
      <div
        className="map3-text-bubble scroll-responsive"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "blur(10px)",
          padding: "36px 48px",
          borderRadius: "40px",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
          maxWidth: "700px",
          textAlign: "center",
          fontSize: "1.6rem",
          fontWeight: "500",
          color: "#333",
          zIndex: 21,
          opacity: getTextOpacity(),
          transform: getTextTransform(),
          transition: isActive
            ? "none"
            : "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <p>
          To study the{" "}
          <span style={{ color: "#FF395C", fontWeight: "bold" }}>
            patterns of similarity
          </span>{" "}
          between kitchens, living rooms, bedrooms, and bathrooms across{" "}
          <span style={{ color: "#FF395C", fontWeight: "bold" }}>
            80 global cities
          </span>
          .
        </p>
      </div>
    </div>
  );
}
