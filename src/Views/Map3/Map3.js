// src/Views/Map3.js
import React, {useState, useEffect, useRef} from 'react';
import './Map3.css';

export default function Map3({ advancing, onMount }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('🟢 Map3 mounted with advancing prop:', advancing);
    if (onMount) onMount();
    
    // Start fade-in immediately when component mounts
    setVisible(true);
  }, [advancing, onMount]);

  // Debug advancing state changes
  useEffect(() => {
    console.log('🔄 Map3 advancing state changed to:', advancing);
  }, [advancing]);

  return (
    <div ref={containerRef} className={`map3-container${visible ? ' visible' : ''}${advancing ? ' advancing' : ''}`}>
      {/* Map3 specific overlay - fades in above persistent world map background */}
      <img
        className="map3-overlay"
        src="/assets/images/map3_final.svg"
        alt="Map3 overlay"
      />
      
      <div className="map3-text-bubble">
        <p>
          To study the <span className="highlight">patterns of similarity</span> between kitchens,
          living rooms, bedrooms, and bathrooms across{' '}
          <span className="highlight">80 global cities</span>.
        </p>
      </div>
    </div>
  );
}