import React, { useEffect, useRef, useState } from "react";
import "./TopFold.css";

const TopFold = ({ onScrollTrigger }) => {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure we start at the top and don't interfere with HomePage scroll management
    if (window.pageYOffset !== 0) {
      window.scrollTo(0, 0);
    }

    // Mark as ready after a short delay for smooth loading
    const timer = setTimeout(() => {
      setIsReady(true);
      console.log("🏁 TopFold ready - scroll position:", window.pageYOffset);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle scroll trigger - now integrates with HomePage scroll system
  const handleScrollTrigger = () => {
    console.log("🎯 TopFold scroll trigger activated");
    console.log("🔍 onScrollTrigger callback exists:", !!onScrollTrigger);

    if (onScrollTrigger) {
      console.log("📞 Calling onScrollTrigger callback");
      onScrollTrigger();
    } else {
      console.error("❌ No onScrollTrigger callback provided!");
    }
  };

  // Handle wheel event for immediate response (like Apple sites)
  useEffect(() => {
    if (!isReady) {
      console.log("🔍 TopFold not ready yet, skipping wheel listener");
      return;
    }

    let scrollTimeout;

    const handleWheel = (e) => {
      console.log("🎡 Wheel event detected:", e.deltaY);
      e.preventDefault(); // Prevent default scroll while in TopFold

      if (e.deltaY > 0) {
        // Scrolling down
        console.log("⬇️ Downward scroll detected");
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          console.log("🚀 Triggering scroll after timeout");
          handleScrollTrigger();
        }, 50); // Quick response
      }
    };

    console.log("👂 Adding wheel event listener to TopFold");
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      console.log("🧹 Removing wheel event listener from TopFold");
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, [isReady]);

  // Add click handler for testing
  const handleClick = () => {
    console.log("👆 TopFold clicked - triggering scroll");
    handleScrollTrigger();
  };

  return (
    <section
      className={`topfold-container${isReady ? " ready" : ""}`}
      onClick={handleClick}
    >
      <div className="black-overlay"></div>

      <video
        ref={videoRef}
        className="topfold-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source
          src="/assets/videos/globalinterior_video2.mp4"
          type="video/mp4"
        />
      </video>

      <img
        className="scl-logo"
        src="/assets/images/scl_logo_white.png"
        alt="Senseable City Lab"
      />
      <img
        className="mit-logo"
        src="/assets/images/mit_logo_white.png"
        alt="MIT"
      />

      {/* Enhanced scroll indicator with Apple-style animation */}
      <div
        className="scroll-indicator"
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          console.log("🎯 Arrow clicked");
          handleScrollTrigger();
        }}
      >
        <div className="scroll-text">Scroll to explore</div>
        <img
          className="scroll-icon"
          src="/assets/images/red_arrow.svg"
          alt="Scroll Down"
        />
      </div>

      {/* Apple-style scroll hint animation */}
      {isReady && (
        <div
          className="scroll-hint-container"
          onClick={(e) => {
            e.stopPropagation();
            console.log("💫 Scroll hint clicked");
            handleScrollTrigger();
          }}
        >
          <div className="scroll-hint-line"></div>
          <div className="scroll-hint-dot"></div>
        </div>
      )}

      {/* Debug button for testing */}
      {isReady && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("🔴 Debug button clicked");
            handleScrollTrigger();
          }}
          style={{
            position: "absolute",
            bottom: "200px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "15px 30px",
            background: "#FF395C",
            color: "white",
            border: "none",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "16px",
            zIndex: 1000,
            fontWeight: "bold",
          }}
        >
          DEBUG TRIGGER
        </button>
      )}
    </section>
  );
};

export default TopFold;
