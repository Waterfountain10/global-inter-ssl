// src/Views/HomePage.js
import React, { useState, useEffect, useCallback } from "react";
import "./HomePage.css";
import TopFold from "../TopFold/TopFold";
import ResearchQuestion from "../ResearchQuestion/ResearchQuestion";
import Map1 from "../Map1/Map1";
import Map2 from "../Map2/Map2";
import Map3 from "../Map3/Map3";
import Map4 from "../Map4/Map4";
import Map5 from "../Map5/Map5";
import Map6 from "../Map6/Map6";
import Credits from "../Credits/Credits";

export default function HomePage() {
  const [scrollMode, setScrollMode] = useState("LOCKED"); // LOCKED, UNLOCKED
  const [currentPhase, setCurrentPhase] = useState("TOPFOLD"); // TOPFOLD, RESEARCH, MAPS
  const [scrollY, setScrollY] = useState(0);
  const [mapProgress, setMapProgress] = useState({
    map1: 0,
    map2: 0,
    map3: 0,
    map4: 0,
    map5: 0,
    map6: 0,
    credits: 0,
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

    const interval = setInterval(checkMapTrigger, 50); // Check more frequently
    return () => clearInterval(interval);
  }, [currentPhase]);

  // Also check for direct scroll-based phase transition as backup
  useEffect(() => {
    if (scrollMode === "UNLOCKED" && currentPhase === "RESEARCH") {
      const windowHeight = window.innerHeight;
      const mapTriggerScroll = windowHeight * 2.5;

      if (scrollY > mapTriggerScroll) {
        console.log("🗺️ Direct scroll trigger - transitioning to MAPS");
        setCurrentPhase("MAPS");
      }
    }
  }, [scrollY, scrollMode, currentPhase]);

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

        // Map3 starts after Map2
        const map3StartScroll = windowHeight * 7;
        const map3EndScroll = windowHeight * 9;

        // Map4 starts after Map3
        const map4StartScroll = windowHeight * 9;
        const map4EndScroll = windowHeight * 11;

        // Map5 starts after Map4
        const map5StartScroll = windowHeight * 11;
        const map5EndScroll = windowHeight * 13;

        // Map6 starts after Map5
        const map6StartScroll = windowHeight * 13;
        const map6EndScroll = windowHeight * 15;

        // Credits starts after Map6
        const creditsStartScroll = windowHeight * 15;
        const creditsEndScroll = windowHeight * 17;

        // Calculate Map1 progress
        let map1Progress = 0;
        if (scrollY >= map1StartScroll && scrollY <= map1EndScroll) {
          map1Progress =
            (scrollY - map1StartScroll) / (map1EndScroll - map1StartScroll);
        } else if (scrollY > map1EndScroll && scrollY < map2StartScroll) {
          map1Progress = 1;
        } else if (scrollY >= map2StartScroll) {
          // Fade out Map1 when Map2 starts
          const fadeOutProgress = Math.min(
            1,
            (scrollY - map2StartScroll) / (windowHeight * 0.5),
          );
          map1Progress = 1 - fadeOutProgress;
        }

        // Calculate Map2 progress
        let map2Progress = 0;
        if (scrollY >= map2StartScroll && scrollY <= map2EndScroll) {
          map2Progress =
            (scrollY - map2StartScroll) / (map2EndScroll - map2StartScroll);
        } else if (scrollY > map2EndScroll && scrollY < map3StartScroll) {
          map2Progress = 1;
        } else if (scrollY >= map3StartScroll) {
          // Fade out Map2 when Map3 starts
          const fadeOutProgress = Math.min(
            1,
            (scrollY - map3StartScroll) / (windowHeight * 0.5),
          );
          map2Progress = 1 - fadeOutProgress;
        }

        // Calculate Map3 progress
        let map3Progress = 0;
        if (scrollY >= map3StartScroll && scrollY <= map3EndScroll) {
          map3Progress =
            (scrollY - map3StartScroll) / (map3EndScroll - map3StartScroll);
        } else if (scrollY > map3EndScroll && scrollY < map4StartScroll) {
          map3Progress = 1;
        } else if (scrollY >= map4StartScroll) {
          // Fade out Map3 when Map4 starts
          const fadeOutProgress = Math.min(
            1,
            (scrollY - map4StartScroll) / (windowHeight * 0.5),
          );
          map3Progress = 1 - fadeOutProgress;
        }

        // Calculate Map4 progress
        let map4Progress = 0;
        if (scrollY >= map4StartScroll && scrollY <= map4EndScroll) {
          map4Progress =
            (scrollY - map4StartScroll) / (map4EndScroll - map4StartScroll);
        } else if (scrollY > map4EndScroll && scrollY < map5StartScroll) {
          map4Progress = 1;
        } else if (scrollY >= map5StartScroll) {
          // Fade out Map4 when Map5 starts
          const fadeOutProgress = Math.min(
            1,
            (scrollY - map5StartScroll) / (windowHeight * 0.5),
          );
          map4Progress = 1 - fadeOutProgress;
        }

        // Calculate Map5 progress
        let map5Progress = 0;
        if (scrollY >= map5StartScroll && scrollY <= map5EndScroll) {
          map5Progress =
            (scrollY - map5StartScroll) / (map5EndScroll - map5StartScroll);
        } else if (scrollY > map5EndScroll && scrollY < map6StartScroll) {
          map5Progress = 1;
        } else if (scrollY >= map6StartScroll) {
          // Fade out Map5 when Map6 starts
          const fadeOutProgress = Math.min(
            1,
            (scrollY - map6StartScroll) / (windowHeight * 0.5),
          );
          map5Progress = 1 - fadeOutProgress;
        }

        // Calculate Map6 progress
        let map6Progress = 0;
        if (scrollY >= map6StartScroll && scrollY <= map6EndScroll) {
          map6Progress =
            (scrollY - map6StartScroll) / (map6EndScroll - map6StartScroll);
        } else if (scrollY > map6EndScroll) {
          map6Progress = 1;
        }

        // Calculate Credits progress
        let creditsProgress = 0;
        if (scrollY >= creditsStartScroll && scrollY <= creditsEndScroll) {
          creditsProgress =
            (scrollY - creditsStartScroll) /
            (creditsEndScroll - creditsStartScroll);
        } else if (scrollY > creditsEndScroll) {
          creditsProgress = 1;
        }

        setMapProgress({
          map1: Math.max(0, Math.min(1, map1Progress)),
          map2: Math.max(0, Math.min(1, map2Progress)),
          map3: Math.max(0, Math.min(1, map3Progress)),
          map4: Math.max(0, Math.min(1, map4Progress)),
          map5: Math.max(0, Math.min(1, map5Progress)),
          map6: Math.max(0, Math.min(1, map6Progress)),
          credits: Math.max(0, Math.min(1, creditsProgress)),
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
        <div>Map3 Progress: {Math.round(mapProgress.map3 * 100)}%</div>
        <div>Map4 Progress: {Math.round(mapProgress.map4 * 100)}%</div>
        <div>Map5 Progress: {Math.round(mapProgress.map5 * 100)}%</div>
        <div>Map6 Progress: {Math.round(mapProgress.map6 * 100)}%</div>
        <div>Credits Progress: {Math.round(mapProgress.credits * 100)}%</div>
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
            scrollMode === "UNLOCKED"
              ? `${window.innerHeight * 16}px`
              : "100vh", // Increased for all 6 maps + extra space
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

            {/* Map3 Component */}
            {mapProgress.map3 > 0 && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100vh",
                  zIndex: 30,
                  pointerEvents: "none",
                }}
              >
                <Map3
                  scrollProgress={mapProgress.map3}
                  isActive={mapProgress.map3 > 0.1}
                />
              </div>
            )}

            {/* Map4 Component */}
            {mapProgress.map4 > 0 && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100vh",
                  zIndex: 35,
                  pointerEvents: "none",
                }}
              >
                <Map4
                  scrollProgress={mapProgress.map4}
                  isActive={mapProgress.map4 > 0.1}
                />
              </div>
            )}

            {/* Map5 Component */}
            {mapProgress.map5 > 0 && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100vh",
                  zIndex: 40,
                  pointerEvents: "none",
                }}
              >
                <Map5
                  scrollProgress={mapProgress.map5}
                  isActive={mapProgress.map5 > 0.1}
                />
              </div>
            )}

            {/* Map6 Component */}
            {mapProgress.map6 > 0 && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100vh",
                  zIndex: 45,
                  pointerEvents: "none",
                }}
              >
                <Map6
                  scrollProgress={mapProgress.map6}
                  isActive={mapProgress.map6 > 0.1}
                />
              </div>
            )}

            {/* Credits Component */}
            {mapProgress.credits > 0 && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100vh",
                  zIndex: 50,
                  pointerEvents: "auto", // Allow interaction with credits
                }}
              >
                <Credits
                  scrollProgress={mapProgress.credits}
                  isActive={mapProgress.credits > 0.1}
                />
              </div>
            )}
          </>
        )}
        {/* Additional scroll space for credits */}
        {scrollMode === "UNLOCKED" && currentPhase === "MAPS" && (
          <div
            style={{
              position: "absolute",
              top: `${window.innerHeight * 17}px`,
              width: "100%",
              height: "100vh",
              background: "#EEEEEE",
              zIndex: 5,
            }}
          />
        )}
      </div>
    </div>
  );
}
