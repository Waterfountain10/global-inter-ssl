import React, { useEffect, useRef, useState } from "react";
import "./ResearchQuestion.css";

const fullText =
  "Does globalization lead to homogeneous interior spaces around the world?";

export default function ResearchQuestion() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
  const [isComplete, setIsComplete] = useState(false);
  const [searchBarState, setSearchBarState] = useState("center"); // 'center', 'pinned', 'floating'
  const [containerMode, setContainerMode] = useState("fixed"); // 'fixed', 'floating'

  // Check for triggers from HomePage - enhanced for smooth transition
  useEffect(() => {
    const checkTriggers = () => {
      if (sessionStorage.getItem("phaseTransition") === "true" && !isVisible) {
        console.log("📍 ResearchQuestion: Smooth transition detected");
        setIsVisible(true);

        // Delay search bar appearance for smoother transition with slow fade
        setTimeout(() => {
          setShowSearchBar(true);
          console.log(
            "📍 ResearchQuestion: Search bar appearing after 1s delay with slow fade",
          );
        }, 1000); // Wait 1 second after TopFold scroll trigger

        sessionStorage.removeItem("phaseTransition");
      }
    };

    const interval = setInterval(checkTriggers, 100);
    return () => clearInterval(interval);
  }, [isVisible]);

  // Function to trigger Map1 reveal
  const triggerMap1 = () => {
    console.log("🗺️ Triggering Map1 reveal");
    setSearchBarState("floating");
    setContainerMode("floating");

    setTimeout(() => {
      sessionStorage.setItem("showMap1", "true");
      console.log("🗺️ Map1 trigger set");
    }, 300);
  };

  // Enhanced scroll handler for smooth typing effect
  useEffect(() => {
    if (!showSearchBar) return;

    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;

      // Adjust scroll ranges for smooth transition
      // Phase 1: Typing (starts later to account for transition)
      const startScroll = windowHeight * 1.0; // Start typing after transition area
      const endScroll = windowHeight * 2.2; // Extended range for more control

      // Phase 2: Float up (2.8vh+)
      const floatTriggerScroll = windowHeight * 2.8;

      if (scrollY < startScroll) {
        setScrollProgress(0);
        if (isComplete) {
          setIsComplete(false);
          setSearchBarState("center");
          setContainerMode("fixed");
          console.log("🔄 Reset typing state - scrolled back up");
        }
      } else if (scrollY >= startScroll && scrollY <= endScroll) {
        // Typing phase - smoother progression
        const progress = (scrollY - startScroll) / (endScroll - startScroll);
        const smoothProgress = Math.pow(progress, 0.8); // Slightly ease the progression
        setScrollProgress(Math.max(0, Math.min(1, smoothProgress)));

        if (smoothProgress >= 0.95 && !isComplete) {
          setIsComplete(true);
          setSearchBarState("pinned");
          setContainerMode("fixed");
          console.log("✅ Smooth typing complete - search bar pinned");
        }
      } else if (scrollY > endScroll) {
        // Beyond typing range - ensure completion
        if (!isComplete) {
          setScrollProgress(1);
          setIsComplete(true);
          setSearchBarState("pinned");
          setContainerMode("fixed");
          console.log("✅ Force complete typing - scrolled beyond range");
        }

        if (scrollY > floatTriggerScroll && containerMode === "fixed") {
          // Float up phase
          console.log("🚀 Float trigger scroll reached");
          triggerMap1();
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showSearchBar, isComplete, containerMode]);

  // Calculate typed text based on scroll progress with smoother character reveal
  const getTypedText = () => {
    // Use easing function for smoother character appearance
    const easedProgress = 1 - Math.pow(1 - scrollProgress, 2); // Ease-out curve
    const charCount = Math.floor(easedProgress * fullText.length);
    return fullText.slice(0, charCount);
  };

  // Handle button click
  const handleButtonClick = () => {
    if (isComplete) {
      triggerMap1();
    }
  };

  // Clean, responsive search bar with proper centering
  const getSearchBarStyle = () => {
    const currentText = getTypedText();

    // Calculate dynamic width based on text length and screen size
    const getResponsiveWidth = () => {
      // Base character width estimation
      const fontSize =
        window.innerWidth <= 480
          ? 14.4
          : window.innerWidth <= 768
            ? 17.6
            : 22.4; // Convert rem to px
      const charWidth = fontSize * 0.55; // Approximate character width

      // Calculate text width
      const textWidthPx = currentText.length * charWidth;

      // Button and spacing
      const buttonWidth = window.innerWidth <= 768 ? 40 : 50;
      const horizontalPadding = window.innerWidth <= 768 ? 32 : 48;
      const spacing = 20;

      // Minimum widths
      const minWidth =
        window.innerWidth <= 480 ? 320 : window.innerWidth <= 768 ? 400 : 480;
      const maxWidth = Math.min(window.innerWidth * 0.9, 800);

      // Calculate total needed width
      const neededWidth =
        textWidthPx + buttonWidth + horizontalPadding + spacing;

      return Math.max(minWidth, Math.min(maxWidth, neededWidth));
    };

    const baseStyle = {
      position: "fixed",
      background: "#ffffff",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      width: `${getResponsiveWidth()}px`,
      padding: window.innerWidth <= 768 ? "12px 16px" : "16px 24px",
      borderRadius: window.innerWidth <= 768 ? "50px" : "60px",
      boxShadow:
        "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      left: "50%",
      zIndex: 10000,
      transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      opacity: 0, // Start invisible
      transform: "translateX(-50%)", // Default centering
    };

    // Position and visibility based on state
    if (searchBarState === "center") {
      return {
        ...baseStyle,
        top: "50%",
        transform: "translate(-50%, -50%)",
        opacity: showSearchBar ? 1 : 0,
        animation: showSearchBar
          ? "slowFadeInCentered 2s ease-out forwards"
          : "none",
      };
    } else if (searchBarState === "pinned") {
      return {
        ...baseStyle,
        top: window.innerWidth <= 768 ? "60px" : "80px",
        transform: "translateX(-50%)",
        opacity: 1,
        animation: "none",
      };
    } else if (searchBarState === "floating") {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const floatStartScroll = windowHeight * 2.8;
      const floatProgress = Math.min(
        1,
        Math.max(0, (scrollY - floatStartScroll) / (windowHeight * 0.8)),
      );

      const easedFloatProgress = Math.pow(floatProgress, 0.6);

      return {
        ...baseStyle,
        top: window.innerWidth <= 768 ? "60px" : "80px",
        transform: `translateX(-50%) translateY(${-easedFloatProgress * 200}px)`,
        opacity: Math.max(0.2, 1 - easedFloatProgress * 0.8),
        animation: "none",
      };
    }

    return baseStyle;
  };

  // Calculate instruction text position relative to search bar
  const getInstructionTextStyle = () => {
    const baseStyle = {
      position: "fixed", // Changed from absolute to fixed
      left: "50%",
      transform: "translateX(-50%)",
      textAlign: "center",
      color: "#666",
      fontSize: window.innerWidth <= 768 ? "1rem" : "1.1rem",
      zIndex: 100,
      opacity: 0,
      padding: "0 20px",
      maxWidth: "90%",
      animation: "slowFadeIn 2s ease-out forwards",
    };

    if (searchBarState === "center") {
      // Position above the centered search bar
      return {
        ...baseStyle,
        top: "calc(50% - 120px)", // 120px above the search bar center
      };
    } else if (searchBarState === "pinned") {
      // Position above the pinned search bar
      return {
        ...baseStyle,
        top:
          window.innerWidth <= 768 ? "calc(60px - 80px)" : "calc(80px - 100px)", // Above pinned search bar
      };
    }

    return baseStyle;
  };

  // Calculate continue instruction position relative to search bar
  const getContinueInstructionStyle = () => {
    const baseStyle = {
      position: "fixed", // Changed from absolute to fixed
      left: "50%",
      transform: "translateX(-50%)",
      textAlign: "center",
      color: "#666",
      fontSize: window.innerWidth <= 768 ? "1rem" : "1.1rem",
      zIndex: 100,
      opacity: 0,
      padding: "0 20px",
      maxWidth: "90%",
      animation: "slowFadeIn 1.5s ease-out forwards",
    };

    if (searchBarState === "center") {
      // Position below the centered search bar
      return {
        ...baseStyle,
        top: "calc(50% + 120px)", // 120px below the search bar center
      };
    } else if (searchBarState === "pinned") {
      // Position below the pinned search bar
      return {
        ...baseStyle,
        top:
          window.innerWidth <= 768
            ? "calc(60px + 100px)"
            : "calc(80px + 120px)", // Below pinned search bar
      };
    }

    return baseStyle;
  };

  return (
    <>
      {/* Main container */}
      <div
        ref={containerRef}
        className="research-question"
        style={{
          position: containerMode === "fixed" ? "fixed" : "relative",
          top: containerMode === "fixed" ? 0 : "auto",
          left: containerMode === "fixed" ? 0 : "auto",
          width: "100%",
          height: containerMode === "fixed" ? "100vh" : "auto",
          minHeight: containerMode === "floating" ? "100vh" : "auto",
          background: "#EEEEEE",
          zIndex: containerMode === "fixed" ? 80 : 20,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          overflow: containerMode === "fixed" ? "hidden" : "visible",
        }}
      >
        {/* Scroll instruction - positioned relative to search bar */}
        {showSearchBar &&
          scrollProgress < 0.02 &&
          searchBarState === "center" &&
          containerMode === "fixed" && (
            <div style={getInstructionTextStyle()}>
              <div style={{ marginBottom: "10px", lineHeight: 1.4 }}>
                {window.innerWidth <= 768
                  ? "Scroll to reveal the question"
                  : "Scroll down to reveal the research question"}
              </div>
              <div
                style={{
                  fontSize: window.innerWidth <= 768 ? "1.5rem" : "1.8rem",
                  color: "#FF395C",
                  animation: "bounce 2s infinite 2s",
                }}
              >
                ↓
              </div>
            </div>
          )}

        {/* Continue instruction - positioned relative to search bar */}
        {showSearchBar &&
          isComplete &&
          searchBarState === "pinned" &&
          containerMode === "fixed" && (
            <div style={getContinueInstructionStyle()}>
              <div style={{ marginBottom: "10px", lineHeight: 1.4 }}>
                {window.innerWidth <= 768
                  ? "Continue scrolling to explore"
                  : "Continue scrolling or click the button to explore the maps"}
              </div>
              <div
                style={{
                  fontSize: window.innerWidth <= 768 ? "1.5rem" : "1.8rem",
                  color: "#FF395C",
                  animation: "bounce 2s infinite 1.5s",
                }}
              >
                ↓
              </div>
            </div>
          )}
      </div>

      {/* Clean, centered search bar */}
      {showSearchBar && (
        <div style={getSearchBarStyle()}>
          <span
            style={{
              color: "#393939",
              fontSize:
                window.innerWidth <= 480
                  ? "0.9rem"
                  : window.innerWidth <= 768
                    ? "1.1rem"
                    : "1.4rem",
              fontWeight: 900,
              letterSpacing: window.innerWidth <= 768 ? "-0.3px" : "-0.8px",
              whiteSpace: "nowrap",
              flex: 1,
              textAlign: "left",
              transition: "all 0.3s ease",
              overflow: "visible",
              display: "flex",
              alignItems: "center",
            }}
          >
            {getTypedText()}
            {scrollProgress > 0 && scrollProgress < 0.98 && (
              <span
                style={{
                  animation: "blink 1s step-end infinite",
                  marginLeft: "4px",
                  opacity: scrollProgress > 0.02 ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                |
              </span>
            )}
          </span>

          <div
            onClick={handleButtonClick}
            style={{
              width: window.innerWidth <= 768 ? "40px" : "50px",
              height: window.innerWidth <= 768 ? "40px" : "50px",
              borderRadius: "50%",
              background: scrollProgress > 0.9 ? "#FF395C" : "#cccccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: window.innerWidth <= 768 ? "14px" : "18px",
              fontWeight: "bold",
              transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              cursor: isComplete ? "pointer" : "default",
              transform: isComplete ? "scale(1.05)" : "scale(1)",
              flexShrink: 0,
              userSelect: "none",
              boxShadow: isComplete
                ? "0 4px 12px rgba(255, 57, 92, 0.3)"
                : "none",
              opacity: scrollProgress > 0.1 ? 1 : 0.7,
            }}
          >
            →
          </div>
        </div>
      )}

      <style>{`
        @keyframes slowFadeIn {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        html {
          scroll-behavior: smooth;
        }

        .research-question {
          will-change: opacity, transform;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          html {
            scroll-behavior: auto;
          }

          .slowFadeIn {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}
