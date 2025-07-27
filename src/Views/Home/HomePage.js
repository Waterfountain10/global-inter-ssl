// src/Views/HomePage.js
import React, { useState, useEffect } from "react";
import "./HomePage.css";

import TopFold from "../TopFold/TopFold";
import ResearchQuestion from "../ResearchQuestion/ResearchQuestion";
import Map1 from "../Map1/Map1";
import Map2 from "../Map2/Map2";
import Map3 from "../Map3/Map3";
import Map4 from "../Map4/Map4";
import Map5 from "../Map5/Map5";
import Map6 from "../Map6/Map6";
import Credits from "../Credits/Credits";

export default function HomePage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      setProgress(scrollTop / totalHeight);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sectionProgress = ([start, end]) => {
    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
  };

  // Add fade logic: 0 outside range
  const fade = (range) => {
    const p = sectionProgress(range);
    if (p <= 0 || p >= 1) return 0;
    return p;
  };

  const sections = {
    topFold: [0, 0.1],
    researchQuestion: [0.1, 0.2],
    map1: [0.2, 0.3],
    map2: [0.3, 0.4],
    map3: [0.4, 0.5],
    map4: [0.5, 0.6],
    map5: [0.6, 0.7],
    map6: [0.7, 0.85],
    credits: [0.85, 1],
  };

  return (
    <div className="scroll-container">
      <div className="sticky-viewport">
        <TopFold progress={fade(sections.topFold)} />
        <ResearchQuestion progress={fade(sections.researchQuestion)} />

        <div className="persistent-world-map-background">
          <img
            className="world-map-bg"
            src="/assets/images/world_map_final.svg"
            alt="World map background"
          />
        </div>

        <Map1 progress={fade(sections.map1)} />
        <Map2 progress={fade(sections.map2)} />
        <Map3 progress={fade(sections.map3)} />
        <Map4 progress={fade(sections.map4)} />
        <Map5 progress={fade(sections.map5)} />
        <Map6 progress={fade(sections.map6)} />

        <Credits progress={fade(sections.credits)} />
      </div>
    </div>
  );
}
