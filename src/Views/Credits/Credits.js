// src/Views/Credits/Credits.js - Enhanced scroll-driven version
import React, { useEffect, useRef, useState } from "react";
import "./Credits.css";

export default function Credits({
  scrollProgress = 0,
  isActive = false,
  onMount,
}) {
  const containerRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    console.log(
      "🟢 Credits mounted - scrollProgress:",
      scrollProgress,
      "isActive:",
      isActive,
    );
    if (onMount) onMount();
  }, [onMount]);

  // Track when the section first becomes active
  useEffect(() => {
    if (isActive && !hasEntered) {
      setHasEntered(true);
      console.log("📍 Credits entered for first time");
    }
  }, [isActive, hasEntered]);

  // Calculate dynamic values based on scroll progress with enhanced slide-up effect
  const getContainerOpacity = () => {
    // Fade in the entire credits section more gradually
    if (scrollProgress < 0.05) return 0;
    if (scrollProgress > 0.3) return 1;
    return (scrollProgress - 0.05) / 0.25;
  };

  const getContainerTransform = () => {
    // Enhanced slide up effect - starts from completely off-screen
    if (scrollProgress < 0.05) return "translateY(100vh)";
    if (scrollProgress > 0.4) return "translateY(0)";

    // More dramatic slide-up animation
    const slideProgress = (scrollProgress - 0.05) / 0.35;
    const easeOut = 1 - Math.pow(1 - slideProgress, 3); // Cubic easing
    const translateY = (1 - easeOut) * 100;
    return `translateY(${translateY}vh)`;
  };

  const getContentOpacity = () => {
    // Content appears after container slide-up with longer fade
    if (scrollProgress < 0.2) return 0;
    if (scrollProgress > 0.6) return 1;
    return (scrollProgress - 0.2) / 0.4;
  };

  const getContentTransform = () => {
    // Enhanced scale and position animation for content
    if (scrollProgress < 0.2) {
      return "translate(-50%, -30%) scale(0.8)"; // Start higher and smaller
    }
    if (scrollProgress > 0.6) {
      return "translate(-50%, -50%) scale(1)"; // End at perfect center
    }

    const contentProgress = (scrollProgress - 0.2) / 0.4;
    const easeOut = 1 - Math.pow(1 - contentProgress, 2); // Quadratic easing

    // Interpolate between start and end positions
    const startY = -30;
    const endY = -50;
    const currentY = startY + (endY - startY) * easeOut;

    const startScale = 0.8;
    const endScale = 1;
    const currentScale = startScale + (endScale - startScale) * easeOut;

    return `translate(-50%, ${currentY}%) scale(${currentScale})`;
  };

  // Calculate background overlay opacity for better visibility
  const getOverlayOpacity = () => {
    if (scrollProgress < 0.1) return 0;
    if (scrollProgress > 0.5) return 1;
    return (scrollProgress - 0.1) / 0.4;
  };

  return (
    <div
      ref={containerRef}
      className={`credits-container scroll-driven${hasEntered ? " has-entered" : ""}${isActive ? " active" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 50,
        fontFamily: "'Montserrat', 'Helvetica Neue', sans-serif",
        overflow: "hidden", // Prevent scrolling issues
        opacity: getContainerOpacity(),
        transform: getContainerTransform(),
        transition: isActive
          ? "none"
          : "opacity 0.4s ease, transform 0.4s ease",
        pointerEvents: scrollProgress > 0.3 ? "auto" : "none", // Enable interaction only when visible
      }}
    >
      {/* Background overlay for better contrast */}
      <div
        className="credits-overlay scroll-responsive"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#EEEEEE",
          opacity: getOverlayOpacity(),
          transition: isActive ? "none" : "opacity 0.3s ease",
        }}
      />

      {/* Credits content bubble with enhanced visibility */}
      <div
        className="credits-content-bubble scroll-responsive"
        style={{
          opacity: getContentOpacity(),
          transform: getContentTransform(),
          transition: isActive
            ? "none"
            : "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <div className="credits-grid">
          {/* Description Section */}
          <div className="credits-section">
            <h2 className="credits-heading">Description</h2>
            <p className="credits-text">
              Globalization is claimed to have a homogenizing effect, reducing
              pronounced local cultural differences. Indoor living spaces are
              among the most vivid expressions of local culture, yet they remain
              underexplored in this context. Our visual AI framework, utilizing
              a unique dataset of over 400,000 Airbnb images, investigates the
              diversity in living spaces across 80 cities. By employing deep
              learning classification models, Gradient-Weighted Class Activation
              Mapping techniques, and statistical analysis, we demonstrate that
              geographic proximity and the extent of globalization significantly
              correlate with the visual characteristics of indoor spaces (R =
              0.19 to 0.32).
            </p>
            <p className="credits-text">
              Our results indicate that despite global pressures and trends
              towards cultural homogenization, local identities and cultural
              distinctions nevertheless remain.
            </p>
          </div>

          {/* Team Section */}
          <div className="credits-section">
            <h2 className="credits-heading">Team</h2>

            <h3 className="team-org">MIT Senseable City Lab</h3>
            <div className="team-member">
              <span className="member-name">Carlo Ratti</span>
              <span className="member-role">Director</span>
            </div>

            <div className="team-member">
              <span className="member-name">Martina Mazzarello</span>
              <span className="member-role">Research Lead</span>
            </div>
            <div className="team-member">
              <span className="member-name">Fabio Duarte</span>
            </div>
            <div className="team-member">
              <span className="member-name">Javad Eshtiyagh</span>
            </div>
            <div className="team-member">
              <span className="member-name">Mikita Klimenka</span>
            </div>
            <div className="team-member">
              <span className="member-name">Paolo Santi</span>
            </div>
            <div className="team-member">
              <span className="member-name">Rohit Sanatani</span>
            </div>

            <div className="team-member">
              <span className="member-name">David Lafond</span>
              <span className="member-role">Visualization & Web</span>
            </div>

            <h3 className="team-org">Tsinghua University</h3>
            <div className="team-member">
              <span className="member-name">Yanhua Yao</span>
            </div>

            <h3 className="team-org">University of Toronto</h3>
            <div className="team-member">
              <span className="member-name">Richard Florida</span>
            </div>
          </div>

          {/* Publications Section */}
          <div className="credits-section">
            <h2 className="credits-heading">Publications</h2>
            <p className="publication-authors">
              Mazzarello M., Klimenka M., Sanatani R., Eshtiyagh J., Yao Y.,
              Santi P., Duarte F., Florida R., Ratti C. (2025)
            </p>
            <a
              href="https://www.nature.com"
              className="publication-title"
              target="_blank"
              rel="noopener noreferrer"
            >
              A Geography of indoors for analyzing global ways of living using
              computer vision
            </a>
            <p className="publication-venue">Scientific Reports</p>

            <h2 className="credits-heading press-heading">Press</h2>
            <a href="mailto:senseable-press@mit.edu" className="press-download">
              Download the Press Material
            </a>
            <p className="press-usage">
              The material on this website can be used freely in any publication
              provided that:
            </p>
            <ol className="press-conditions">
              <li>
                it is duly credited as a project by the MIT Senseable City Lab
              </li>
              <li>
                a PDF copy of the publication is sent to senseable-press@mit.edu
              </li>
            </ol>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <div className="contact-info">
            <h2 className="credits-heading">Contact</h2>
            <p className="contact-label">For more information,</p>
            <a
              href="mailto:senseable-contacts@mit.edu"
              className="contact-email"
            >
              senseable-contacts@mit.edu
            </a>

            <div className="lab-logo">
              <img
                src="/assets/images/scl_logo_black.png"
                alt="Senseable City Lab"
              />
            </div>

            <a
              href="https://senseable.mit.edu/accessibility"
              className="accessibility-link"
            >
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
