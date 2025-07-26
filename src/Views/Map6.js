// src/Views/Map6.js
import React, {useState, useEffect, useRef} from 'react';
import './Map6.css';

export default function Map6({ advancing, onMount }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('🟢 Map6 mounted with advancing prop:', advancing);
    if (onMount) onMount();
    
    // Start fade-in immediately when component mounts
    setVisible(true);
  }, [advancing, onMount]);

  // Debug advancing state changes
  useEffect(() => {
    console.log('🔄 Map6 advancing state changed to:', advancing);
  }, [advancing]);

  return (
    <div ref={containerRef} className={`map6-container${visible ? ' visible' : ''}${advancing ? ' advancing' : ''}`}>
      {/* Map6 specific overlay - fades in above persistent world map background */}
      <img
        className="map6-overlay"
        src="/assets/images/map6_final.svg"
        alt="Map6 overlay"
      />
      
      <div className="map6-text-bubble">
        <p>
          Our findings show that despite global pressures and trends towards cultural homogenization,{' '}
          <span className="highlight">local cultural identities nevertheless remain</span>.
        </p>
      </div>
    </div>
  );
}