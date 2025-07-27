// src/Views/Credits/Credits.js - Scroll-driven version
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

  // Calculate dynamic values based on scroll progress
  const getContainerOpacity = () => {
    // Fade in the entire credits section
    if (scrollProgress < 0.1) return 0;
    if (scrollProgress > 0.9) return 1;
    return (scrollProgress - 0.1) / 0.8;
  };

  const getContainerTransform = () => {
    // Slide up effect like Apple product reveals
    if (scrollProgress < 0.1) return "translateY(100vh)";
    if (scrollProgress > 0.9) return "translateY(0)";

    const slideProgress = (scrollProgress - 0.1) / 0.8;
    const translateY = (1 - slideProgress) * 100;
    return `translateY(${translateY}vh)`;
  };

  const getContentOpacity = () => {
    // Content appears after container slide-up
    if (scrollProgress < 0.3) return 0;
    if (scrollProgress > 0.8) return 1;
    return (scrollProgress - 0.3) / 0.5;
  };

  const getContentTransform = () => {
    // Subtle scale and fade for content
    if (scrollProgress < 0.3) return "scale(0.95)";
    if (scrollProgress > 0.8) return "scale(1)";

    const contentProgress = (scrollProgress - 0.3) / 0.5;
    const scale = 0.95 + contentProgress * 0.05;
    return `scale(${scale})`;
  };

  return (
    <div
      ref={containerRef}
      className={`credits-container scroll-driven${hasEntered ? " has-entered" : ""}${isActive ? " active" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        background: "#EEEEEE",
        width: "100%",
        height: "100vh",
        zIndex: 50,
        padding: "120px 0 80px",
        fontFamily: "'Montserrat', 'Helvetica Neue', sans-serif",
        overflowY: "auto",
        opacity: getContainerOpacity(),
        transform: getContainerTransform(),
        transition: isActive
          ? "none"
          : "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <div
        className="credits-content"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "60px 48px",
          position: "relative",
          background: "#FFFFFF",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          opacity: getContentOpacity(),
          transform: getContentTransform(),
          transition: isActive
            ? "none"
            : "opacity 0.3s ease, transform 0.3s ease",
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
