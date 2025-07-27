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

  // Scroll handler for typewriter effect
  useEffect(() => {
    if (!showSearchBar) return;

    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;

      // Start typing after scrolling 0.3 viewport heights
      // Complete typing after scrolling 2 viewport heights
      const startScroll = windowHeight * 0.3;
      const endScroll = windowHeight * 2.0;

      if (scrollY < startScroll) {
        setScrollProgress(0);
        if (isComplete) {
          setIsComplete(false); // Allow going back
          console.log("🔄 Reset typing state - scrolled back up");
        }
      } else if (scrollY > endScroll) {
        setScrollProgress(1);
        if (!isComplete) {
          setIsComplete(true);
          console.log("✅ Scroll typing complete");

          // Trigger next phase after completion
          setTimeout(() => {
            sessionStorage.setItem("showMap1", "true");
            console.log("🗺️ Map1 trigger set");
          }, 800);
        }
      } else {
        const progress = (scrollY - startScroll) / (endScroll - startScroll);
        setScrollProgress(Math.max(0, Math.min(1, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showSearchBar, isComplete]);

  // Calculate typed text based on scroll progress
  const getTypedText = () => {
    const charCount = Math.floor(scrollProgress * fullText.length);
    return fullText.slice(0, charCount);
  };

  return (
    <>
      {/* Main container */}
      <div
        ref={containerRef}
        className="research-question"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          background: "#EEEEEE",
          zIndex: 80,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {/* Scroll instruction - mobile responsive */}
        {showSearchBar && scrollProgress < 0.05 && (
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
      </div>

      {/* Persistent Search Bar - scroll controlled and mobile responsive */}
      {showSearchBar && (
        <div
          style={{
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
            top: isComplete
              ? window.innerWidth <= 768
                ? "60px"
                : "80px"
              : "50%",
            left: "50%",
            transform: isComplete
              ? "translateX(-50%)"
              : "translate(-50%, -50%)",
            transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            zIndex: 10000,
            opacity: 1,
          }}
        >
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

          {/* Mobile responsive button */}
          <div
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
              cursor: scrollProgress > 0.8 ? "pointer" : "default",
              transform: isComplete ? "scale(1.1)" : "scale(1)",
              flexShrink: 0,
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
