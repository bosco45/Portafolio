import { useState, useEffect, useRef } from 'react'
import Spline from '@splinetool/react-spline'

export default function App() {
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const splineRef = useRef(null)
  const pulseTimeoutRef = useRef(null)

  const onLoad = (splineApp) => {
    splineRef.current = splineApp
    
    if (splineApp.camera) {
      splineApp.camera.position.set(0, 0, 8)
      splineApp.camera.lookAt(0, 0, 0)
    }
    
    setIsLoaded(true)
  }

  const handleMouseEnter = () => {
    setHover(true)
    if (splineRef.current) {
      splineRef.current.emitEvent('sphereHoverStart')
    }
  }

  const handleMouseLeave = () => {
    setHover(false)
    if (splineRef.current) {
      splineRef.current.emitEvent('sphereHoverEnd')
    }
  }

  const handleClick = () => {
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current)
    }

    setActive(true)

    if (splineRef.current) {
      splineRef.current.emitEvent('textClick')
    }

    pulseTimeoutRef.current = setTimeout(() => {
      setActive(false)
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div style={styles.container}>
      <div 
        style={{
          ...styles.sceneWrapper,
          ...(isLoaded && styles.sceneWrapperLoaded)
        }}
      >
        <div
          style={{
            ...styles.scene,
            ...(hover && styles.sceneHover)
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Spline 
            scene="/scene.splinecode" 
            onLoad={onLoad}
          />
        </div>
      </div>

      <button
        style={{
          ...styles.enter,
          ...(hover && styles.enterHover),
          ...(active && styles.enterActive)
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        ENTER
      </button>
    </div>
  )
}

const styles = {
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
    overflow: 'hidden'
  },
  sceneWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '600px',
    opacity: 0,
    transform: 'scale(0.95)',
    transition: 'all 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    marginBottom: '-120px' // ← SOLO ESTA LÍNEA AÑADIDA - Sube el ENTER
  },
  sceneWrapperLoaded: {
    opacity: 1,
    transform: 'scale(1)'
  },
  scene: {
    width: '100%',
    aspectRatio: '1 / 1',
    transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    filter: 'drop-shadow(0 0 0px rgba(0, 150, 255, 0))'
  },
  sceneHover: {
    filter: 'drop-shadow(0 0 25px rgba(0, 150, 255, 0.5)) drop-shadow(0 0 10px rgba(0, 150, 255, 0.8))',
    transform: 'scale(1.02)'
  },
  enter: {
    all: 'unset',
    color: '#ffffff',
    letterSpacing: '0.5em',
    fontSize: '14px',
    fontFamily: "'Inter', 'Helvetica Neue', 'Segoe UI', sans-serif",
    fontWeight: 400,
    opacity: 0.45,
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    textTransform: 'uppercase',
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    textAlign: 'center',
    animation: 'fadeFloat 2.5s ease-in-out infinite alternate'
  },
  enterHover: {
    opacity: 0.85,
    letterSpacing: '0.6em',
    textShadow: '0 0 6px rgba(255,255,255,0.4), 0 0 12px rgba(0,150,255,0.3), 0 0 20px rgba(0,150,255,0.2)',
    animation: 'none',
    transform: 'translateY(-2px)'
  },
  enterActive: {
    opacity: 1,
    letterSpacing: '0.7em',
    textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(0,150,255,0.9), 0 0 35px rgba(0,150,255,0.7)',
    transform: 'scale(1.03) translateY(-3px)',
    transition: 'all 0.2s cubic-bezier(0.2, 1.2, 0.4, 1)',
    animation: 'none'
  }
}