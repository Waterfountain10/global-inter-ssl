// src/Views/Map4.js
import React, {useState, useEffect, useRef} from 'react';
import './Map4.css';

export default function Map4({ advancing, onMount }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('🟢 Map4 mounted with advancing prop:', advancing);
    if (onMount) onMount();
    
    // Start fade-in immediately when component mounts
    setVisible(true);
  }, [advancing, onMount]);

  // Debug advancing state changes
  useEffect(() => {
    console.log('🔄 Map4 advancing state changed to:', advancing);
  }, [advancing]);

  return (
    <div ref={containerRef} className={`map4-container${visible ? ' visible' : ''}${advancing ? ' advancing' : ''}`}>
      {/* Map4 specific overlay - fades in above persistent world map background */}
      <img
        className="map4-overlay"
        src="/assets/images/map4_final.svg"
        alt="Map4 overlay"
      />
      
      <div className="map4-text-bubble">
        <p>
          Using deep learning, we demonstrate that{' '}
          <span className="highlight">geographic proximity</span> and{' '}
          <span className="highlight">degree of globalization</span>{' '}
          significantly correlate with the visual characteristics of indoor spaces.
        </p>
      </div>
    </div>
  );
}