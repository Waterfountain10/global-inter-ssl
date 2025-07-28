import React, { useEffect, useRef, useState } from "react";
import "./TopFold.css";

const TopFold = ({ onScrollTrigger }) => {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [logoError, setLogoError] = useState(false);

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

  // Handle keyboard events for accessibility
  useEffect(() => {
    if (!isReady) return;

    const handleKeyDown = (e) => {
      // Trigger on Enter, Space, or Arrow Down
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        console.log("⌨️ Keyboard trigger detected:", e.key);
        handleScrollTrigger();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReady]);

  // Add click handler for testing
  const handleClick = () => {
    console.log("👆 TopFold clicked - triggering scroll");
    handleScrollTrigger();
  };

  const handleScrollIndicatorClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log("🎯 Scroll indicator clicked");
    handleScrollTrigger();
  };

  // Handle logo loading error
  const handleLogoError = (e) => {
    console.error("Logo failed to load:", e.target.src);
    console.log("🔄 Switching to fallback placeholder");
    setLogoError(true);
  };

  // Handle successful logo load
  const handleLogoLoad = () => {
    console.log("✅ Logo loaded successfully");
    setLogoError(false);
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
          src="assets/videos/globalinteriors_video.mp4"
          type="video/mp4"
        />
      </video>

      {/* Corner logos */}
      <img
        className="scl-logo"
        src="assets/images/scl_logo_white.png"
        alt="Senseable City Lab"
      />
      <img
        className="mit-logo"
        src="assets/images/mit_logo_white.png"
        alt="MIT"
      />

      {/* Full-screen logo */}
      {!logoError ? (
        <img
          className="fullscreen-logo"
          src="globalinteriors_logo.png"
          alt="Global Interiors"
          onError={handleLogoError}
          onLoad={handleLogoLoad}
        />
      ) : (
        /* Fallback placeholder for full screen */
        <div className="fullscreen-logo-placeholder">
          <div className="logo-placeholder-text">GLOBAL</div>
          <div className="logo-placeholder-subtitle">INTERIORS</div>
        </div>
      )}

      {/* Invisible spacer block to maintain layout structure */}
      <div className="layout-spacer"></div>

      {/* Scroll indicators positioned at bottom center */}
      {isReady && (
        <div className="scroll-indicators-container">
          {/* Apple-style scroll hint animation */}
          <div
            className="scroll-hint-container"
            onClick={handleScrollIndicatorClick}
            tabIndex="0"
            role="button"
            aria-label="Scroll down hint"
          >
            <div className="scroll-hint-line"></div>
            <div className="scroll-hint-dot"></div>
          </div>

          {/* Enhanced scroll indicator with Apple-style animation */}
          <div
            className="scroll-indicator"
            onClick={handleScrollIndicatorClick}
            tabIndex="0"
            role="button"
            aria-label="Scroll to explore content"
          >
            <div className="scroll-text">Scroll to explore</div>
            <img
              className="scroll-icon"
              src="assets/images/red_arrow.svg"
              alt="Scroll Down"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default TopFold;
