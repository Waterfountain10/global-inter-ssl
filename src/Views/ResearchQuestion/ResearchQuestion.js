import React, { useEffect, useRef, useState, useCallback } from "react";
import "./ResearchQuestion.css";

const fullText =
  "Does globalization lead to homogeneous interior spaces around the world?";

export default function ResearchQuestion() {
  const containerRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [shouldType, setShouldType] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Check for triggers from HomePage
  useEffect(() => {
    const checkTriggers = () => {
      // Check for phase transition
      if (sessionStorage.getItem("phaseTransition") === "true" && !isVisible) {
        console.log("📍 ResearchQuestion: Phase transition detected");
        setIsVisible(true);
        setShowSearchBar(true);
        sessionStorage.removeItem("phaseTransition");
      }

      // Check for typing start
      if (
        sessionStorage.getItem("startTyping") === "true" &&
        !shouldType &&
        isVisible
      ) {
        console.log("⌨️ ResearchQuestion: Start typing detected");
        setShouldType(true);
        sessionStorage.removeItem("startTyping");
      }
    };

    // Check every 100ms for triggers
    const interval = setInterval(checkTriggers, 100);
    return () => clearInterval(interval);
  }, [isVisible, shouldType]);

  // Typewriter effect - fixed to be slower and more visible
  useEffect(() => {
    if (!shouldType) return;

    console.log("⌨️ Starting typewriter effect");
    setTypedText(""); // Reset text

    const typeText = async () => {
      for (let i = 0; i <= fullText.length; i++) {
        setTypedText(fullText.slice(0, i));
        console.log(`Typing: "${fullText.slice(0, i)}"`);
        await new Promise((resolve) => setTimeout(resolve, 80)); // Slower typing
      }

      console.log("✅ Typing complete");
      setTypingComplete(true);

      // Wait a bit before button animation
      setTimeout(() => {
        const btn = document.querySelector(".search-button");
        if (btn) {
          console.log("🔘 Button animation triggered");
          btn.classList.add("clicked");
          setTimeout(() => btn.classList.remove("clicked"), 1000);
        }

        // Pin search bar after button animation
        setTimeout(() => {
          console.log("📌 Pinning search bar");
          setPinned(true);

          // Trigger next phase after pinning
          setTimeout(() => {
            sessionStorage.setItem("showMap1", "true");
            console.log("🗺️ Map1 trigger set");
          }, 800);
        }, 1200); // Longer delay
      }, 1000); // Wait after typing
    };

    typeText();
  }, [shouldType]);

  return (
    <>
      {/* Main container - always visible once triggered */}
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
        {/* Empty content area - just background */}
      </div>

      {/* Persistent Search Bar - appears when showSearchBar is true */}
      {showSearchBar && (
        <div
          className={`persistent-search-bar${pinned ? " pinned" : ""}`}
          style={{
            position: "fixed",
            background: "#ffffff",
            backdropFilter: "blur(10px)",
            width: "80%",
            maxWidth: "1050px",
            padding: "8px",
            borderRadius: "60px",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
            display: "flex",
            alignItems: "center",
            top: pinned ? "80px" : "50%",
            left: "50%",
            transform: pinned ? "translateX(-50%)" : "translate(-50%, -50%)",
            transition: "all 0.8s ease-in-out",
            zIndex: 10000,
            opacity: 1,
          }}
        >
          <span
            className="typed-text"
            style={{
              color: "#393939",
              fontSize: "1.5rem",
              fontWeight: 900,
              marginLeft: "45px",
              letterSpacing: "-1px",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {typedText}
            {shouldType && !typingComplete && (
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
          <button
            className="search-button"
            style={{
              background: "transparent",
              border: "none",
              marginLeft: "auto",
              cursor: "pointer",
            }}
          >
            <img
              src="/assets/images/search_button.svg"
              alt="Search"
              className="search-icon"
              style={{
                width: "70px",
                height: "70px",
                transition: "filter 0.3s ease",
              }}
            />
          </button>
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
        <div>Should Type: {shouldType ? "YES" : "NO"}</div>
        <div>Typing Complete: {typingComplete ? "YES" : "NO"}</div>
        <div>Pinned: {pinned ? "YES" : "NO"}</div>
        <div>
          Text Length: {typedText.length}/{fullText.length}
        </div>
        <div>Current Text: "{typedText}"</div>
      </div>

      {/* CSS for blink animation */}
      <style jsx>{`
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
        .search-button.clicked .search-icon {
          animation: clickFlash 0.5s alternate 2;
        }
        @keyframes clickFlash {
          from {
            filter: brightness(100%);
          }
          to {
            filter: brightness(70%);
          }
        }
      `}</style>
    </>
  );
}
