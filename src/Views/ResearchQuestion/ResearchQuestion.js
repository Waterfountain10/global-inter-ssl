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

  // Check for triggers from HomePage
  useEffect(() => {
    const checkTriggers = () => {
      if (sessionStorage.getItem("phaseTransition") === "true" && !isVisible) {
        console.log("📍 ResearchQuestion: Phase transition detected");
        setIsVisible(true);
        setShowSearchBar(true);
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

  // Scroll handler for typewriter effect and Map1 trigger
  useEffect(() => {
    if (!showSearchBar) return;

    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;

      // Phase 1: Typing (0.3vh to 2vh)
      const startScroll = windowHeight * 0.3;
      const endScroll = windowHeight * 2.0;

      // Phase 2: Float up (2.5vh+)
      const floatTriggerScroll = windowHeight * 2.5;

      if (scrollY < startScroll) {
        setScrollProgress(0);
        if (isComplete) {
          setIsComplete(false);
          setSearchBarState("center");
          setContainerMode("fixed");
          console.log("🔄 Reset typing state - scrolled back up");
        }
      } else if (scrollY >= startScroll && scrollY <= endScroll) {
        // Typing phase
        const progress = (scrollY - startScroll) / (endScroll - startScroll);
        setScrollProgress(Math.max(0, Math.min(1, progress)));

        if (progress >= 1 && !isComplete) {
          setIsComplete(true);
          setSearchBarState("pinned");
          setContainerMode("fixed");
          console.log("✅ Scroll typing complete - search bar pinned");
        }
      } else if (
        scrollY > floatTriggerScroll &&
        isComplete &&
        containerMode === "fixed"
      ) {
        // Float up phase
        console.log("🚀 Float trigger scroll reached");
        triggerMap1();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showSearchBar, isComplete, containerMode]);

  // Calculate typed text based on scroll progress
  const getTypedText = () => {
    const charCount = Math.floor(scrollProgress * fullText.length);
    return fullText.slice(0, charCount);
  };

  // Handle button click
  const handleButtonClick = () => {
    if (isComplete) {
      triggerMap1();
    }
  };

  // Calculate search bar position based on mode and scroll
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
      transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };

    if (searchBarState === "center") {
      return {
        ...baseStyle,
        top: "50%",
        transform: "translate(-50%, -50%)",
        opacity: 1,
      };
    } else if (searchBarState === "pinned") {
      return {
        ...baseStyle,
        top: window.innerWidth <= 768 ? "60px" : "80px",
        transform: "translateX(-50%)",
        opacity: 1,
      };
    } else if (searchBarState === "floating") {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const floatStartScroll = windowHeight * 2.5;
      const floatProgress = Math.min(
        1,
        Math.max(0, (scrollY - floatStartScroll) / (windowHeight * 0.5)),
      );

      return {
        ...baseStyle,
        top: window.innerWidth <= 768 ? "60px" : "80px",
        transform: `translateX(-50%) translateY(${-floatProgress * 200}px)`,
        opacity: Math.max(0.3, 1 - floatProgress * 0.7),
      };
    }

    return baseStyle;
  };

  return (
    <>
      {/* Main container - transitions from fixed to allowing scroll */}
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
          transition: "opacity 0.5s ease, z-index 0.3s ease",
          overflow: containerMode === "fixed" ? "hidden" : "visible",
        }}
      >
        {/* Scroll instruction - mobile responsive and context aware */}
        {showSearchBar &&
          scrollProgress < 0.05 &&
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
                opacity: 0.8,
                padding: "0 20px",
                maxWidth: "90%",
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
                  animation: "bounce 2s infinite",
                }}
              >
                ↓
              </div>
            </div>
          )}

        {/* Continue instruction - shows when typing is complete */}
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
                opacity: 0.8,
                padding: "0 20px",
                maxWidth: "90%",
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
                  animation: "bounce 2s infinite",
                }}
              >
                ↓
              </div>
            </div>
          )}
      </div>

      {/* Persistent Search Bar - scroll controlled and mobile responsive */}
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
            }}
          >
            {getTypedText()}
            {scrollProgress > 0 && scrollProgress < 1 && (
              <span
                style={{
                  animation: "blink 1s step-end infinite",
                  marginLeft: "4px",
                }}
              >
                |
              </span>
            )}
          </span>

          {/* Mobile responsive button with click handler */}
          <div
            onClick={handleButtonClick}
            style={{
              marginLeft: "auto",
              width: window.innerWidth <= 768 ? "50px" : "70px",
              height: window.innerWidth <= 768 ? "50px" : "70px",
              borderRadius: "50%",
              background: scrollProgress > 0.8 ? "#FF395C" : "#cccccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: window.innerWidth <= 768 ? "18px" : "24px",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              cursor: isComplete ? "pointer" : "default",
              transform: isComplete ? "scale(1.05)" : "scale(1)",
              flexShrink: 0,
              userSelect: "none",
              boxShadow: isComplete
                ? "0 4px 12px rgba(255, 57, 92, 0.3)"
                : "none",
            }}
          >
            →
          </div>
        </div>
      )}

      {/* Debug info */}
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
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
