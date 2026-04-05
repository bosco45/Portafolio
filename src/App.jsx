// App.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import Spline from '@splinetool/react-spline'

export default function App() {
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showHome, setShowHome] = useState(false)
  const splineRef = useRef(null)
  const pulseTimeoutRef = useRef(null)
  const transitionTimeoutRef = useRef(null)

  // Circle navigation state - CORRECTED 4 positions
  const [activeSection, setActiveSection] = useState('INDEX')
  const sectionAngles = {
    'INDEX': 270,   // Top (12 o'clock)
    'WORK': 330,    // Top-right (between INDEX and ABOUT)
    'ABOUT': 30,    // Right side (was 20, adjusted for 4-node balance)
    'CONTACT': 150  // Bottom-left (consistent with original reference)
  }
  const [currentAngle, setCurrentAngle] = useState(sectionAngles['INDEX'])
  const animationRef = useRef(null)

  const circleRadius = 110 // Increased from 110 (+15%)
  const centerX = 130 // Adjusted for larger circle
  const centerY = 130

  const animateDot = useCallback((fromAngle, toAngle, duration = 700) => {
    const startTime = performance.now()
    let diff = ((toAngle - fromAngle) % 360 + 360) % 360
    if (diff > 180) diff = diff - 360
    const targetDiff = diff
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(1, elapsed / duration)
      const easeProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
      const newAngle = fromAngle + targetDiff * easeProgress
      setCurrentAngle(((newAngle % 360) + 360) % 360)
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setCurrentAngle(((toAngle % 360) + 360) % 360)
        animationRef.current = null
      }
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    animationRef.current = requestAnimationFrame(animate)
  }, [])

  const handleSectionClick = useCallback((section) => {
    setActiveSection(section)
    const newAngle = sectionAngles[section]
    animateDot(currentAngle, newAngle)
  }, [animateDot, currentAngle])

  const getDotPosition = (angleDeg) => {
    const angleRad = (angleDeg * Math.PI) / 180
    const x = centerX + circleRadius * Math.cos(angleRad)
    const y = centerY + circleRadius * Math.sin(angleRad)
    return { x, y }
  }

  const onLoad = (splineApp) => {
    splineRef.current = splineApp
    
    if (splineApp.camera) {
      splineApp.camera.position.set(0, 0, 1)
      splineApp.camera.lookAt(0, 0, 0)
    }
    
    setIsLoaded(true)
  }

  const handleSphereMouseEnter = () => {
    if (isTransitioning) return
    setHover(true)
    if (splineRef.current) {
      splineRef.current.emitEvent('sphereHoverStart')
    }
  }

  const handleSphereMouseLeave = () => {
    if (isTransitioning) return
    setHover(false)
    if (splineRef.current) {
      splineRef.current.emitEvent('sphereHoverEnd')
    }
  }

  const handleSphereClick = () => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setActive(true)

    if (splineRef.current) {
      splineRef.current.emitEvent('portalActivate')
    }

    pulseTimeoutRef.current = setTimeout(() => {
      setActive(false)
      
      if (splineRef.current) {
        splineRef.current.emitEvent('sphereDissolve')
      }
    }, )

    transitionTimeoutRef.current = setTimeout(() => {
      setShowHome(true)
    }, 800)
  }

  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current)
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const dotPos = getDotPosition(currentAngle)

  return (
    <>
      {/* Splash screen - completely unchanged */}
      <div style={{
        ...styles.splashScreen,
        ...(isTransitioning && styles.splashScreenExit)
      }}>
        <div style={styles.container}>
          <div 
            style={{
              ...styles.sceneWrapper,
              ...(isLoaded && styles.sceneWrapperLoaded),
              ...(isTransitioning && styles.sceneWrapperExit)
            }}
          >
            <div
              style={{
                ...styles.scene,
                ...(hover && styles.sceneHover),
                ...(active && styles.sceneActive),
                ...(isTransitioning && styles.sceneExit)
              }}
            >
              <div 
                style={styles.sphereClickArea}
                onMouseEnter={handleSphereMouseEnter}
                onMouseLeave={handleSphereMouseLeave}
                onClick={handleSphereClick}
              >
                <Spline 
                  scene="/scene.splinecode" 
                  onLoad={onLoad}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              ...styles.enter,
              ...(hover && styles.enterHover),
              ...(active && styles.enterActive),
              ...(isTransitioning && styles.enterExit)
            }}
          >
            ENTER
          </div>
        </div>
      </div>

      {/* Home page - Refined with precise typography and spacing */}
      <div style={{
        ...styles.homePage,
        ...(showHome && styles.homePageVisible)
      }}>
        {/* Top-left logo + name */}
        <div style={styles.logoArea}>
          <img src="/A.png" alt="Logo" style={styles.logoImage} />
          <span style={styles.logoName}>Annya Fraysheht</span>
        </div>
        
        {/* Top-center headline */}
        <div style={styles.headline}>
          3D Artist specialized in Hard Surface / Real-Time and Digital Experiences
        </div>
        
        {/* Top-right availability - more subtle */}
        <div style={styles.availability}>
          <div style={styles.greenDot}></div>
          <span style={styles.availabilityText}>Currently available for new projects</span>
        </div>
        
        {/* Bottom-left description - tighter and cleaner */}
        <div style={styles.description}>
          <p style={styles.descLine}>Exploring form, motion and interaction through 3D</p>
          <p style={styles.descLine}>Where structure meets motion in real-time 3D experiences</p>
          <p style={styles.descLine}>Creating digital worlds driven by form, light and movement</p>
        </div>
        
        {/* Right side circular navigation - COMPLETE with 4 nodes */}
        <div style={styles.navWrapper}>
          <div style={styles.circleContainer}>
            <svg width="260" height="260" viewBox="0 0 260 260" style={styles.svgCircle}>
              <circle
                cx="130"
                cy="130"
                r={circleRadius}
                fill="none"
                stroke="rgba(240, 235, 216, 0.18)"
                strokeWidth="0.6"
              />
              <circle
                cx={dotPos.x}
                cy={dotPos.y}
                r="5"
                fill="#f0ebd8"
                style={{
                  filter: 'drop-shadow(0 0 5px rgba(240, 235, 216, 0.6))',
                  transition: 'none'
                }}
              />
            </svg>
            
            {/* ALL 4 Navigation labels - correctly positioned and mapped */}
            <div 
              style={{...styles.navLabel, ...styles.navLabelIndex}} 
              onClick={() => handleSectionClick('INDEX')}
            >
              INDEX
            </div>
            <div 
              style={{...styles.navLabel, ...styles.navLabelWork}} 
              onClick={() => handleSectionClick('WORK')}
            >
              WORK
            </div>
            <div 
              style={{...styles.navLabel, ...styles.navLabelAbout}} 
              onClick={() => handleSectionClick('ABOUT')}
            >
              ABOUT
            </div>
            <div 
              style={{...styles.navLabel, ...styles.navLabelContact}} 
              onClick={() => handleSectionClick('CONTACT')}
            >
              CONTACT
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const styles = {
  // Splash screen styles - completely unchanged
  splashScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#000000',
    zIndex: 10,
    transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 1,
    transform: 'scale(1)'
  },
  splashScreenExit: {
    opacity: 0,
    transform: 'scale(1.05)',
    pointerEvents: 'none'
  },
  container: {
    width: '100vw',
    height: '100vh',
    background: '#000000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '48px',
    margin: 0,
    padding: '40px',
    overflow: 'hidden',
    position: 'relative'
  },
  sceneWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '600px',
    opacity: 0,
    transform: 'scale(0.95)',
    transition: 'all 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
  },
  sceneWrapperLoaded: {
    opacity: 1,
    transform: 'scale(1)'
  },
  sceneWrapperExit: {
    opacity: 0,
    transform: 'scale(1.3)',
    filter: 'blur(20px)',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  scene: {
    width: '100%',
    aspectRatio: '1 / 1',
    transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    filter: 'drop-shadow(0 0 0px rgba(0, 150, 255, 0))',
    position: 'relative'
  },
  sphereClickArea: {
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    position: 'relative',
    zIndex: 15
  },
  sceneHover: {
    filter: 'drop-shadow(0 0 25px rgba(0, 150, 255, 0.5)) drop-shadow(0 0 10px rgba(0, 150, 255, 0.8))',
    transform: 'scale(1.02)'
  },
  sceneActive: {
    filter: 'drop-shadow(0 0 40px rgba(0, 150, 255, 0.9)) drop-shadow(0 0 80px rgba(0, 150, 255, 0.6))',
    transform: 'scale(1.05)',
    transition: 'all 0.2s cubic-bezier(0.2, 1.2, 0.4, 1)'
  },
  sceneExit: {
    filter: 'drop-shadow(0 0 60px rgba(0, 150, 255, 0.8)) blur(8px)',
    transform: 'scale(1.15)',
    opacity: 0,
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  enter: {
    position: 'relative',
    color: '#ffffff',
    letterSpacing: '0.5em',
    fontSize: '14px',
    fontFamily: "'Source Code Pro', 'Source Code Variable', monospace",
    fontWeight: 350,
    opacity: 0.55,
    textTransform: 'uppercase',
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    textAlign: 'center',
    zIndex: 20,
    transform: 'translateY(-125px)',
    pointerEvents: 'none',
    transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    textShadow: '0 0 8px rgba(0, 150, 255, 0.3), 0 0 2px rgba(255,255,255,0.5)'
  },
  enterHover: {
    opacity: 0.85,
    letterSpacing: '0.65em',
    textShadow: '0 0 15px rgba(0, 150, 255, 0.7), 0 0 30px rgba(0, 150, 255, 0.4), 0 0 5px rgba(255,255,255,0.8)',
    transition: 'all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
  },
  enterActive: {
    opacity: 1,
    letterSpacing: '0.8em',
    textShadow: '0 0 25px rgba(0, 150, 255, 0.9), 0 0 50px rgba(0, 150, 255, 0.6), 0 0 80px rgba(0, 150, 255, 0.3), 0 0 10px #ffffff',
    transition: 'all 0.2s cubic-bezier(0.2, 1.2, 0.4, 1)'
  },
  enterExit: {
    opacity: 0,
    transform: 'translateY(-145px)',
    filter: 'blur(4px)',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none'
  },
  
  // Home page - Refined minimal design
  homePage: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#0d1321',
    zIndex: 5,
    opacity: 0,
    transform: 'translateY(30px)',
    transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    margin: 0,
    padding: 0,
    overflow: 'hidden'
  },
  homePageVisible: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'auto'
  },
  
  // Top-left logo area - consistent 40px margin
  logoArea: {
    position: 'absolute',
    top: '40px',
    left: '75px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 10
  },
  logoImage: {
    height: '26px',
    width: 'auto',
    opacity: 0.85
  },
  logoName: {
    fontFamily: "'Source Code Pro', 'Source Code Variable', monospace",
    fontWeight: 400,
    fontSize: '15px',
    letterSpacing: '0.08em',
    color: '#f0ebd8',
    opacity: 0.85
  },
  
  // Top-center headline - thinner, less prominent
  headline: {
    position: 'absolute',
    top: '42px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: "'Source Code Pro', 'Source Code Variable', monospace",
    fontWeight: 300,
    fontSize: '13px',
    letterSpacing: '0.03em',
    color: '#f0ebd8',
    opacity: 0.55,
    maxWidth: '900px',
    width: '100%',
    lineHeight: 1.4,
    zIndex: 10,
    whiteSpace: 'nowrap'
  },
  
  // Top-right availability - smaller, more subtle
  availability: {
    position: 'absolute',
    top: '38px',
    right: '64px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(240, 235, 216, 0.02)',
    padding: '6px 12px',
    borderRadius: '40px',
    border: '1px solid rgba(217, 240, 216, 0.05)',
    zIndex: 10
  },
  greenDot: {
    width: '5px',
    height: '5px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    boxShadow: '0 0 4px #10b981',
    animation: 'pulseGreen 2s infinite'
  },
  availabilityText: {
    fontFamily: "'Source Code Pro', 'Source Code Variable', monospace",
    fontWeight: 300,
    fontSize: '11px',
    letterSpacing: '0.02em',
    color: '#f0ebd8',
    opacity: 0.6
  },
  
  // Bottom-left description - tighter and cleaner
  description: {
    position: 'absolute',
    left: '80px',
    bottom: '120px',
    maxWidth: '440px',
    zIndex: 10
  },
  descLine: {
    fontFamily: "'Source Code Pro', 'Source Code Variable', monospace",
    fontWeight: 300,
    fontSize: '14px',
    lineHeight: 1.55,
    letterSpacing: '0.01em',
    color: '#f0ebd8',
    opacity: 0.75,
    marginBottom: '10px'
  },
  
  // Right side circular navigation - repositioned for balance
  navWrapper: {
    position: 'absolute',
    right: '110px',
    top: '70%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10
  },
  
  circleContainer: {
    position: 'relative',
    width: '200px',
    height: '200px'
  },
  svgCircle: {
    width: '100%',
    height: '100%',
    display: 'block'
  },
  navLabel: {
    position: 'absolute',
    fontFamily: "'Source Code Pro', 'Source Code Variable', monospace",
    fontSize: '10px',
    letterSpacing: '0.2em',
    fontWeight: 350,
    color: '#f0ebd8',
    opacity: 0.65,
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    whiteSpace: 'nowrap'
  },
  // NEW: INDEX label at top (12 o'clock)
  navLabelIndex: {
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)'
  },
  // WORK label at top-right (between INDEX and ABOUT)
  navLabelWork: {
    top: '50%',
    right: '197px',
    transform: 'translateY(-50%)'
  },
  // ABOUT label on the right side
  navLabelAbout: {
    top: '50%',
    right: '-40px',
    transform: 'translateY(-50%)'
  },
  // CONTACT label at bottom
  navLabelContact: {
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)'
  }
}

