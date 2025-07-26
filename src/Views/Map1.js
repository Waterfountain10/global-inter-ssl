// src/Views/Map1.js
import React, {useState, useEffect, useRef, useCallback} from 'react';
import './Map1.css';

export default function Map1({ advancing, onMount }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);
  
  // inherit and maintain scroll lock from ResearchQuestion
  const preventDefault = (e) => e.preventDefault()
  const preventScrollKeys = (e) => {
    if ([32,33,34,35,36,37,38,39,40].includes(e.keyCode)) {
      e.preventDefault()
    }
  }
  
  const maintainScrollLock = useCallback(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'
    document.body.style.overscrollBehavior = 'none'
    window.addEventListener('wheel', preventDefault, {passive: false})
    window.addEventListener('touchmove', preventDefault, {passive: false})
    window.addEventListener('keydown', preventScrollKeys, {passive: false})
  }, [])

  useEffect(() => {
    console.log('🟢 Map1 mounted with advancing prop:', advancing);
    if (onMount) onMount();
    
    // Start fade-in immediately when component mounts - EXACTLY like Map2/Map3
    setVisible(true);
  }, [advancing, onMount]);

  // Debug advancing state changes - EXACTLY like Map2/Map3
  useEffect(() => {
    console.log('🔄 Map1 advancing state changed to:', advancing);
  }, [advancing]);

  return (
    <div
      ref={containerRef}
      className={`map1-container${visible ? ' visible' : ''}${advancing ? ' advancing' : ''}`}
    >
      {/* Map1 specific overlay - fades in above persistent world map background */}
      <img
        className="map1-overlay"
        src="/assets/images/map1_final.svg"
        alt="Map1 overlay"
      />
      
      <div className="map1-text-bubble">
        <p>
          The question of whether and how global pressures reduce or eliminate{' '}
          <span className="highlight">local cultural distinctiveness</span>{' '}
          has been the subject of considerable research.
        </p>
      </div>
    </div>
  );
}