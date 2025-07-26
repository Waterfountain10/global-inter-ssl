// src/Views/Map5.js
import React, {useState, useEffect, useRef} from 'react';
import './Map5.css';

export default function Map5({ advancing, onMount }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('🟢 Map5 mounted with advancing prop:', advancing);
    if (onMount) onMount();
    
    // Start fade-in immediately when component mounts
    setVisible(true);
  }, [advancing, onMount]);

  // Debug advancing state changes
  useEffect(() => {
    console.log('🔄 Map5 advancing state changed to:', advancing);
  }, [advancing]);

  return (
    <div ref={containerRef} className={`map5-container${visible ? ' visible' : ''}${advancing ? ' advancing' : ''}`}>
      {/* Map5 specific overlay - fades in above persistent world map background */}
      <img
        className="map5-overlay"
        src="/assets/images/map5_final.svg"
        alt="Map5 overlay"
      />
      
      <div className="map5-text-bubble">
        <p>
          Revealing that certain <span className="highlight">objects</span> — either through
          their presence or unique appearance — serve as{' '}
          <span className="highlight">markers of visual identity</span>.
        </p>
      </div>
    </div>
  );
}