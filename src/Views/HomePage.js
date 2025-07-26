// src/Views/HomePage.js
import React, {useState, useEffect, useCallback} from 'react';
import './HomePage.css';
import TopFold from './TopFold';
import ResearchQuestion from './ResearchQuestion';
import Map1 from './Map1';
import Map2 from './Map2';
import Map3 from './Map3';
import Map4 from './Map4';
import Map5 from './Map5';
import Map6 from './Map6';
import Credits from './Credits';

export default function HomePage() {
  const [stage, setStage] = useState(0); // 0 → TopFold/ResearchQuestion, 1 → Map1, 2 → Map2, 3 → Map3, 4 → Map4, 5 → Map5, 6 → Map6, 7 → Credits
  const [advancing, setAdvancing] = useState(false);
  const [transitionLocked, setTransitionLocked] = useState(false); // Global transition lock
  const [creditsScrollProgress, setCreditsScrollProgress] = useState(0); // Progressive reveal tracker

  // Phase Management System
  const [currentPhase, setCurrentPhase] = useState('TOPFOLD'); // TOPFOLD | RESEARCH_TYPING | MAP_TRANSITIONS

  // unlock scroll helper
  const unlockScroll = useCallback(() => {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.documentElement.style.overscrollBehavior = ''
    document.body.style.overscrollBehavior = ''
    const preventDefault = (e) => e.preventDefault()
    const preventScrollKeys = (e) => {
      if ([32,33,34,35,36,37,38,39,40].includes(e.keyCode)) {
        e.preventDefault()
      }
    }
    window.removeEventListener('wheel', preventDefault)
    window.removeEventListener('touchmove', preventDefault)
    window.removeEventListener('keydown', preventScrollKeys)
  }, [])

  // Phase 1 → 2: TOPFOLD to RESEARCH_TYPING (triggered at scroll midpoint)
  useEffect(() => {
    const checkPhaseTransition = () => {
      if (sessionStorage.getItem('phaseTransition') === 'true' && currentPhase === 'TOPFOLD') {
        sessionStorage.removeItem('phaseTransition')
        setCurrentPhase('RESEARCH_TYPING')
      }
    }
    const interval = setInterval(checkPhaseTransition, 50)
    return () => clearInterval(interval)
  }, [currentPhase])

  // Search bar materialization (triggered after scroll completion)
  useEffect(() => {
    const checkTypingStart = () => {
      if (sessionStorage.getItem('startTyping') === 'true' && currentPhase === 'RESEARCH_TYPING') {
        // startTyping signal is handled by ResearchQuestion component
        // no need to remove here as ResearchQuestion will handle it
      }
    }
    const interval = setInterval(checkTypingStart, 50)
    return () => clearInterval(interval)
  }, [currentPhase])

  // Phase 2 → 3: RESEARCH_TYPING to MAP_TRANSITIONS (when search bar completes pinning)
  useEffect(() => {
    const checkSearchComplete = () => {
      if (sessionStorage.getItem('showMap1') === 'true' && currentPhase === 'RESEARCH_TYPING') {
        sessionStorage.removeItem('showMap1')
        setCurrentPhase('MAP_TRANSITIONS')
        setStage(1) // show Map1
      }
    }
    const interval = setInterval(checkSearchComplete, 100)
    return () => clearInterval(interval)
  }, [currentPhase])

  // Global scroll management system - standardized sensitivity and timing
  useEffect(() => {
    if (currentPhase !== 'MAP_TRANSITIONS' || transitionLocked) return;

    let scrollTimeout = null;
    let creditsRevealProgress = 0;
    const SCROLL_THRESHOLD = 50; // Standardized scroll distance requirement
    const CREDITS_REVEAL_RANGE = 300; // Pixels needed to fully reveal credits

    const handleGlobalScroll = (e) => {
      console.log('🔍 SCROLL EVENT DETECTED - deltaY:', e.deltaY, 'stage:', stage, 'advancing:', advancing, 'transitionLocked:', transitionLocked);
      
      // Handle Credits progressive reveal at Map6
      if (stage === 6 && !advancing) {
        e.preventDefault();
        
        // Track cumulative scroll for progressive reveal
        creditsRevealProgress += e.deltaY;
        creditsRevealProgress = Math.max(0, creditsRevealProgress); // Prevent negative values
        
        const scrollProgress = Math.min(creditsRevealProgress / CREDITS_REVEAL_RANGE, 1);
        setCreditsScrollProgress(scrollProgress);
        
        console.log('🎯 Credits reveal progress:', scrollProgress, 'cumulative scroll:', creditsRevealProgress);
        
        // Trigger Credits mounting when reveal begins
        if (scrollProgress > 0.1 && stage !== 7) {
          console.log('🚀 Triggering Credits mount for progressive reveal');
          sessionStorage.setItem('creditsTransition', 'true');
          setStage(7);
        }
        
        // Lock credits in final position when fully revealed
        if (scrollProgress >= 1) {
          setTransitionLocked(true);
          setTimeout(() => unlockScroll(), 1000);
          console.log('🔒 Credits fully revealed and locked');
        }
        
        return; // Skip normal scroll handling during credits reveal
      }
      
      // Standard scroll detection for other stages
      if (Math.abs(e.deltaY) > SCROLL_THRESHOLD && e.deltaY > 0 && !advancing) {
        if (scrollTimeout) {
          console.log('⚠️ Scroll blocked by timeout');
          return; // Prevent multiple rapid triggers
        }
        
        console.log('🎯 Scroll detected on stage', stage, 'deltaY:', e.deltaY);
        
        // IMMEDIATE VISUAL FEEDBACK: Apply advancing class directly to DOM
        if (stage === 1) {
          const map1Container = document.querySelector('.map1-container');
          console.log('🔍 Map1 container found:', !!map1Container);
          if (map1Container) {
            console.log('🔍 Adding advancing class to Map1');
            map1Container.classList.add('advancing');
            console.log('🔍 Map1 classes after addition:', map1Container.className);
          }
        }
        
        setTransitionLocked(true); // Lock all transitions
        scrollTimeout = setTimeout(() => {
          scrollTimeout = null;
        }, 2000); // Extended throttle for consistency

        // Determine current stage and advance accordingly with enhanced debugging
        if (stage === 1) {
          console.log('🔥 Advancing from Map1 to Map2');
          handleAdvance();
        } else if (stage === 2) {
          console.log('🔥 Advancing from Map2 to Map3');
          handleAdvanceToMap3();
        } else if (stage === 3) {
          console.log('🔥 Advancing from Map3 to Map4');
          handleAdvanceToMap4();
        } else if (stage === 4) {
          console.log('🔥 Advancing from Map4 to Map5');
          handleAdvanceToMap5();
        } else if (stage === 5) {
          console.log('🔥 Advancing from Map5 to Map6');
          handleAdvanceToMap6();
        } else {
          console.log('⚠️ Scroll detected but no valid stage transition available. Current stage:', stage);
        }
      } else {
        console.log('🚫 Scroll conditions not met - threshold:', Math.abs(e.deltaY) > SCROLL_THRESHOLD, 'direction:', e.deltaY > 0, 'not advancing:', !advancing);
      }
    };

    window.addEventListener('wheel', handleGlobalScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleGlobalScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [currentPhase, stage, advancing, transitionLocked, unlockScroll]);

  // unlock scroll only after Credits appears - ensure Credits is final stage
  useEffect(() => {
    if (stage === 7) {
      const timer = setTimeout(() => {
        console.log('🔓 Unlocking scroll after Credits completion');
        unlockScroll()
      }, 2000) // unlock after Credits fade-in completes
      return () => clearTimeout(timer)
    }
  }, [stage, unlockScroll])

  const handleAdvance = () => {
    console.log('🎯 Map1 handleAdvance triggered, setting advancing=true');
    // trigger Map1 slide‑up animation
    setAdvancing(true);
    // Standardized timing: wait for text slide-up completion (1.5s) + buffer (0.5s) = 2s total
    setTimeout(() => {
      console.log('🔄 Transitioning to stage 2, resetting advancing=false');
      setStage(2);
      setAdvancing(false); // Reset advancing state for Map2
      setTransitionLocked(false); // Unlock transitions for next stage
    }, 2000); // Standardized 2-second transition timing
  };

  const handleAdvanceToMap3 = () => {
    console.log('🎯 Map2 handleAdvanceToMap3 triggered, setting advancing=true');
    // trigger Map2 slide‑up animation
    setAdvancing(true);
    // Standardized timing: wait for text slide-up completion (1.5s) + buffer (0.5s) = 2s total
    setTimeout(() => {
      console.log('🔄 Transitioning to stage 3, resetting advancing=false');
      setStage(3);
      setAdvancing(false); // Reset advancing state for Map3
      setTransitionLocked(false); // Unlock transitions for next stage
    }, 2000); // Standardized 2-second transition timing
  };

  const handleAdvanceToMap4 = () => {
    console.log('🎯 Map3 handleAdvanceToMap4 triggered, setting advancing=true');
    // trigger Map3 slide‑up animation - EXACT SAME LOGIC AS Map2→Map3
    setAdvancing(true);
    // Standardized timing: wait for text slide-up completion (1.5s) + buffer (0.5s) = 2s total
    setTimeout(() => {
      console.log('🔄 Transitioning to stage 4, resetting advancing=false');
      setStage(4);
      setAdvancing(false); // Reset advancing state for Map4
      setTransitionLocked(false); // Unlock transitions for next stage
    }, 2000); // Exact same 2-second timing as Map2→Map3
  };

  const handleAdvanceToMap5 = () => {
    console.log('🎯 Map4 handleAdvanceToMap5 triggered, setting advancing=true');
    // trigger Map4 slide‑up animation
    setAdvancing(true);
    // Standardized timing: wait for text slide-up completion (1.5s) + buffer (0.5s) = 2s total
    setTimeout(() => {
      console.log('🔄 Transitioning to stage 5, resetting advancing=false');
      setStage(5);
      setAdvancing(false); // Reset advancing state for Map5
      setTransitionLocked(false); // Unlock transitions for next stage
    }, 2000); // Exact same 2-second timing as other transitions
  };

  const handleAdvanceToMap6 = () => {
    console.log('🎯 Map5 handleAdvanceToMap6 triggered, setting advancing=true');
    // trigger Map5 slide‑up animation
    setAdvancing(true);
    // Standardized timing: wait for text slide-up completion (1.5s) + buffer (0.5s) = 2s total
    setTimeout(() => {
      console.log('🔄 Transitioning to stage 6, resetting advancing=false');
      setStage(6);
      setAdvancing(false); // Reset advancing state for Map6
      setTransitionLocked(false); // Unlock transitions for next stage
    }, 2000); // Exact same 2-second timing as other transitions
  };

  const handleAdvanceToCredits = () => {
    console.log('🎯 Map6 handleAdvanceToCredits triggered, setting advancing=true');
    // trigger search bar slide-up animation FIRST
    sessionStorage.setItem('creditsTransition', 'true')
    // trigger Map6 slide‑up animation
    setAdvancing(true);
    // Standardized timing: wait for text slide-up completion (1.5s) + buffer (0.5s) = 2s total
    setTimeout(() => {
      console.log('🔄 Transitioning to stage 7 (Credits), resetting advancing=false');
      setStage(7);
      setAdvancing(false); // Reset advancing state for Credits
      setTransitionLocked(false); // Unlock transitions for final stage
    }, 2000); // Exact same 2-second timing as other transitions
  };

  return (
    <div className="globalinteriors-homepage">
      {/* Phase-based component authorization */}
      {currentPhase === 'TOPFOLD' && <TopFold />}
      {(currentPhase === 'RESEARCH_TYPING' || currentPhase === 'MAP_TRANSITIONS') && (
        <ResearchQuestion />
      )}
      
      {/* Persistent world map background - only visible during MAP_TRANSITIONS - extends through Map6 */}
      {currentPhase === 'MAP_TRANSITIONS' && (
        <div className="persistent-world-map-background">
          <img
            className="world-map-bg"
            src="/assets/images/world_map_final.svg"
            alt="World map background"
          />
        </div>
      )}

      {/* Industry Standard: Force component remounting with keys for clean state */}
      {currentPhase === 'MAP_TRANSITIONS' && stage === 1 && (
        <Map1 
          key="map1" 
          advancing={advancing}
          onMount={() => console.log('📍 Map1 mounted with advancing=', advancing)}
        />
      )}
      {currentPhase === 'MAP_TRANSITIONS' && stage === 2 && (
        <Map2 
          key="map2" 
          advancing={advancing}
          onMount={() => console.log('📍 Map2 mounted with advancing=', advancing)}
        />
      )}
      {currentPhase === 'MAP_TRANSITIONS' && stage === 3 && (
        <>
          {console.log('🔍 DIAGNOSTIC: Attempting to render Map3, stage=', stage, 'advancing=', advancing)}
          <Map3 
            key="map3" 
            advancing={advancing}
            onMount={() => console.log('📍 Map3 mounted with advancing=', advancing)}
          />
        </>
      )}
      {currentPhase === 'MAP_TRANSITIONS' && stage === 4 && (
        <Map4 
          key="map4" 
          advancing={advancing}
          onMount={() => console.log('📍 Map4 mounted with advancing=', advancing)}
        />
      )}
      {currentPhase === 'MAP_TRANSITIONS' && stage === 5 && (
        <Map5 
          key="map5" 
          advancing={advancing}
          onMount={() => console.log('📍 Map5 mounted with advancing=', advancing)}
        />
      )}
      {currentPhase === 'MAP_TRANSITIONS' && stage === 6 && (
        <Map6 
          key="map6" 
          advancing={advancing}
          onMount={() => console.log('📍 Map6 mounted with advancing=', advancing)}
        />
      )}
      {currentPhase === 'MAP_TRANSITIONS' && stage === 7 && (
        <Credits 
          key="credits" 
          visible={true}
          scrollProgress={creditsScrollProgress}
          onMount={() => console.log('📍 Credits mounted')}
        />
      )}
    </div>
  );
}