// Add keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulseGreen {
    0% {
      opacity: 0.5;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.3);
    }
    70% {
      opacity: 0.8;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0);
    }
    100% {
      opacity: 0.5;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
  
  /* Hover effects for navigation */
  .nav-label-hover:hover {
    opacity: 1 !important;
  }
  
  /* Responsive adjustments */
  @media (max-width: 1280px) {
    .headline {
      font-size: 10px;
      max-width: 400px;
    }
    .desc-line {
      font-size: 13px;
    }
    .nav-wrapper {
      right: 50px;
      transform: translateY(-50%) scale(0.95);
    }
    .description {
      left: 64px;
      bottom: 100px;
      max-width: 400px;
    }
  }
  
  @media (max-width: 1024px) {
    .logo-area {
      top: 30px;
      left: 40px;
    }
    .headline {
      display: none;
    }
    .availability {
      top: 28px;
      right: 40px;
    }
    .description {
      left: 40px;
      bottom: 80px;
      max-width: 340px;
    }
    .desc-line {
      font-size: 12px;
      margin-bottom: 8px;
    }
    .nav-wrapper {
      right: 30px;
      transform: translateY(-50%) scale(0.85);
    }
    .logo-name {
      font-size: 13px;
    }
  }
  
  @media (max-width: 768px) {
    .description {
      left: 30px;
      bottom: 60px;
      max-width: 280px;
    }
    .desc-line {
      font-size: 11px;
      margin-bottom: 6px;
    }
    .nav-wrapper {
      right: 20px;
      transform: translateY(-50%) scale(0.75);
    }
    .logo-name {
      font-size: 11px;
    }
    .availability-text {
      font-size: 8px;
    }
    .logo-area {
      gap: 8px;
    }
    .logo-image {
      height: 20px;
    }
  }
`;
document.head.appendChild(styleSheet);