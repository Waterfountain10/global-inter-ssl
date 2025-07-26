// src/Views/Map2.js
import React, {useState, useEffect, useRef} from 'react';
import './Map2.css';

export default function Map2({ advancing, onMount }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('🟢 Map2 mounted with advancing prop:', advancing);
    if (onMount) onMount();
    
    // Start fade-in immediately when component mounts
    setVisible(true);
  }, [advancing, onMount]);

  // Debug advancing state changes
  useEffect(() => {
    console.log('🔄 Map2 advancing state changed to:', advancing);
  }, [advancing]);

  return (
    <div ref={containerRef} className={`map2-container${visible ? ' visible' : ''}${advancing ? ' advancing' : ''}`}>
      {/* Map2 specific overlay - fades in above persistent world map background */}
      <img
        className="map2-overlay"
        src="/assets/images/map2_final.svg"
        alt="Map2 overlay"
      />
      
      <div className="map2-text-bubble">
        <p>
          To answer this, we used a <span className="highlight">visual AI model</span> to analyze a unique
          dataset of over <span className="highlight">400k indoor images</span>.
        </p>
      </div>
    </div>
  );
}