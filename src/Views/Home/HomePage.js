// src/Views/HomePage.js
import React, { useState, useEffect, useCallback } from "react";
import "./HomePage";
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
  const [stage, setStage] = useState(0); // 0 → TopFold/ResearchQuestion, 1 → Map1, 2 → Map2, 3 → Map3, 4 → Map4, 5 → Map5, 6 → Map6, 7 → Credits
  const [advancing, setAdvancing] = useState(false);
  const [retreating, setRetreating] = useState(false); // NEW: for backward navigation
  const [transitionLocked, setTransitionLocked] = useState(false);
  const [creditsScrollProgress, setCreditsScrollProgress] = useState(0);

  // Phase Management System - Enhanced with bidirectional support
  const [currentPhase, setCurrentPhase] = useState("TOPFOLD"); // TOPFOLD | RESEARCH_TYPING | MAP_TRANSITIONS

  // NEW: Scroll accumulator for speed-based transitions
  const [scrollAccumulator, setScrollAccumulator] = useState(0);
  const SCROLL_THRESHOLD = 100; // Total scroll needed to trigger transition
  const SCROLL_DECAY_RATE = 0.95; // How fast scroll accumulator decays
  const TRANSITION_COOLDOWN = 1000; // Minimum time between transitions

  // unlock scroll helper
  const unlockScroll = useCallback(() => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.documentElement.style.overscrollBehavior = "";
    document.body.style.overscrollBehavior = "";
    const preventDefault = (e) => e.preventDefault();
    const preventScrollKeys = (e) => {
      if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
      }
    };
    window.removeEventListener("wheel", preventDefault);
    window.removeEventListener("touchmove", preventDefault);
    window.removeEventListener("keydown", preventScrollKeys);
  }, []);

  // Phase 1 → 2: TOPFOLD to RESEARCH_TYPING (triggered at scroll midpoint)
  useEffect(() => {
    const checkPhaseTransition = () => {
      if (
        sessionStorage.getItem("phaseTransition") === "true" &&
        currentPhase === "TOPFOLD"
      ) {
        sessionStorage.removeItem("phaseTransition");
        setCurrentPhase("RESEARCH_TYPING");
      }
    };
    const interval = setInterval(checkPhaseTransition, 50);
    return () => clearInterval(interval);
  }, [currentPhase]);

  // Search bar materialization (triggered after scroll completion)
  useEffect(() => {
    const checkTypingStart = () => {
      if (
        sessionStorage.getItem("startTyping") === "true" &&
        currentPhase === "RESEARCH_TYPING"
      ) {
        // startTyping signal is handled by ResearchQuestion component
      }
    };
    const interval = setInterval(checkTypingStart, 50);
    return () => clearInterval(interval);
  }, [currentPhase]);

  // Phase 2 → 3: RESEARCH_TYPING to MAP_TRANSITIONS (when search bar completes pinning)
  useEffect(() => {
    const checkSearchComplete = () => {
      if (
        sessionStorage.getItem("showMap1") === "true" &&
        currentPhase === "RESEARCH_TYPING"
      ) {
        sessionStorage.removeItem("showMap1");
        setCurrentPhase("MAP_TRANSITIONS");
        setStage(1); // show Map1
      }
    };
    const interval = setInterval(checkSearchComplete, 100);
    return () => clearInterval(interval);
  }, [currentPhase]);

  // NEW: Enhanced bidirectional navigation functions
  const navigateToStage = useCallback(
    (newStage, direction = "forward") => {
      if (transitionLocked || newStage < 0 || newStage > 7) return;

      console.log(
        `🎯 Navigating ${direction} from stage ${stage} to ${newStage}`,
      );

      setTransitionLocked(true);

      if (direction === "forward") {
        setAdvancing(true);
        setRetreating(false);
      } else {
        setRetreating(true);
        setAdvancing(false);
      }

      // Shorter transition time for scroll-controlled navigation
      const transitionTime = 1200; // Reduced from 2000ms

      setTimeout(() => {
        setStage(newStage);
        setAdvancing(false);
        setRetreating(false);
        setTransitionLocked(false);
      }, transitionTime);
    },
    [stage, transitionLocked],
  );

  // NEW: Enhanced scroll management with bidirectional support and speed control
  useEffect(() => {
    if (currentPhase !== "MAP_TRANSITIONS" || transitionLocked) return;

    let scrollTimeout = null;
    let decayInterval = null;
    let creditsRevealProgress = 0;
    const CREDITS_REVEAL_RANGE = 300;

    // Scroll accumulator decay
    decayInterval = setInterval(() => {
      setScrollAccumulator((prev) => {
        const newValue = prev * SCROLL_DECAY_RATE;
        return Math.abs(newValue) < 1 ? 0 : newValue;
      });
    }, 50);

    const handleGlobalScroll = (e) => {
      console.log(
        "🔍 SCROLL EVENT - deltaY:",
        e.deltaY,
        "stage:",
        stage,
        "accumulator:",
        scrollAccumulator,
      );

      // Handle Credits progressive reveal at Map6
      if (stage === 6 && !advancing && !retreating) {
        e.preventDefault();

        if (e.deltaY > 0) {
          // Forward scroll at Map6 - reveal credits
          creditsRevealProgress += e.deltaY;
          creditsRevealProgress = Math.max(0, creditsRevealProgress);

          const scrollProgress = Math.min(
            creditsRevealProgress / CREDITS_REVEAL_RANGE,
            1,
          );
          setCreditsScrollProgress(scrollProgress);

          if (scrollProgress > 0.1 && stage !== 7) {
            sessionStorage.setItem("creditsTransition", "true");
            setStage(7);
          }

          if (scrollProgress >= 1) {
            setTransitionLocked(true);
            setTimeout(() => unlockScroll(), 1000);
          }
        } else {
          // Backward scroll at Map6 - go back to Map5
          navigateToStage(5, "backward");
        }
        return;
      }

      // Enhanced scroll accumulation with direction
      setScrollAccumulator((prev) => {
        const newAccumulator = prev + e.deltaY;

        // Check for threshold breach
        if (Math.abs(newAccumulator) >= SCROLL_THRESHOLD) {
          // Clear timeout to prevent interference
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
          }

          // Determine direction and target stage
          const direction = newAccumulator > 0 ? "forward" : "backward";
          let targetStage = stage;

          if (direction === "forward" && stage < 7) {
            targetStage = stage + 1;
          } else if (direction === "backward" && stage > 1) {
            targetStage = stage - 1;
          }

          // Navigate if valid target
          if (targetStage !== stage) {
            navigateToStage(targetStage, direction);

            // Reset accumulator after successful navigation
            setTimeout(() => setScrollAccumulator(0), 100);
            return 0;
          }
        }

        return newAccumulator;
      });

      // Set cooldown timeout
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrollAccumulator(0); // Reset if no threshold reached
      }, TRANSITION_COOLDOWN);
    };

    window.addEventListener("wheel", handleGlobalScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleGlobalScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (decayInterval) clearInterval(decayInterval);
    };
  }, [
    currentPhase,
    stage,
    advancing,
    retreating,
    transitionLocked,
    scrollAccumulator,
    navigateToStage,
    unlockScroll,
  ]);

  // unlock scroll only after Credits appears
  useEffect(() => {
    if (stage === 7) {
      const timer = setTimeout(() => {
        console.log("🔓 Unlocking scroll after Credits completion");
        unlockScroll();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage, unlockScroll]);

  // Legacy advance functions - now using navigateToStage
  const handleAdvance = () => navigateToStage(2, "forward");
  const handleAdvanceToMap3 = () => navigateToStage(3, "forward");
  const handleAdvanceToMap4 = () => navigateToStage(4, "forward");
  const handleAdvanceToMap5 = () => navigateToStage(5, "forward");
  const handleAdvanceToMap6 = () => navigateToStage(6, "forward");
  const handleAdvanceToCredits = () => navigateToStage(7, "forward");

  return (
    <div className="globalinteriors-homepage">
      {/* Debug indicator for scroll accumulator */}
      {currentPhase === "MAP_TRANSITIONS" && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 10001,
            fontFamily: "monospace",
          }}
        >
          Stage: {stage} | Scroll: {Math.round(scrollAccumulator)} | Progress:{" "}
          {Math.round((Math.abs(scrollAccumulator) / SCROLL_THRESHOLD) * 100)}%
        </div>
      )}

      {/* Phase-based component authorization */}
      {currentPhase === "TOPFOLD" && <TopFold />}
      {(currentPhase === "RESEARCH_TYPING" ||
        currentPhase === "MAP_TRANSITIONS") && <ResearchQuestion />}

      {/* Persistent world map background */}
      {currentPhase === "MAP_TRANSITIONS" && (
        <div className="persistent-world-map-background">
          <img
            className="world-map-bg"
            src="/assets/images/world_map_final.svg"
            alt="World map background"
          />
        </div>
      )}

      {/* Map components with enhanced props */}
      {currentPhase === "MAP_TRANSITIONS" && stage === 1 && (
        <Map1
          key="map1"
          advancing={advancing}
          retreating={retreating}
          onMount={() => console.log("📍 Map1 mounted")}
        />
      )}
      {currentPhase === "MAP_TRANSITIONS" && stage === 2 && (
        <Map2
          key="map2"
          advancing={advancing}
          retreating={retreating}
          onMount={() => console.log("📍 Map2 mounted")}
        />
      )}
      {currentPhase === "MAP_TRANSITIONS" && stage === 3 && (
        <Map3
          key="map3"
          advancing={advancing}
          retreating={retreating}
          onMount={() => console.log("📍 Map3 mounted")}
        />
      )}
      {currentPhase === "MAP_TRANSITIONS" && stage === 4 && (
        <Map4
          key="map4"
          advancing={advancing}
          retreating={retreating}
          onMount={() => console.log("📍 Map4 mounted")}
        />
      )}
      {currentPhase === "MAP_TRANSITIONS" && stage === 5 && (
        <Map5
          key="map5"
          advancing={advancing}
          retreating={retreating}
          onMount={() => console.log("📍 Map5 mounted")}
        />
      )}
      {currentPhase === "MAP_TRANSITIONS" && stage === 6 && (
        <Map6
          key="map6"
          advancing={advancing}
          retreating={retreating}
          onMount={() => console.log("📍 Map6 mounted")}
        />
      )}
      {currentPhase === "MAP_TRANSITIONS" && stage === 7 && (
        <Credits
          key="credits"
          visible={true}
          scrollProgress={creditsScrollProgress}
          onMount={() => console.log("📍 Credits mounted")}
        />
      )}
    </div>
  );
}
