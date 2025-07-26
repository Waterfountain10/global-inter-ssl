import React, {useEffect, useRef, useState, useCallback} from 'react'
import './ResearchQuestion.css'

const fullText =
  'Does globalization lead to homogeneous interior spaces around the world?'

export default function ResearchQuestion() {
  const containerRef = useRef(null)
  const [typedText, setTypedText] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [shouldType, setShouldType] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [isPersistent, setIsPersistent] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [creditsTransition, setCreditsTransition] = useState(false)

  // helpers to block/unblock scroll
  const preventDefault = (e) => e.preventDefault()
  const preventScrollKeys = (e) => {
    // space, page up/down, end/home, arrows
    if ([32,33,34,35,36,37,38,39,40].includes(e.keyCode)) {
      e.preventDefault()
    }
  }
  const lockScroll = useCallback(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'
    document.body.style.overscrollBehavior = 'none'
    window.addEventListener('wheel', preventDefault, {passive: false})
    window.addEventListener('touchmove', preventDefault, {passive: false})
    window.addEventListener('keydown', preventScrollKeys, {passive: false})
  }, [])

  // 1) observe entry
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      {threshold: 0.5}
    )
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  // 2) lock during typing, maintain lock until Map1 takes control
  useEffect(() => {
    if (shouldType) lockScroll()
    // never unlock - let Map1 inherit the locked state
  }, [shouldType, lockScroll])

  // 3) start typing after TopFold triggers and section visible
  useEffect(() => {
    if (sessionStorage.getItem('startTyping') === 'true' && isVisible) {
      sessionStorage.removeItem('startTyping')
      setTypedText('')
      setShowSearchBar(true) // show search bar when typing begins
      const t = setTimeout(() => setShouldType(true), 1000)
      return () => clearTimeout(t)
    }
  }, [isVisible])

  // 4) typewriter → pulse → pin → persistent mode → trigger Map1
  useEffect(() => {
    if (!shouldType) return
    ;(async () => {
      for (let i = 0; i < fullText.length; i++) {
        setTypedText((p) => p + fullText[i])
        await new Promise((r) => setTimeout(r, 50))
      }
      setTimeout(() => {
        const btn = document.querySelector('.search-button')
        if (btn) {
          btn.classList.add('clicked')
          setTimeout(() => btn.classList.remove('clicked'), 1000)
        }
        setTimeout(() => {
          setPinned(true)
          // trigger Map1 immediately when pinning starts
          sessionStorage.setItem('showMap1', 'true')
          setTimeout(() => {
            setIsPersistent(true)
          }, 800) // wait for pinning animation to complete
        }, 500)
      }, 500)
    })()
  }, [shouldType])

  // 5) Listen for credits transition trigger
  useEffect(() => {
    const checkCreditsTransition = () => {
      if (sessionStorage.getItem('creditsTransition') === 'true' && isPersistent) {
        sessionStorage.removeItem('creditsTransition')
        setCreditsTransition(true)
      }
    }
    const interval = setInterval(checkCreditsTransition, 50)
    return () => clearInterval(interval)
  }, [isPersistent])

  return (
    <>
      <div
        ref={containerRef}
        className={`research-question${shouldType && !isPersistent ? ' locked' : ''}`}
      >
        {/* Empty container for intersection observer */}
      </div>
      
      {/* Persistent Search Bar - only visible during ResearchQuestion typing and beyond */}
      {showSearchBar && (
        <div className={`persistent-search-bar${pinned ? ' pinned' : ''}${isPersistent ? ' persistent' : ''}${creditsTransition ? ' credits-transition' : ''}`}>
          <span className="typed-text">{typedText}</span>
          <button className="search-button">
            <img
              src="/assets/images/search_button.svg"
              alt="Search"
              className="search-icon"
            />
          </button>
        </div>
      )}
    </>
  )
}