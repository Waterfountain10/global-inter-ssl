// src/Views/TopFold/TopFold.js
import React from "react";
import "./TopFold.css";

export default function TopFold({ progress }) {
  return (
    <section
      className="topfold-container"
      style={{
        opacity: 1 - progress, // fades out as you scroll past 0.1
        transform: `translateY(${progress * -50}px)`,
      }}
    >
      <div className="black-overlay"></div>
      <video
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
    </section>
  );
}
