// src/Views/Map5.js - Updated for scroll-driven animations
import React, { useState, useEffect, useRef } from "react";
import "./Map5.css";

export default function Map5({
  scrollProgress = 0,
  isActive = false,
  onMount,
}) {
  const containerRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    console.log(
      "🟢 Map5 mounted - scrollProgress:",
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
      console.log("📍 Map5 entered for first time");
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
      className={`map5-container scroll-driven${hasEntered ? " has-entered" : ""}${isActive ? " active" : ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "auto",
        opacity: Math.max(0, Math.min(1, scrollProgress * 2)),
      }}
    >
      {/* Map5 specific overlay */}
      <img
        className="map5-overlay scroll-responsive"
        src="/assets/images/map5_final.svg"
        alt="Map5 overlay"
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
        className="map5-text-bubble scroll-responsive"
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
          Revealing that certain{" "}
          <span style={{ color: "#FF395C", fontWeight: "bold" }}>objects</span>{" "}
          — either through their presence or unique appearance — serve as{" "}
          <span style={{ color: "#FF395C", fontWeight: "bold" }}>
            markers of visual identity
          </span>
          .
        </p>
      </div>
    </div>
  );
}
