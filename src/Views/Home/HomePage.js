// src/Views/HomePage.js
import React, { useState, useEffect, useCallback } from "react";
import "./HomePage.css";
import TopFold from "../TopFold/TopFold";
import ResearchQuestion from "../ResearchQuestion/ResearchQuestion";

export default function HomePage() {
  const [scrollMode, setScrollMode] = useState("LOCKED"); // LOCKED, UNLOCKED
  const [currentPhase, setCurrentPhase] = useState("TOPFOLD"); // TOPFOLD, RESEARCH, MAPS
  const [scrollY, setScrollY] = useState(0);

  // Initialize with complete scroll lock
  useEffect(() => {
    console.log("🏁 HomePage initializing - locking scroll");

    // Force to top
    window.scrollTo(0, 0);

    // Complete scroll lock
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.style.position = "fixed";
    document.documentElement.style.top = "0";
    document.documentElement.style.left = "0";
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";

    setScrollMode("LOCKED");
    setCurrentPhase("TOPFOLD");

    console.log("✅ Scroll locked completely");

    return () => {
      // Cleanup on unmount
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.top = "";
      document.documentElement.style.left = "";
      document.documentElement.style.width = "";
      document.documentElement.style.height = "";
    };
  }, []);

  // Handle TopFold scroll trigger
  const handleTopFoldScroll = useCallback(() => {
    console.log("🚀 HomePage: TopFold scroll triggered!");

    // Remove all scroll locks
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.documentElement.style.position = "";
    document.documentElement.style.top = "";
    document.documentElement.style.left = "";
    document.documentElement.style.width = "";
    document.documentElement.style.height = "";

    console.log("✅ Scroll locks removed");

    // Update state
    setScrollMode("UNLOCKED");
    setCurrentPhase("RESEARCH");

    // Trigger research question immediately (no delay)
    sessionStorage.setItem("phaseTransition", "true");
    console.log("✅ Research phase transition triggered");

    // Small scroll to get user started
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight * 0.1,
        behavior: "smooth",
      });
      console.log("✅ Initial scroll initiated");
    }, 200);
  }, []);

  // Listen for Map1 trigger and return triggers
  useEffect(() => {
    const checkTriggers = () => {
      // Forward: Research → Maps
      if (
        sessionStorage.getItem("showMap1") === "true" &&
        currentPhase === "RESEARCH"
      ) {
        console.log("🗺️ Map phase triggered - transitioning to MAPS");
        setCurrentPhase("MAPS");
        sessionStorage.removeItem("showMap1");

        // Ensure scroll is still enabled
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }

      // Reverse: Maps → Research (triggered by ResearchQuestion scroll detection)
      if (
        sessionStorage.getItem("triggerReturn") === "true" &&
        currentPhase === "MAPS"
      ) {
        console.log(
          "🔄 Return triggered - starting smooth transition back to Research",
        );
        sessionStorage.removeItem("triggerReturn");

        // Start the reverse sequence: Maps fade out → Research fade in
        setTimeout(() => {
          setCurrentPhase("RESEARCH");
          sessionStorage.setItem("returnToResearch", "true");
        }, 600); // Wait for Map content to fade out
      }
    };

    const interval = setInterval(checkTriggers, 100);
    return () => clearInterval(interval);
  }, [currentPhase]);

  // Scroll handler for when unlocked - enhanced with reverse navigation
  useEffect(() => {
    if (scrollMode !== "UNLOCKED") return;

    const handleScroll = () => {
      const newScrollY = window.pageYOffset;
      setScrollY(newScrollY);

      // Handle phase transitions based on scroll position
      const windowHeight = window.innerHeight;

      // If we're in MAPS phase and scroll back up significantly, return to RESEARCH
      if (currentPhase === "MAPS" && newScrollY < windowHeight * 1.5) {
        console.log("🔄 Scrolled back from Maps to Research");
        setCurrentPhase("RESEARCH");
        sessionStorage.setItem("returnToResearch", "true");
      }
      // If we're in RESEARCH phase and scroll down significantly, go to MAPS
      else if (currentPhase === "RESEARCH" && newScrollY > windowHeight * 2.5) {
        console.log("🚀 Scrolled forward from Research to Maps");
        setCurrentPhase("MAPS");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollMode, currentPhase]);

  return (
    <div className="globalinteriors-homepage">
      {/* Debug Panel */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.9)",
          color: "white",
          padding: "15px",
          borderRadius: "8px",
          fontSize: "12px",
          zIndex: 10001,
          fontFamily: "monospace",
        }}
      >
        <div>Scroll Mode: {scrollMode}</div>
        <div>Phase: {currentPhase}</div>
        <div>Scroll Y: {Math.round(scrollY)}px</div>
        <button
          onClick={handleTopFoldScroll}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            background: "#FF395C",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "10px",
          }}
        >
          MANUAL TRIGGER
        </button>
      </div>

      {/* Set document height for scrolling when unlocked */}
      <div
        style={{
          height:
            scrollMode === "UNLOCKED" ? `${window.innerHeight * 3}px` : "100vh", // Increased height for typing space
          position: "relative",
          background: "#EEEEEE",
        }}
      >
        {/* TopFold Section */}
        {currentPhase === "TOPFOLD" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100vh",
              zIndex: 100,
            }}
          >
            <TopFold onScrollTrigger={handleTopFoldScroll} />
          </div>
        )}

        {/* Research Question Section - always mounted after research phase starts */}
        {(currentPhase === "RESEARCH" || currentPhase === "MAPS") && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              zIndex: currentPhase === "RESEARCH" ? 90 : 30,
              background: "#EEEEEE",
            }}
          >
            <ResearchQuestion />
          </div>
        )}

        {/* Maps Section - additional content over ResearchQuestion */}
        {currentPhase === "MAPS" && (
          <>
            {/* World Map Background with smooth reverse fade */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                zIndex: 40,
                opacity:
                  sessionStorage.getItem("triggerReturn") === "true" ? 0 : 0.8,
                pointerEvents: "none",
                transition:
                  sessionStorage.getItem("triggerReturn") === "true"
                    ? "opacity 0.8s ease-out 0.3s"
                    : "opacity 0.8s ease", // Delay for reverse
              }}
            >
              <img
                src="/assets/images/world_map_final.svg"
                alt="World map background"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Map 1 Content - scroll responsive with smooth fade out on reverse */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                opacity:
                  sessionStorage.getItem("triggerReturn") === "true"
                    ? 0
                    : Math.max(0, Math.min(1, scrollY / window.innerHeight)),
                transition:
                  sessionStorage.getItem("triggerReturn") === "true"
                    ? "opacity 0.6s ease-out"
                    : "opacity 0.3s ease",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.35)",
                  backdropFilter: "blur(10px)",
                  padding: "36px 48px",
                  borderRadius: "40px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  maxWidth: "700px",
                  textAlign: "center",
                  fontSize: "1.6rem",
                  fontWeight: "500",
                  color: "#333",
                  pointerEvents: "auto",
                }}
              >
                <p>
                  The question of whether and how global pressures reduce or
                  eliminate{" "}
                  <span style={{ color: "#FF395C", fontWeight: "bold" }}>
                    local cultural distinctiveness
                  </span>{" "}
                  has been the subject of considerable research.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Scrollable sections for demonstration */}
        {scrollMode === "UNLOCKED" && (
          <>
            <div
              style={{
                position: "absolute",
                top: `${window.innerHeight * 2}px`,
                width: "100%",
                height: "100vh",
                background: "#4CAF50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                zIndex: 10,
              }}
            >
              MAP 2 PLACEHOLDER
            </div>

            <div
              style={{
                position: "absolute",
                top: `${window.innerHeight * 3}px`,
                width: "100%",
                height: "100vh",
                background: "#2196F3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                zIndex: 10,
              }}
            >
              MAP 3 PLACEHOLDER
            </div>
          </>
        )}
      </div>
    </div>
  );
}
