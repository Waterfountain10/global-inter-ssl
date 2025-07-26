import React, { useEffect, useCallback, useRef, useState } from 'react'
import './TopFold.css'

const TopFold = () => {
  const videoRef = useRef(null)
  const [overlayFaded, setOverlayFaded] = useState(false)

  // preventDefault helpers
  const preventDefault = (e) => e.preventDefault()
  const preventScrollKeys = (e) => {
    // space(32), pageUp(33), pageDown(34), end(35), home(36), left(37), up(38), right(39), down(40)
    if ([32,33,34,35,36,37,38,39,40].includes(e.keyCode)) {
      e.preventDefault()
    }
  }

  // lock all scroll/touch/keys
  const lockScroll = () => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'
    document.body.style.overscrollBehavior = 'none'
    window.addEventListener('wheel', preventDefault, { passive: false })
    window.addEventListener('touchmove', preventDefault, { passive: false })
    window.addEventListener('keydown', preventScrollKeys, { passive: false })
  }

  // restore everything
  const unlockScroll = useCallback(() => {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.documentElement.style.overscrollBehavior = ''
    document.body.style.overscrollBehavior = ''
    window.removeEventListener('wheel', preventDefault)
    window.removeEventListener('touchmove', preventDefault)
    window.removeEventListener('keydown', preventScrollKeys)
  }, [])

  const handleScroll = () => {
    // Add slide-up class to trigger animation
    const topfoldContainer = document.querySelector('.topfold-container')
    if (topfoldContainer) {
      topfoldContainer.classList.add('slide-up')
    }
    // Rest of your existing code remains unchanged
    unlockScroll()
    window.scrollTo({
      top: window.innerHeight,
      left: 0,
      behavior: 'smooth'
    })
    setTimeout(() => {
      sessionStorage.setItem('phaseTransition', 'true')
    }, 1200)
    setTimeout(() => {
      sessionStorage.setItem('startTyping', 'true')
    }, 400)
  }

  useEffect(() => {
    // disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    // ensure at top on load
    window.scrollTo(0, 0)
    // lock scroll until handleScroll runs
    lockScroll()
    
    // Remove the setTimeout - video will start immediately via autoPlay

    // cleanup in case unmounted
    return () => {
      unlockScroll()
    }
  }, [unlockScroll])

  return (
    <section className="topfold-container">
      <div className="black-overlay"></div>
      <video
        ref={videoRef}
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

      <div
        className="scroll-indicator"
        onClick={handleScroll}
      >
        <img
          className="scroll-icon"
          src="/assets/images/red_arrow.svg"
          alt="Scroll Down"
        />
      </div>
    </section>
  )
}

export default TopFold