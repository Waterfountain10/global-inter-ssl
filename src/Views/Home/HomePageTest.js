// src/Views/HomePage.js - MINIMAL TEST VERSION
import React, { useState, useEffect } from "react";
import "./HomePage.css";

export default function HomePageTest() {
  const [mode, setMode] = useState("LOCKED"); // LOCKED, SCROLLING
  const [debugInfo, setDebugInfo] = useState("Starting...");

  // Force lock on mount
  useEffect(() => {
    console.log("🏁 HomePage mounting - forcing lock");

    // Force to top
    window.scrollTo(0, 0);

    // Lock everything
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.style.position = "fixed";
    document.documentElement.style.top = "0";
    document.documentElement.style.left = "0";
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";

    setDebugInfo("Locked and ready");
    setMode("LOCKED");

    return () => {
      // Cleanup
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.top = "";
      document.documentElement.style.left = "";
      document.documentElement.style.width = "";
      document.documentElement.style.height = "";
    };
  }, []);

  const handleUnlock = () => {
    console.log("🚀 UNLOCK TRIGGERED!");
    setDebugInfo("Unlocking...");

    // Remove locks
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.documentElement.style.position = "";
    document.documentElement.style.top = "";
    document.documentElement.style.left = "";
    document.documentElement.style.width = "";
    document.documentElement.style.height = "";

    setMode("SCROLLING");
    setDebugInfo("Unlocked! Try scrolling now.");

    // Test scroll
    setTimeout(() => {
      window.scrollTo({
        top: 500,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div style={{ minHeight: "300vh", background: "#EEEEEE" }}>
      {/* Debug Panel */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.9)",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          fontSize: "14px",
          zIndex: 10000,
          fontFamily: "monospace",
        }}
      >
        <div>Mode: {mode}</div>
        <div>Debug: {debugInfo}</div>
        <div>Scroll: {window.pageYOffset}px</div>
        <button
          onClick={handleUnlock}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#FF395C",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          UNLOCK SCROLL
        </button>
      </div>

      {/* TopFold Section */}
      {mode === "LOCKED" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background: "linear-gradient(45deg, #333, #666)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            zIndex: 1000,
          }}
        >
          <h1>MINIMAL TEST - TopFold</h1>
          <p>This should be locked initially</p>

          <button
            onClick={handleUnlock}
            style={{
              marginTop: "30px",
              padding: "15px 30px",
              background: "#FF395C",
              color: "white",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ENABLE SCROLLING
          </button>
        </div>
      )}

      {/* Scrollable Content */}
      {mode === "SCROLLING" && (
        <>
          <div
            style={{
              height: "100vh",
              background: "#FF395C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "2rem",
            }}
          >
            SECTION 1 - Research Question
          </div>

          <div
            style={{
              height: "100vh",
              background: "#4CAF50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "2rem",
            }}
          >
            SECTION 2 - Map 1
          </div>

          <div
            style={{
              height: "100vh",
              background: "#2196F3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "2rem",
            }}
          >
            SECTION 3 - Map 2
          </div>
        </>
      )}
    </div>
  );
}
