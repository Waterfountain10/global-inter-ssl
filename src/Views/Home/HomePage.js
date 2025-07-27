// src/Views/HomePage.js
import React, { useState, useEffect, useCallback } from "react";
import "./HomePage.css";
import TopFold from "../TopFold/TopFold";
import ResearchQuestion from "../ResearchQuestion/ResearchQuestion";
import Map1 from "../Map1/Map1";
import Map2 from "../Map2/Map2";

export default function HomePage() {
  const [scrollMode, setScrollMode] = useState("LOCKED"); // LOCKED, UNLOCKED
  const [currentPhase, setCurrentPhase] = useState("TOPFOLD"); // TOPFOLD, RESEARCH, MAPS
  const [scrollY, setScrollY] = useState(0);
  const [mapProgress, setMapProgress] = useState({
    map1: 0,
    map2: 0,
  });

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

  // Listen for Map1 trigger
  useEffect(() => {
    const checkMapTrigger = () => {
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
    };

    const interval = setInterval(checkMapTrigger, 100);
    return () => clearInterval(interval);
  }, [currentPhase]);

  // Scroll handler for when unlocked - calculate map progress
  useEffect(() => {
    if (scrollMode !== "UNLOCKED") return;

    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;

      setScrollY(scrollY);

      // Calculate map progress based on scroll position
      if (currentPhase === "MAPS") {
        // Map1 becomes active after research question phase (around 3vh)
        const map1StartScroll = windowHeight * 3;
        const map1EndScroll = windowHeight * 5;

        // Map2 starts after Map1
        const map2StartScroll = windowHeight * 5;
        const map2EndScroll = windowHeight * 7;

        // Calculate Map1 progress
        let map1Progress = 0;
        if (scrollY >= map1StartScroll && scrollY <= map1EndScroll) {
          map1Progress =
            (scrollY - map1StartScroll) / (map1EndScroll - map1StartScroll);
        } else if (scrollY > map1EndScroll) {
          map1Progress = 1;
        }

        // Calculate Map2 progress
        let map2Progress = 0;
        if (scrollY >= map2StartScroll && scrollY <= map2EndScroll) {
          map2Progress =
            (scrollY - map2StartScroll) / (map2EndScroll - map2StartScroll);
        } else if (scrollY > map2EndScroll) {
          map2Progress = 1;
        }

        setMapProgress({
          map1: Math.max(0, Math.min(1, map1Progress)),
          map2: Math.max(0, Math.min(1, map2Progress)),
        });
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
        <div>Map1 Progress: {Math.round(mapProgress.map1 * 100)}%</div>
        <div>Map2 Progress: {Math.round(mapProgress.map2 * 100)}%</div>
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
            scrollMode === "UNLOCKED" ? `${window.innerHeight * 8}px` : "100vh", // Increased for more scroll space
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
          <ResearchQuestion />
        )}

        {/* Maps Section - layered over ResearchQuestion */}
        {currentPhase === "MAPS" && (
          <>
            {/* World Map Background - persistent */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                zIndex: 15,
                opacity: Math.min(
                  0.6,
                  Math.max(
                    0,
                    (scrollY - window.innerHeight * 2.5) /
                      (window.innerHeight * 0.5),
                  ),
                ),
                pointerEvents: "none",
                transition: "opacity 0.3s ease",
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

            {/* Map1 Component */}
            {mapProgress.map1 > 0 && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100vh",
                  zIndex: 20,
                  pointerEvents: "none",
                }}
              >
                <Map1
                  scrollProgress={mapProgress.map1}
                  isActive={mapProgress.map1 > 0.1}
                />
              </div>
            )}

            {/* Map2 Component */}
            {mapProgress.map2 > 0 && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100vh",
                  zIndex: 25,
                  pointerEvents: "none",
                }}
              >
                <Map2
                  scrollProgress={mapProgress.map2}
                  isActive={mapProgress.map2 > 0.1}
                />
              </div>
            )}
          </>
        )}

        {/* Additional placeholder content for extended scrolling */}
        {scrollMode === "UNLOCKED" && currentPhase === "MAPS" && (
          <div
            style={{
              position: "absolute",
              top: `${window.innerHeight * 7}px`,
              width: "100%",
              height: "100vh",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "2rem",
              zIndex: 10,
            }}
          >
            CREDITS SECTION PLACEHOLDER
          </div>
        )}
      </div>
    </div>
  );
}
