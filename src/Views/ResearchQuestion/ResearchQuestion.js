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

  // Enhanced search bar positioning with slow fade-in animation
  const getSearchBarStyle = () => {
    const baseStyle = {
      position: "fixed",
      background: "#ffffff",
      backdropFilter: "blur(10px)",
      width: window.innerWidth <= 768 ? "90%" : "80%",
      maxWidth: window.innerWidth <= 768 ? "none" : "1050px",
      padding: window.innerWidth <= 768 ? "6px" : "8px",
      borderRadius: window.innerWidth <= 768 ? "50px" : "60px",
      boxShadow:
        "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
      display: "flex",
      alignItems: "center",
      left: "50%",
      zIndex: 10000,
      transition: "all 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Smoother, longer transition
      // Slow fade-in animation when first appearing
      animation: showSearchBar ? "slowFadeIn 2s ease-out forwards" : "none",
    };

    if (searchBarState === "center") {
      return {
        ...baseStyle,
        top: "50%",
        transform: "translate(-50%, -50%)",
        opacity: showSearchBar ? 1 : 0,
      };
    } else if (searchBarState === "pinned") {
      return {
        ...baseStyle,
        top: window.innerWidth <= 768 ? "60px" : "80px",
        transform: "translateX(-50%)",
        opacity: 1,
        animation: "none", // Remove initial fade animation when pinned
      };
    } else if (searchBarState === "floating") {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const floatStartScroll = windowHeight * 2.8;
      const floatProgress = Math.min(
        1,
        Math.max(0, (scrollY - floatStartScroll) / (windowHeight * 0.8)), // Slower float transition
      );

      // Use easing for smoother float animation
      const easedFloatProgress = Math.pow(floatProgress, 0.6);

      return {
        ...baseStyle,
        top: window.innerWidth <= 768 ? "60px" : "80px",
        transform: `translateX(-50%) translateY(${-easedFloatProgress * 200}px)`,
        opacity: Math.max(0.2, 1 - easedFloatProgress * 0.8),
        transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        animation: "none", // Remove initial fade animation when floating
      };
    }

    return baseStyle;
  };

  return (
    <>
      {/* Main container with enhanced smooth transitions */}
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
          transition: "opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Smoother fade
          overflow: containerMode === "fixed" ? "hidden" : "visible",
        }}
      >
        {/* Enhanced scroll instruction with slow fade-in */}
        {showSearchBar &&
          scrollProgress < 0.02 && // Show earlier for smoother UX
          searchBarState === "center" &&
          containerMode === "fixed" && (
            <div
              style={{
                position: "absolute",
                top: window.innerWidth <= 768 ? "30%" : "35%",
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
                color: "#666",
                fontSize: window.innerWidth <= 768 ? "1rem" : "1.1rem",
                zIndex: 100,
                opacity: 0,
                padding: "0 20px",
                maxWidth: "90%",
                animation: "slowFadeIn 2s ease-out forwards", // Slow fade-in animation
              }}
            >
              <div
                style={{
                  marginBottom: "10px",
                  lineHeight: 1.4,
                }}
              >
                {window.innerWidth <= 768
                  ? "Scroll to reveal the question"
                  : "Scroll down to reveal the research question"}
              </div>
              <div
                style={{
                  fontSize: window.innerWidth <= 768 ? "1.5rem" : "1.8rem",
                  color: "#FF395C",
                  animation: "bounce 2s infinite 2s", // Start bouncing after fade-in completes
                }}
              >
                ↓
              </div>
            </div>
          )}

        {/* Enhanced continue instruction with slow fade-in */}
        {showSearchBar &&
          isComplete &&
          searchBarState === "pinned" &&
          containerMode === "fixed" && (
            <div
              style={{
                position: "absolute",
                bottom: window.innerWidth <= 768 ? "20%" : "25%",
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
                color: "#666",
                fontSize: window.innerWidth <= 768 ? "1rem" : "1.1rem",
                zIndex: 100,
                opacity: 0,
                padding: "0 20px",
                maxWidth: "90%",
                animation: "slowFadeIn 1.5s ease-out forwards", // Slightly faster since it appears later
              }}
            >
              <div
                style={{
                  marginBottom: "10px",
                  lineHeight: 1.4,
                }}
              >
                {window.innerWidth <= 768
                  ? "Continue scrolling to explore"
                  : "Continue scrolling or click the button to explore the maps"}
              </div>
              <div
                style={{
                  fontSize: window.innerWidth <= 768 ? "1.5rem" : "1.8rem",
                  color: "#FF395C",
                  animation: "bounce 2s infinite 1.5s", // Start bouncing after fade-in
                }}
              >
                ↓
              </div>
            </div>
          )}
      </div>

      {/* Enhanced search bar with smoother typing animation */}
      {showSearchBar && (
        <div style={getSearchBarStyle()}>
          <span
            style={{
              color: "#393939",
              fontSize:
                window.innerWidth <= 768
                  ? "1.1rem"
                  : window.innerWidth <= 480
                    ? "1rem"
                    : "1.5rem",
              fontWeight: 900,
              marginLeft: window.innerWidth <= 768 ? "20px" : "45px",
              letterSpacing: window.innerWidth <= 768 ? "-0.5px" : "-1px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              minHeight: window.innerWidth <= 768 ? "1.4rem" : "1.8rem",
              flex: 1,
              paddingRight: "10px",
              transition: "all 0.3s ease", // Smooth text transitions
            }}
          >
            {getTypedText()}
            {scrollProgress > 0 &&
              scrollProgress < 0.98 && ( // Show cursor until nearly complete
                <span
                  style={{
                    animation: "blink 1s step-end infinite",
                    marginLeft: "4px",
                    opacity: scrollProgress > 0.02 ? 1 : 0, // Fade in cursor
                    transition: "opacity 0.3s ease",
                  }}
                >
                  |
                </span>
              )}
          </span>

          {/* Enhanced button with smoother state transitions */}
          <div
            onClick={handleButtonClick}
            style={{
              marginLeft: "auto",
              width: window.innerWidth <= 768 ? "50px" : "70px",
              height: window.innerWidth <= 768 ? "50px" : "70px",
              borderRadius: "50%",
              background: scrollProgress > 0.9 ? "#FF395C" : "#cccccc", // More responsive threshold
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: window.innerWidth <= 768 ? "18px" : "24px",
              fontWeight: "bold",
              transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Smoother button transition
              cursor: isComplete ? "pointer" : "default",
              transform: isComplete ? "scale(1.05)" : "scale(1)",
              flexShrink: 0,
              userSelect: "none",
              boxShadow: isComplete
                ? "0 4px 12px rgba(255, 57, 92, 0.3)"
                : "none",
              opacity: scrollProgress > 0.1 ? 1 : 0.7, // Fade in with progress
            }}
          >
            →
          </div>
        </div>
      )}

      {/* Enhanced debug info */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "12px",
          borderRadius: "8px",
          fontSize: "11px",
          zIndex: 10002,
          fontFamily: "monospace",
          transition: "opacity 0.3s ease",
          opacity: 0.8,
        }}
      >
        <div>Visible: {isVisible ? "YES" : "NO"}</div>
        <div>Show Bar: {showSearchBar ? "YES" : "NO"}</div>
        <div>Search State: {searchBarState}</div>
        <div>Container Mode: {containerMode}</div>
        <div>Scroll Progress: {Math.round(scrollProgress * 100)}%</div>
        <div>Complete: {isComplete ? "YES" : "NO"}</div>
        <div>Scroll Y: {Math.round(window.pageYOffset)}px</div>
        <div>
          Chars: {getTypedText().length}/{fullText.length}
        </div>
        <div>Smooth Easing: ON</div>
      </div>

      {/* Enhanced CSS for slow fade-in animations */}
      <style>{`
        @keyframes slowFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
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

        /* Enhanced smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Optimize transitions for 60fps */
        * {
          will-change: auto;
        }

        .research-question {
          will-change: opacity, transform;
        }

        /* Reduce motion for accessibility */
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
