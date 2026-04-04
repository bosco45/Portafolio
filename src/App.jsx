// App.jsx
import { useState, useEffect, useRef } from 'react'
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

  const onLoad = (splineApp) => {
    splineRef.current = splineApp
    
    if (splineApp.camera) {
      splineApp.camera.position.set(0, 0, 8)
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
    }, 300)

    transitionTimeoutRef.current = setTimeout(() => {
      setShowHome(true)
    }, 800)
  }

  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current)
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    }
  }, [])

  return (
    <>
      {/* Pantalla de carga con esfera */}
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

          {/* ENTER text - ahora con glow protagonista y animación reactiva */}
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

      {/* Home page que se revela después */}
      <div style={{
        ...styles.homePage,
        ...(showHome && styles.homePageVisible)
      }}>
        <div style={styles.homeContent}>
          <h1 style={styles.homeTitle}>Welcome</h1>
          <p style={styles.homeSubtitle}>to the digital realm</p>
          <div style={styles.homeCards}>
            <div style={styles.card}>
              <div style={styles.cardIcon}>✨</div>
              <h3>Immersive</h3>
              <p>Experience the future of 3D interaction</p>
            </div>
            <div style={styles.card}>
              <div style={styles.cardIcon}>🚀</div>
              <h3>Cinematic</h3>
              <p>Smooth transitions with premium feel</p>
            </div>
            <div style={styles.card}>
              <div style={styles.cardIcon}>💎</div>
              <h3>Luxurious</h3>
              <p>Polished digital craftsmanship</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const styles = {
  // Pantalla de carga
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
    fontFamily: "'Inter', 'Helvetica Neue', 'Segoe UI', sans-serif",
    fontWeight: 400,
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
  
  // Home page
  homePage: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #0d0d0d 50%, #0a0a0a 100%)',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transform: 'translateY(30px)',
    transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none'
  },
  homePageVisible: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'auto'
  },
  homeContent: {
    textAlign: 'center',
    padding: '40px',
    maxWidth: '1200px',
    width: '100%'
  },
  homeTitle: {
    fontSize: '72px',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #60a5fa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '16px',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    letterSpacing: '-0.02em',
    animation: 'fadeInUp 0.8s ease-out 0.2s both'
  },
  homeSubtitle: {
    fontSize: '20px',
    color: '#9ca3af',
    marginBottom: '60px',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    animation: 'fadeInUp 0.8s ease-out 0.4s both'
  },
  homeCards: {
    display: 'flex',
    gap: '32px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    animation: 'fadeInUp 0.8s ease-out 0.6s both'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '32px 24px',
    width: '250px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'transform 0.3s ease, border-color 0.3s ease',
    cursor: 'pointer'
  },
  cardIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  }
}

// Estilos globales
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
  
  .card:hover {
    transform: translateY(-8px);
    border-color: rgba(192, 132, 252, 0.3);
  }
`;
document.head.appendChild(styleSheet);