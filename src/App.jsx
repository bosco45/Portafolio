// App.jsx - Solo modificaciones en el JSX para mejorar mobile (estructura y estilos inline optimizados)
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import Spline from '@splinetool/react-spline'

// Detectar móvil al inicio
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

// Optimized Project Card Component with improved structure - REESTRUCTURACIÓN COMPLETA
const ProjectCard = memo(({ project, isHovered, onMouseEnter, onMouseMove, onMouseLeave, onClick, imageOffset, tilt, isFocused }) => {
  const [showDetails, setShowDetails] = useState(false)
  
  return (
    <div 
      style={{
        ...styles.projectCard,
        ...(isHovered && !isFocused && styles.projectCardHovered),
        transform: tilt 
          ? `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
        transition: isHovered && !isFocused
          ? 'transform 0.4s cubic-bezier(0.2, 0.95, 0.4, 1.05), box-shadow 0.3s ease'
          : 'transform 0.5s cubic-bezier(0.2, 0.95, 0.4, 1.05)'
      }}
      onMouseEnter={() => { onMouseEnter(); setShowDetails(true) }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { onMouseLeave(); setShowDetails(false) }}
      onClick={onClick}
    >
      {/* CAPA 1: IMAGEN PRINCIPAL - MÁS GRANDE, MÁS DOMINANTE */}
      <div style={styles.projectImageContainer}>
        <div 
          style={{
            ...styles.projectImagePlaceholder,
            transform: imageOffset 
              ? `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(1.15)`
              : 'translate(0, 0) scale(1)',
            transition: imageOffset ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.95, 0.4, 1.05)'
          }}
        >
          <img 
            src={project.image} 
            alt={project.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.querySelector('.project-image-text').style.display = 'flex'
            }}
          />
          <span style={{...styles.projectImageText, display: 'none'}} className="project-image-text">
            {project.title.charAt(0)}
          </span>
        </div>
        
        {/* CAPA 2: OVERLAY SEMITRANSPARENTE CON INFO BÁSICA - SIEMPRE VISIBLE */}
        <div style={{
          ...styles.imageOverlay,
          ...(isHovered && styles.imageOverlayHovered)
        }}>
          <h3 style={styles.overlayTitle}>{project.title}</h3>
          <p style={styles.overlayCategory}>{project.category}</p>
        </div>
        
        <div style={styles.cardGlow} />
      </div>
      
      {/* CAPA 3: PANEL FLOTANTE - APARECE DESDE ABAJO SIN ROMPER LAYOUT */}
      <div style={{
        ...styles.floatingPanel,
        ...(showDetails && !isFocused && styles.floatingPanelVisible)
      }}>
        <div style={styles.floatingContent}>
          <p style={styles.floatingDescription}>{project.extendedDescription || project.description}</p>
          
          <div style={styles.floatingTags}>
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} style={styles.floatingTag}>{tag}</span>
            ))}
          </div>
          
          <div style={styles.floatingMeta}>
            <span>{project.year}</span>
            <span style={styles.floatingSeparator}>•</span>
            <span>{project.client}</span>
          </div>
          
          {project.projectUrl && (
            <div style={styles.floatingUrl}>
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={styles.floatingUrlLink}>
                VIEW PROJECT →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

ProjectCard.displayName = 'ProjectCard'

export default function App() {
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showHome, setShowHome] = useState(false)
  const [showAboutImage, setShowAboutImage] = useState(false)
  const [showContactOverlay, setShowContactOverlay] = useState(false)
  const [showWorkPanel, setShowWorkPanel] = useState(false)
  const [exitButtonPosition, setExitButtonPosition] = useState({ x: 0, y: 0 })
  
  // Card focus state
  const [focusedCard, setFocusedCard] = useState(null)
  const [focusTransitioning, setFocusTransitioning] = useState(false)
  const [focusedCard3DLoaded, setFocusedCard3DLoaded] = useState(false)
  
  const splineRef = useRef(null)
  const robotSplineRef = useRef(null)
  const pulseTimeoutRef = useRef(null)
  const transitionTimeoutRef = useRef(null)
  const exitButtonRef = useRef(null)
  const cardRefs = useRef({})
  
  // Horizontal scroll refs and state
  const scrollContainerRef = useRef(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const velocityRef = useRef(0)
  const lastXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const animationFrameRef = useRef(null)
  
  // Card hover states - optimized with useCallback
  const [hoveredCard, setHoveredCard] = useState(null)
  const [cardImageOffsets, setCardImageOffsets] = useState({})
  const [cardTilt, setCardTilt] = useState({})

  // Circle navigation state
  const [activeSection, setActiveSection] = useState('INDEX')
  const sectionAngles = {
    'INDEX': 270,
    'WORK': 330,
    'ABOUT': 30,
    'CONTACT': 150
  }
  const [currentAngle, setCurrentAngle] = useState(sectionAngles['INDEX'])
  const animationRef = useRef(null)

  const circleRadius = 110
  const centerX = 130
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
    
    if (section === 'ABOUT') {
      setShowAboutImage(prev => !prev)
      setShowWorkPanel(false)
      setShowContactOverlay(false)
    } else if (section === 'WORK') {
      setShowWorkPanel(true)
      setShowAboutImage(false)
      setShowContactOverlay(false)
      setTimeout(() => {
        if (exitButtonRef.current) {
          const rect = exitButtonRef.current.getBoundingClientRect()
          setExitButtonPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        }
      }, 50)
    } else if (section === 'CONTACT') {
      setShowContactOverlay(prev => !prev)
      setShowWorkPanel(false)
      setShowAboutImage(false)
    } else {
      setShowWorkPanel(false)
      setShowAboutImage(false)
      setShowContactOverlay(false)
    }
  }, [animateDot, currentAngle])

  const closeWorkPanel = () => {
    setShowWorkPanel(false)
    setTimeout(() => {
      animateDot(currentAngle, sectionAngles['WORK'], 500)
    }, 100)
  }

  const closeAboutImage = () => {
    setShowAboutImage(false)
  }
  
  const closeContactOverlay = () => {
    setShowContactOverlay(false)
  }

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

  const onRobotLoad = (splineApp) => {
    robotSplineRef.current = splineApp
    if (splineApp.camera) {
      splineApp.camera.position.set(0, 0, 1)
      splineApp.camera.lookAt(0, 0, 0)
    }
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
    }, 600)

    transitionTimeoutRef.current = setTimeout(() => {
      setShowHome(true)
    }, 800)
  }

  // Optimized horizontal scroll handlers with passive events
  const handleMouseDown = useCallback((e) => {
    if (focusedCard) return
    if (!scrollContainerRef.current) return
    isDraggingRef.current = true
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft
    lastXRef.current = e.pageX
    lastTimeRef.current = performance.now()
    velocityRef.current = 0
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    scrollContainerRef.current.style.cursor = 'grabbing'
    scrollContainerRef.current.style.userSelect = 'none'
  }, [focusedCard])

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !scrollContainerRef.current || focusedCard) return
    e.preventDefault()
    
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startXRef.current) * 1.2
    const now = performance.now()
    const dt = Math.max(16, now - lastTimeRef.current)
    const instantVelocity = (e.pageX - lastXRef.current) / dt * 12
    
    velocityRef.current = velocityRef.current * 0.6 + instantVelocity * 0.4
    
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk
    
    lastXRef.current = e.pageX
    lastTimeRef.current = now
  }, [focusedCard])

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab'
      scrollContainerRef.current.style.userSelect = 'auto'
    }
    
    const applyInertia = () => {
      if (!scrollContainerRef.current || focusedCard) return
      velocityRef.current *= 0.96
      
      if (Math.abs(velocityRef.current) > 0.3) {
        scrollContainerRef.current.scrollLeft -= velocityRef.current * 2.5
        animationFrameRef.current = requestAnimationFrame(applyInertia)
      } else {
        animationFrameRef.current = null
      }
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    animationFrameRef.current = requestAnimationFrame(applyInertia)
  }, [focusedCard])

  // Optimized card micro-interactions
  const handleCardMouseMove = useCallback((cardId, e) => {
    if (focusedCard) return
    
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5
    
    setCardImageOffsets(prev => ({
      ...prev,
      [cardId]: { x: mouseX * 25, y: mouseY * 18 }
    }))
    
    setCardTilt(prev => ({
      ...prev,
      [cardId]: { rotateX: mouseY * 8, rotateY: mouseX * 8 }
    }))
  }, [focusedCard])

  const handleCardMouseLeave = useCallback((cardId) => {
    if (focusedCard) return
    
    setCardImageOffsets(prev => {
      const newState = { ...prev }
      delete newState[cardId]
      return newState
    })
    setCardTilt(prev => {
      const newState = { ...prev }
      delete newState[cardId]
      return newState
    })
    setHoveredCard(null)
  }, [focusedCard])

  // Card focus handlers
  const handleCardClick = useCallback((project) => {
    if (focusTransitioning || focusedCard) return
    
    setFocusTransitioning(true)
    setFocusedCard(project)
    setFocusedCard3DLoaded(false)
    
    setTimeout(() => {
      setFocusTransitioning(false)
    }, 500)
  }, [focusTransitioning, focusedCard])

  const closeFocusedCard = useCallback(() => {
    if (focusTransitioning) return
    
    setFocusTransitioning(true)
    setFocusedCard(null)
    setFocusedCard3DLoaded(false)
    
    setTimeout(() => {
      setFocusTransitioning(false)
    }, 500)
  }, [focusTransitioning])

  const getSphereTransform = () => {
    if (showWorkPanel && exitButtonPosition.x > 0) {
      const sphereX = 130 + (circleRadius * Math.cos((currentAngle * Math.PI) / 180))
      const sphereY = 130 + (circleRadius * Math.sin((currentAngle * Math.PI) / 180))
      
      const navRect = document.querySelector('.circle-nav-container')?.getBoundingClientRect()
      if (navRect) {
        const actualSphereX = navRect.left + sphereX
        const actualSphereY = navRect.top + sphereY
        
        const deltaX = exitButtonPosition.x - actualSphereX
        const deltaY = exitButtonPosition.y - actualSphereY
        
        return `translate(${deltaX}px, ${deltaY}px) scale(0.8)`
      }
    }
    return 'translate(0, 0) scale(1)'
  }

  // Project data
  const projects = useMemo(() => [
    {
      id: 1,
      title: "NO DAYS OFF",
      category: "ENVIRONMENT / REAL-TIME",
      image: "/1.jpg",
      description: "Gameplay-driven coastal village environment focused on spatial readability, navigation flow, and in-engine performance validation.",
      extendedDescription: "Coastal stilt-village environment designed with a gameplay-first approach. Focused on spatial readability, organic navigation, and functional layout. Each structure operates as a gameplay node, supporting exploration, cover, and interaction. Tested in-engine for scale, sightlines, LOD transitions, draw calls, and stable framerate performance.",
      fullDescription: "Coastal stilt-village environment designed with a gameplay-first approach. Focused on spatial readability, organic navigation, and functional layout. Each structure operates as a gameplay node, supporting exploration, cover, and interaction. Tested in-engine for scale, sightlines, LOD transitions, draw calls, and stable framerate performance.",
      tags: ["ENVIRONMENT", "LEVEL DESIGN", "REAL-TIME"],
      year: "2026",
      client: "Personal Project",
      role: "Environment Artist",
      software: ["Unreal Engine", "Blender"],
      has3DContent: true,
      additionalImages: [
        { id: 1, src: "/2.jpg", caption: "Coastal village overview" },
        { id: 2, src: "/3.jpg", caption: "Gameplay node layout" },
        { id: 3, src: "/4.jpg", caption: "In-engine performance test" }
      ],
      videos: ["/mochila.webm"]
    },
    {
      id: 2,
      title: "COMMERCIAL KITCHEN",
      category: "ENVIRONMENT / REAL-TIME",
      image: "/5.jpg",
      description: "Industrial kitchen environment prepared for Unreal Engine with clean topology, PBR workflow, and optimized real-time performance.",
      extendedDescription: "Industrial Kitchen prepared for Unreal Engine. Modeled with clean topology and optimized geometry, materials follow a PBR workflow. Lighting is configured for real-time playback and 360 walkthroughs, and assets are optimized for interactive performance with LODs, organized UVs and controlled reflection maps.",
      fullDescription: "This image shows the Industrial Kitchen prepared for Unreal Engine. Modeled with clean topology and optimized geometry, materials follow a PBR workflow. Lighting is configured for real-time playback and 360 walkthroughs, and assets are optimized for interactive performance with LODs, organized UVs and controlled reflection maps. The project includes a 360 walkthrough, Unreal viewport captures and a production breakdown.",
      tags: ["ENVIRONMENT", "PBR", "REAL-TIME", "KITCHEN"],
      year: "2025",
      client: "Spittia Solution",
      role: "Environment Artist",
      software: ["Unreal Engine", "Blender"],
      has3DContent: true,
      projectUrl: "https://bosco45.github.io/spittiaSolution/",
      additionalImages: [
        { id: 1, src: "/8.jpg", caption: "360 walkthrough view" },
        { id: 2, src: "/7.jpg", caption: "Kitchen detail - Counter and appliances" },
        { id: 3, src: "/6.jpg", caption: "Kitchen detail - Sink and storage" }
      ],
      
    },
    {
      id: 3,
      title: "ARCHITECTURAL RESIDENCE",
      category: "ENVIRONMENT / ARCHITECTURE",
      image: "/10.jpg",
      description: "High-end architectural environment developed entirely in Blender with premium residential aesthetic and cinematic composition.",
      extendedDescription: "A polished architectural environment built around strong silhouette language and clean spatial hierarchy. Natural wood, stone, glass, and soft interior lighting reinforce a premium residential aesthetic.",
      fullDescription: "This project presents a high-end architectural environment developed entirely in Blender, with a strong emphasis on visual clarity, material fidelity, and cinematic composition. The scene was built to deliver a polished and believable atmosphere, using a restrained palette of natural wood, stone, glass, and soft interior lighting to reinforce a premium residential aesthetic. The environment was designed around strong silhouette language and clean spatial hierarchy, allowing both the interior and exterior views to read clearly from multiple camera positions. Special attention was given to how light shapes form, separates surfaces, and drives focal points across the structure, ensuring that every angle feels intentional and visually resolved. Materials were authored with a physically based approach, focusing on subtle roughness variation, controlled reflections, and surface response consistency to support a grounded final image. Geometry was kept clean and production-conscious, with organized UVs and efficient asset construction to maintain a reliable workflow throughout the scene. The final result showcases a complete environment study that balances architectural design, lighting direction, and presentation quality at a level aligned with AAA visual standards.",
      tags: ["ARCHITECTURE", "BLENDER", "LIGHTING", "PBR"],
      year: "2025",
      client: "Personal Project",
      role: "3D Environment Artist",
      software: ["Blender"],
      has3DContent: false,
      additionalImages: [
        { id: 2, src: "/12.jpg", caption: "Material detail - Wood and stone textures" },
        { id: 3, src: "/11.jpg", caption: "Exterior view - Premium residential aesthetic" }
      ]
    },
    {
      id: 4,
      title: "ORNAMENTAL",
      category: "ENVIRONMENT / LIGHTING",
      image: "/20.jpg",
      description: "Cinematic lighting study focused on a traditional street lamp within a rain-soaked urban scene.",
      extendedDescription: "A focused environment study built around a traditional street lamp as the main focal point, using contrast, atmosphere, and surface response to shape a moody nighttime composition.",
      fullDescription: "This project is a cinematic lighting study built around a traditional street lamp as the main focal point within a rain-soaked urban scene. The composition emphasizes atmosphere, contrast, and depth, using warm emissive light against a colder environment to strengthen mood and visual hierarchy. Special attention was given to wet surfaces, reflections, and material response under low-light conditions, with the final result centered on lighting quality, surface definition, and controlled environmental storytelling.",
      tags: ["ENVIRONMENT", "LIGHTING", "MOOD", "ATMOSPHERIC"],
      year: "2024",
      client: "IMPORLED",
      role: "Environment Artist",
      software: [],
      has3DContent: false,
      additionalImages: [
        { id: 2, src: "/21.jpg", caption: "Secondary environment angle" },
        { id: 3, src: "/22.jpg", caption: "Material and atmosphere detail" }
      ]
    }
  ], [])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

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
      {/* Splash screen */}
      <div style={{
        ...styles.splashScreen,
        ...(isTransitioning && styles.splashScreenExit)
      }}>
        <div style={{
          ...styles.container,
          padding: isMobile ? '20px' : '40px'
        }}>
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
              ...(isTransitioning && styles.enterExit),
              transform: isMobile ? 'translateY(-60px)' : 'translateY(-125px)'
            }}
          >
            ENTER
          </div>
        </div>
      </div>

      {/* Home page */}
      <div style={{
        ...styles.homePage,
        ...(showHome && styles.homePageVisible)
      }}>
        {/* Robot 3D Background - ONLY when showHome is true */}
        {showHome && (
          <div style={styles.robotBackground}>
            <Spline 
              scene="/robotsplinecode" 
              onLoad={onRobotLoad}
            />
          </div>
        )}

        {/* Top-left logo + name */}
        <div style={{
          ...styles.logoArea,
          top: isMobile ? '20px' : '40px',
          left: isMobile ? '20px' : '75px'
        }}>
          <img src="/A.png" alt="Logo" style={styles.logoImage} />
          <span style={styles.logoName}>Annya Fraysheht</span>
        </div>
        
        {/* Top-center headline */}
        <div style={{
          ...styles.headline,
          fontSize: isMobile ? '11px' : '13px',
          whiteSpace: isMobile ? 'normal' : 'nowrap',
          padding: isMobile ? '0 20px' : '0'
        }}>
          3D Artist specialized in Hard Surface / Real-Time and Digital Experiences
        </div>
        
        {/* Top-right availability */}
        <div style={{
          ...styles.availability,
          right: isMobile ? '20px' : '64px',
          top: isMobile ? '20px' : '38px'
        }}>
          <div style={styles.greenDot}></div>
          <span style={styles.availabilityText}>Currently available for new projects</span>
        </div>
        
        {/* Bottom-left description */}
        <div style={{
          ...styles.description,
          left: isMobile ? '20px' : '80px',
          bottom: isMobile ? '40px' : '120px',
          maxWidth: isMobile ? '90%' : '440px'
        }}>
          <p style={styles.descLine}>I approach every project with a production mindset, prioritizing clean topology, smart asset organization, and real-time performance to create environments that work in motion, not just in</p>
          <p style={styles.descLine}>static frames. Each space is developed to stay visually strong, functionally consistent, and coherent across different angles and viewing distances.</p>
          <p style={styles.descLine}>The result is a complete real-time experience where clarity, performance, and visual intent come together seamlessly.</p>
        </div>
        
        {/* Right side circular navigation */}
        <div className="circle-nav-container" style={{
          ...styles.navWrapper,
          ...(showWorkPanel && styles.navWrapperDimmed),
          ...(focusedCard && styles.navWrapperHidden),
          right: isMobile ? '50%' : '110px',
          bottom: isMobile ? '30px' : 'auto',
          top: isMobile ? 'auto' : '70%',
          transform: isMobile ? 'translateX(50%) translateY(0)' : 'translateY(-50%)',
          ...(isMobile && { position: 'fixed', margin: 0, padding: 0 })
        }}>
          <div style={{
            ...styles.circleContainer,
            transform: isMobile ? 'scale(0.65)' : 'scale(1)'
          }}>
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
                  transition: showWorkPanel ? 'all 0.5s cubic-bezier(0.4, 0.2, 0.2, 1)' : 'none',
                  transform: getSphereTransform()
                }}
              />
            </svg>
            
            {/* NAV LABELS WITH BLOOM EFFECT ON HOVER */}
            <div 
              style={{...styles.navLabel, ...styles.navLabelIndex}}
              className="nav-label-bloom"
              onClick={() => handleSectionClick('INDEX')}
            >
              INDEX
            </div>
            <div 
              style={{...styles.navLabel, ...styles.navLabelWork}}
              className="nav-label-bloom"
              onClick={() => handleSectionClick('WORK')}
            >
              WORK
            </div>
            <div 
              style={{...styles.navLabel, ...styles.navLabelAbout}}
              className="nav-label-bloom"
              onClick={() => handleSectionClick('ABOUT')}
            >
              ABOUT
            </div>
            <div 
              style={{...styles.navLabel, ...styles.navLabelContact}}
              className="nav-label-bloom"
              onClick={() => handleSectionClick('CONTACT')}
            >
              CONTACT
            </div>
          </div>
        </div>

        {/* ABOUT Image Overlay - Mejorado para móvil */}
        <div style={{
          ...styles.aboutImageOverlay,
          ...(showAboutImage ? styles.aboutImageVisible : styles.aboutImageHidden),
          ...(isMobile && {
            position: 'fixed',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '320px',
            zIndex: 25
          })
        }}>
          <div style={styles.aboutImageContainer}>
            <button 
              onClick={closeAboutImage}
              style={{
                ...styles.closeButton,
                ...(isMobile && {
                  top: '10px',
                  right: '10px',
                  width: '32px',
                  height: '32px',
                  fontSize: '16px',
                  background: 'rgba(13, 19, 33, 0.9)'
                })
              }}
            >
              ✕
            </button>
            <img src="/About.png" alt="About" style={{
              ...styles.aboutImage,
              ...(isMobile && {
                maxWidth: '100%',
                width: '100%',
                height: 'auto',
                borderRadius: '16px'
              })
            }} />
          </div>
        </div>

        {/* CONTACT Overlay - Mejorado para móvil */}
        <div style={{
          ...styles.contactOverlay,
          ...(showContactOverlay ? styles.contactOverlayVisible : styles.contactOverlayHidden),
          ...(isMobile && {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '320px',
            zIndex: 25
          })
        }}>
          <div style={styles.contactContainer}>
            {/* Close button */}
            <button 
              onClick={closeContactOverlay}
              style={{
                ...styles.contactCloseButton,
                ...(isMobile && {
                  top: '8px',
                  right: '8px',
                  width: '28px',
                  height: '28px',
                  fontSize: '14px'
                })
              }}
              className="contact-close-button"
            >
              ✕
            </button>
            
            {/* Contact Image wrapper */}
            <div style={styles.contactImageWrapper} className="contact-image-wrapper">
              <img src="/contact.png" alt="Contact" style={{
                ...styles.contactImage,
                ...(isMobile && {
                  maxWidth: '100%',
                  width: '100%',
                  height: 'auto'
                })
              }} />
              
              {/* Contact Info - Email and Phone (inside the image) */}
              <div style={{
                ...styles.contactInfoContainer,
                ...(isMobile && {
                  gap: '12px',
                  padding: '0 16px',
                  bottom: '12%'
                })
              }}>
                <a href="mailto:annya.frayshehtd@gmail.com" style={{
                  ...styles.contactEmail,
                  ...(isMobile && { fontSize: '11px' })
                }} className="contact-email">
                  annya.frayshehtd@gmail.com
                </a>
                <a href="tel:+573045658688" style={{
                  ...styles.contactPhone,
                  ...(isMobile && { fontSize: '11px' })
                }} className="contact-phone">
                  +57 304 565 8688
                </a>
              </div>
              
              {/* Social Buttons Container (inside the image) */}
              <div style={{
                ...styles.socialButtonsContainer,
                ...(isMobile && {
                  gap: '20px',
                  bottom: '28%'
                })
              }}>
                {/* Instagram Button */}
                <a 
                  href="https://www.instagram.com/YOUR_INSTAGRAM_USERNAME/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.socialButton}
                  className="social-button"
                >
                  <img src="/instagram.png" alt="Instagram" style={{
                    ...styles.socialIcon,
                    ...(isMobile && { width: '28px' })
                  }} />
                </a>
                
                {/* LinkedIn Button */}
                <a 
                  href="https://www.linkedin.com/in/YOUR_LINKEDIN_USERNAME/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.socialButton}
                  className="social-button"
                >
                  <img src="/linkedin.png" alt="LinkedIn" style={{
                    ...styles.socialIcon,
                    ...(isMobile && { width: '28px' })
                  }} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* WORK Panel - Mejorado para móvil */}
        <div style={{
          ...styles.workPanel,
          ...(showWorkPanel && !focusedCard && styles.workPanelVisible),
          ...(focusedCard && styles.workPanelWithFocus),
          ...(!showWorkPanel && styles.workPanelHidden)
        }}>
          <div 
            ref={scrollContainerRef}
            style={{
              ...styles.workPanelContent,
              ...(focusedCard && styles.workPanelContentBlurred),
              ...(isMobile && {
                padding: '20px 0 20px 20px',
                alignItems: 'flex-start'
              })
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div style={{
              ...styles.projectsContainer,
              padding: isMobile ? '20px 0' : '20px 40px',
              gap: isMobile ? '16px' : '30px'
            }}>
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isHovered={hoveredCard === project.id}
                  onMouseEnter={() => !focusedCard && setHoveredCard(project.id)}
                  onMouseMove={(e) => handleCardMouseMove(project.id, e)}
                  onMouseLeave={() => handleCardMouseLeave(project.id)}
                  onClick={() => handleCardClick(project)}
                  imageOffset={cardImageOffsets[project.id]}
                  tilt={cardTilt[project.id]}
                  isFocused={!!focusedCard}
                />
              ))}
            </div>
          </div>
          
          <button 
            ref={exitButtonRef}
            onClick={closeWorkPanel}
            style={{
              ...styles.workCloseButton,
              ...(focusedCard && styles.workCloseButtonHidden),
              ...(isMobile && {
                bottom: '20px',
                right: '20px',
                opacity: 0.9
              })
            }}
          >
            <img src="/Exit Work.png" alt="Close" style={{
              ...styles.workCloseIcon,
              ...(isMobile && { width: '40px', height: '40px' })
            }} />
          </button>
        </div>

        {/* IMMERSIVE EXPANDED PROJECT VIEW - Mejorado para móvil */}
        {focusedCard && (
          <div style={{
            ...styles.immersiveOverlay,
            ...(focusTransitioning ? styles.immersiveOverlayClosing : styles.immersiveOverlayOpen)
          }}>
            {/* Exit button */}
            <button 
              onClick={closeFocusedCard}
              style={{
                ...styles.immersiveCloseButton,
                ...(isMobile && {
                  top: '16px',
                  right: '16px',
                  width: '40px',
                  height: '40px',
                  opacity: 0.85
                })
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)'
                e.currentTarget.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.opacity = '0.75'
              }}
            >
              <img src="/Exit Work.png" alt="Close" style={{
                ...styles.immersiveCloseIcon,
                ...(isMobile && { width: '36px', height: '36px' })
              }} />
            </button>
            
            {/* Scrollable content */}
            <div style={{
              ...styles.immersiveScrollContainer,
              padding: isMobile ? '80px 16px 40px 16px' : '80px 60px'
            }}>
              <div style={{
                ...styles.immersiveContent,
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '32px' : '80px'
              }}>
                {/* Left side - Gallery */}
                <div style={styles.immersiveMedia}>
                  {/* Main preview - HERO IMAGE with contain for id 4 */}
                  <div style={{
                    ...styles.immersiveImageArea,
                    ...(isMobile && { borderRadius: '16px' })
                  }}>
                    <img
                      src={focusedCard.image}
                      alt={focusedCard.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: focusedCard.id === 4 ? 'contain' : 'cover',
                        ...(focusedCard.id === 4 && { background: '#000000' })
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div style={{...styles.immersiveImagePlaceholder, display: 'none'}}>
                      <span style={styles.immersiveImageText}>{focusedCard.title.charAt(0)}</span>
                    </div>
                    <div style={styles.imageAreaOverlay} />
                  </div>
                  
                  {/* Additional images with varied heights */}
                  {focusedCard.additionalImages && focusedCard.additionalImages.map((img, idx) => {
                    const heightVariants = ['360px', '420px', '380px', '440px']
                    const variantIndex = idx % heightVariants.length
                    return (
                      <div 
                        key={img.id} 
                        style={{
                          ...styles.immersiveAdditionalImageWrapper,
                          animationDelay: `${idx * 0.12}s`,
                          marginTop: isMobile 
                            ? (idx === 0 ? '20px' : (idx % 2 === 0 ? '28px' : '20px'))
                            : (idx === 0 ? '32px' : (idx % 2 === 0 ? '48px' : '28px'))
                        }}
                        className="immersive-additional-image"
                      >
                        <div style={{
                          ...styles.immersiveAdditionalImage,
                          height: isMobile ? 'auto' : heightVariants[variantIndex],
                          ...(isMobile && { aspectRatio: '16 / 9', borderRadius: '12px' })
                        }}>
                          <img
                            src={img.src}
                            alt={img.caption}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: focusedCard.id === 4 ? 'contain' : 'cover',
                              ...(focusedCard.id === 4 && { background: '#000000' })
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                          <div style={{...styles.immersiveAdditionalImagePlaceholder, display: 'none'}}>
                            <span style={styles.immersiveAdditionalImageText}>
                              {img.caption || `Detail ${idx + 1}`}
                            </span>
                          </div>
                          <div style={styles.additionalImageOverlay} />
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Empty state fallback */}
                  {(!focusedCard.additionalImages || focusedCard.additionalImages.length === 0) && (
                    <div style={styles.immersiveAdditionalImageWrapper}>
                      <div style={styles.immersiveAdditionalImage}>
                        <div style={styles.immersiveAdditionalImagePlaceholder}>
                          <span style={styles.immersiveAdditionalImageText}>
                            Additional project visuals
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right side - Text panel WITH IMPROVED HIERARCHY AND SPACING */}
                <div style={styles.immersiveText}>
                  {/* HEADER SECTION */}
                  <div style={{
                    ...styles.textHeaderGroup,
                    ...(isMobile && { paddingBottom: '16px', marginBottom: '0' })
                  }}>
                    <h1 style={{
                      ...styles.immersiveTitle,
                      fontSize: isMobile ? '28px' : '72px',
                      marginBottom: isMobile ? '12px' : '20px'
                    }}>{focusedCard.title}</h1>
                    <p style={{
                      ...styles.immersiveCategory,
                      fontSize: isMobile ? '11px' : '14px'
                    }}>{focusedCard.category}</p>
                  </div>
                  
                  {/* DESCRIPTION SECTION - More readable */}
                  <div style={{
                    ...styles.immersiveDescription,
                    fontSize: isMobile ? '13px' : '15px',
                    lineHeight: isMobile ? 1.6 : 1.75
                  }}>
                    <p>{focusedCard.fullDescription}</p>
                  </div>
                  
                  {/* METADATA SECTION - Reorganized with better spacing */}
                  <div style={{
                    ...styles.immersiveDetails,
                    ...(isMobile && { 
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: '24px',
                      paddingTop: '12px'
                    })
                  }}>
                    <div style={styles.immersiveDetailItem}>
                      <span style={styles.immersiveDetailLabel}>Client</span>
                      <span style={{
                        ...styles.immersiveDetailValue,
                        fontSize: isMobile ? '14px' : '17px'
                      }}>{focusedCard.client}</span>
                    </div>
                    <div style={styles.immersiveDetailItem}>
                      <span style={styles.immersiveDetailLabel}>Year</span>
                      <span style={{
                        ...styles.immersiveDetailValue,
                        fontSize: isMobile ? '14px' : '17px'
                      }}>{focusedCard.year}</span>
                    </div>
                    <div style={styles.immersiveDetailItem}>
                      <span style={styles.immersiveDetailLabel}>Role</span>
                      <span style={{
                        ...styles.immersiveDetailValue,
                        fontSize: isMobile ? '14px' : '17px'
                      }}>{focusedCard.role}</span>
                    </div>
                  </div>
                  
                  {/* TAGS SECTION - Better separation */}
                  <div style={{
                    ...styles.immersiveTags,
                    gap: isMobile ? '8px' : '12px'
                  }}>
                    {focusedCard.tags.map((tag, idx) => (
                      <span key={idx} style={{
                        ...styles.immersiveTag,
                        fontSize: isMobile ? '9px' : '12px',
                        padding: isMobile ? '4px 12px' : '6px 20px'
                      }}>{tag}</span>
                    ))}
                  </div>
                  
                  {/* CTA SECTION - Independent and distinct */}
                  {focusedCard.projectUrl && (
                    <div style={styles.immersiveProjectUrl}>
                      <a href={focusedCard.projectUrl} target="_blank" rel="noopener noreferrer" style={{
                        ...styles.immersiveProjectUrlLink,
                        fontSize: isMobile ? '11px' : '13px'
                      }}>
                        VIEW PROJECT WEBSITE →
                      </a>
                    </div>
                  )}
                  
                  {/* VIDEO SECTION - Grouped with clear visual separation */}
                  <div style={styles.videoSection}>
                    {focusedCard.videos && focusedCard.videos.length > 0 ? (
                      focusedCard.videos.map((videoSrc, idx) => (
                        <div key={idx} style={{
                          ...styles.rightPanelVideoContainer,
                          marginTop: idx === 0 ? '0' : (isMobile ? '24px' : '32px')
                        }}>
                          <div style={{
                            ...styles.rightPanelVideoWrapper,
                            ...(isMobile && { borderRadius: '12px' })
                          }}>
                            {videoSrc.endsWith('.webp') ? (
                              <img
                                src={videoSrc}
                                alt={`Animation ${idx + 1}`}
                                style={{
                                  ...styles.rightPanelVideo,
                                  objectFit: "contain",
                                  background: "transparent"
                                }}
                              />
                            ) : (
                              <video
                                src={videoSrc}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                style={{
                                  ...styles.rightPanelVideo,
                                  objectFit: "contain",
                                  background: "transparent"
                                }}
                              />
                            )}
                          </div>
                          {focusedCard.id !== 2 && (
                            <div style={{
                              ...styles.rightPanelVideoCaption,
                              fontSize: isMobile ? '8px' : '10px'
                            }}>
                              {focusedCard.software ? focusedCard.software.join(" - ") : "Unreal Engine - Blender"} {idx === 0 ? "(Walkthrough)" : idx === 1 ? "(Detail)" : "(Animation)"}
                            </div>
                          )}
                        </div>
                      ))
                    ) : focusedCard.video ? (
                      <div style={styles.rightPanelVideoContainer}>
                        <div style={styles.rightPanelVideoWrapper}>
                          <video
                            src={focusedCard.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            style={{
                              ...styles.rightPanelVideo,
                              objectFit: "contain",
                              background: "transparent"
                            }}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const styles = {
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
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 350,
    opacity: 0.55,
    textTransform: 'uppercase',
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    textAlign: 'center',
    zIndex: 20,
    pointerEvents: 'none',
    transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    textShadow: '0 0 8px rgba(0, 150, 255, 0.3), 0 0 2px rgba(255,255,255,0.5)'
  },
  enterHover: {
    opacity: 0.85,
    letterSpacing: '0.65em',
    textShadow: '0 0 15px rgba(0, 150, 255, 0.7), 0 0 30px rgba(0, 150, 255, 0.4), 0 0 5px rgba(255,255,255,0.8)'
  },
  enterActive: {
    opacity: 1,
    letterSpacing: '0.8em',
    textShadow: '0 0 25px rgba(0, 150, 255, 0.9), 0 0 50px rgba(0, 150, 255, 0.6), 0 0 80px rgba(0, 150, 255, 0.3), 0 0 10px #ffffff'
  },
  enterExit: {
    opacity: 0,
    filter: 'blur(4px)',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none'
  },
  
  homePage: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#000000',
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
  
  robotBackground: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1,
    pointerEvents: 'none',
    overflow: 'hidden'
  },
  
  logoArea: {
    position: 'absolute',
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
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 400,
    fontSize: '15px',
    letterSpacing: '0.08em',
    color: '#f0ebd8',
    opacity: 0.85
  },
  
  headline: {
    position: 'absolute',
    top: '42px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 300,
    fontSize: '13px',
    letterSpacing: '0.03em',
    color: '#f0ebd8',
    opacity: 0.55,
    maxWidth: '900px',
    width: '100%',
    lineHeight: 1.4,
    zIndex: 10,
    textAlign: 'center'
  },
  
  availability: {
    position: 'absolute',
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
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 300,
    fontSize: '11px',
    letterSpacing: '0.02em',
    color: '#f0ebd8',
    opacity: 0.6
  },
  
  description: {
    position: 'absolute',
    zIndex: 10
  },
  descLine: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 300,
    fontSize: '14px',
    lineHeight: 1.55,
    letterSpacing: '0.01em',
    color: '#f0ebd8',
    opacity: 0.75,
    marginBottom: '10px'
  },
  
  navWrapper: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10,
    transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'center'
  },
  navWrapperDimmed: {
    opacity: 0.25
  },
  navWrapperHidden: {
    opacity: 0,
    pointerEvents: 'none'
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
    fontFamily: "'Source Code Pro', monospace",
    fontSize: '10px',
    letterSpacing: '0.2em',
    fontWeight: 350,
    color: '#f0ebd8',
    opacity: 0.65,
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    whiteSpace: 'nowrap'
  },
  navLabelIndex: {
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)'
  },
  navLabelWork: {
    top: '50%',
    right: '197px',
    transform: 'translateY(-50%)'
  },
  navLabelAbout: {
    top: '50%',
    right: '-40px',
    transform: 'translateY(-50%)'
  },
  navLabelContact: {
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)'
  },

  aboutImageOverlay: {
    position: 'fixed',
    top: '50%',
    right: '20%',
    transform: 'translateY(-50%)',
    zIndex: 20,
    transition: 'opacity 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
  },
  aboutImageVisible: {
    opacity: 1,
    transform: 'translateY(-50%) translateY(0)'
  },
  aboutImageHidden: {
    opacity: 0,
    transform: 'translateY(-50%) translateY(20px)',
    pointerEvents: 'none'
  },
  aboutImageContainer: {
    position: 'relative',
    display: 'inline-block'
  },
  closeButton: {
    position: 'absolute',
    top: '65px',
    right: '50px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(13, 19, 33, 0.9)',
    border: '1px solid rgba(240, 235, 216, 0.3)',
    color: '#f0ebd8',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    backdropFilter: 'blur(4px)',
    fontFamily: 'monospace',
    zIndex: 21
  },
  aboutImage: {
    maxWidth: '300px',
    width: '90%',
    height: 'auto',
    borderRadius: '15px',
    boxShadow: '0 30px 35px -10px rgba(0,0,0,0.3)',
    border: 'none',
    outline: 'none'
  },

  // Contact Overlay Styles - Todo dentro de la imagen
  contactOverlay: {
    position: 'fixed',
    top: '50%',
    left: '70%',
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
    transition: 'opacity 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    width: 'auto',
    maxWidth: '90vw',
    maxHeight: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactOverlayVisible: {
    opacity: 1,
    transform: 'translate(-50%, -50%) scale(1)'
  },
  contactOverlayHidden: {
    opacity: 0,
    transform: 'translate(-50%, -50%) scale(0.95)',
    pointerEvents: 'none'
  },
  contactContainer: {
    position: 'relative',
    display: 'inline-block',
    width: 'auto',
    height: 'auto'
  },
  contactCloseButton: {
    position: 'absolute',
    top: '10%',
    right: '5%',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(13, 19, 33, 0.85)',
    border: '1px solid rgba(240, 235, 216, 0.3)',
    color: '#f0ebd8',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(6px)',
    fontFamily: 'monospace',
    zIndex: 25,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  contactImageWrapper: {
    position: 'relative',
    display: 'inline-block'
  },
  contactImage: {
    maxWidth: 'min(85vw, 370px)',
    width: 'auto',
    maxHeight: '85vh',
    height: 'auto',
    objectFit: 'contain',
    display: 'block'
  },
  // Contact Info - Posicionado dentro de la imagen
  contactInfoContainer: {
    position: 'absolute',
    bottom: '15%',
    left: '0',
    right: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '95px',
    zIndex: 22,
    padding: '0 70px'
  },
  contactEmail: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 300,
    fontSize: '15px',
    letterSpacing: '0.03em',
    color: '#f0ebd8',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    opacity: 0.85,
    textAlign: 'center'
  },
  contactPhone: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 1,
    fontSize: '15px',
    letterSpacing: '0.03em',
    color: '#f0ebd8',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    opacity: 0.85,
    textAlign: 'center'
  },
  // Social Buttons - Posicionado dentro de la imagen
  socialButtonsContainer: {
    position: 'absolute',
    bottom: '35%',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'center',
    gap: '14px',
    zIndex: 22
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.2, 0.95, 0.4, 1.05)'
  },
  socialIcon: {
    width: 'clamp(165px, 6vw, 40px)',
    height: 'auto',
    objectFit: 'contain',
    filter: 'brightness(0.9)',
    transition: 'all 0.3s ease'
  },

  workPanel: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#000000',
    zIndex: 30,
    transition: 'opacity 0.5s cubic-bezier(0.3, 0.9, 0.4, 1), transform 0.5s cubic-bezier(0.3, 0.9, 0.4, 1)',
    overflow: 'hidden'
  },
  workPanelVisible: {
    opacity: 1,
    transform: 'scale(1)'
  },
  workPanelWithFocus: {
    opacity: 1,
    transform: 'scale(1)'
  },
  workPanelHidden: {
    opacity: 0,
    transform: 'scale(0.98)',
    pointerEvents: 'none'
  },
  workPanelContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '60px 60px',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollBehavior: 'auto',
    cursor: 'grab',
    transition: 'filter 0.5s cubic-bezier(0.3, 0.9, 0.4, 1)'
  },
  workPanelContentBlurred: {
    filter: 'blur(12px)'
  },
  projectsContainer: {
    display: 'flex',
    gap: '30px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 'min-content',
    flexWrap: 'nowrap'
  },
  
  projectCard: {
    flex: '0 0 auto',
    width: '360px',
    background: 'transparent',
    borderRadius: '20px',
    overflow: 'visible',
    transition: 'transform 0.4s cubic-bezier(0.2, 0.95, 0.4, 1.05), box-shadow 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    zIndex: 1,
    willChange: 'transform'
  },
  projectCardHovered: {
    transform: 'translateY(-8px) scale(1.02)',
    zIndex: 10
  },
  projectImageContainer: {
    width: '100%',
    aspectRatio: '4 / 3',
    borderRadius: '20px',
    overflow: 'hidden',
    position: 'relative',
    background: '#0a0a0a',
    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)'
  },
  projectImagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(11, 23, 41, 0.9) 0%, rgba(33, 42, 54, 0.2) 100%)',
    transition: 'transform 0.5s cubic-bezier(0.2, 0.95, 0.4, 1.05)',
    willChange: 'transform'
  },
  projectImageText: {
    fontSize: '42px',
    fontWeight: 400,
    color: 'rgba(1, 48, 54, 0.3)',
    fontFamily: "'Source Code Pro', monospace",
    transition: 'all 0.4s ease'
  },
  
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '30px 20px 20px 20px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
    transform: 'translateY(0)',
    transition: 'transform 0.3s ease, padding 0.3s ease'
  },
  imageOverlayHovered: {
    padding: '25px 20px 25px 20px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)'
  },
  overlayTitle: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 500,
    fontSize: '18px',
    letterSpacing: '0.08em',
    color: '#f0ebd8',
    margin: 0,
    marginBottom: '6px',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
  },
  overlayCategory: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 300,
    fontSize: '10px',
    letterSpacing: '0.2em',
    color: '#5e9cfa',
    margin: 0,
    textTransform: 'uppercase',
    textShadow: '0 1px 1px rgba(0,0,0,0.3)'
  },
  
  cardGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: 'linear-gradient(to top, rgba(8, 5, 189, 0.15), transparent)',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.4s ease'
  },
  
  floatingPanel: {
    position: 'absolute',
    bottom: '-20px',
    left: '15px',
    right: '15px',
    background: 'rgba(13, 25, 45, 0.98)',
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    overflow: 'hidden',
    opacity: 0,
    transform: 'translateY(20px) scale(0.95)',
    transition: 'all 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    pointerEvents: 'none',
    zIndex: 20,
    boxShadow: '0 20px 35px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(94, 156, 250, 0.15)'
  },
  floatingPanelVisible: {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
    pointerEvents: 'auto',
    bottom: '-10px'
  },
  floatingContent: {
    padding: '16px 18px 18px 18px'
  },
  floatingDescription: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 300,
    fontSize: '11px',
    lineHeight: 1.5,
    color: '#f0ebd8',
    opacity: 0.85,
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  floatingTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '12px'
  },
  floatingTag: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 300,
    fontSize: '8px',
    letterSpacing: '0.1em',
    color: '#5e9cfa',
    background: 'rgba(94, 156, 250, 0.12)',
    padding: '3px 10px',
    borderRadius: '14px',
    border: '1px solid rgba(94, 156, 250, 0.2)'
  },
  floatingMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 300,
    fontSize: '9px',
    color: '#748cab',
    paddingTop: '8px',
    borderTop: '1px solid rgba(116, 140, 171, 0.2)'
  },
  floatingSeparator: {
    color: '#748cab',
    opacity: 0.5
  },
  floatingUrl: {
    marginTop: '10px',
    paddingTop: '8px',
    borderTop: '1px solid rgba(94, 156, 250, 0.15)'
  },
  floatingUrlLink: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 350,
    fontSize: '9px',
    letterSpacing: '0.12em',
    color: '#5e9cfa',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    display: 'inline-block'
  },
  
  workCloseButton: {
    position: 'fixed',
    bottom: '48px',
    right: '48px',
    width: 'auto',
    height: 'auto',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    transition: 'all 0.3s cubic-bezier(0.2, 0.95, 0.4, 1.05)',
    zIndex: 31,
    padding: 0,
    overflow: 'visible'
  },
  workCloseButtonHidden: {
    opacity: 0,
    pointerEvents: 'none'
  },
  workCloseIcon: {
    width: '48px',
    height: '48px',
    objectFit: 'contain',
    display: 'block'
  },

  immersiveOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(13, 19, 33, 0.3)',
    backdropFilter: 'blur(6px)',
    zIndex: 200,
    transition: 'opacity 0.6s cubic-bezier(0.2, 0.95, 0.4, 1), backdrop-filter 0.6s cubic-bezier(0.2, 0.95, 0.4, 1)',
    overflow: 'hidden'
  },
  immersiveOverlayOpen: {
    opacity: 1
  },
  immersiveOverlayClosing: {
    opacity: 0
  },
  immersiveCloseButton: {
    position: 'fixed',
    top: '48px',
    right: '48px',
    width: '52px',
    height: '52px',
    background: 'rgba(13, 19, 33, 0.5)',
    backdropFilter: 'blur(8px)',
    borderRadius: '50%',
    border: '1px solid rgba(240, 235, 216, 0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.75,
    transition: 'all 0.3s cubic-bezier(0.2, 0.95, 0.4, 1.05)',
    zIndex: 201,
    padding: 0
  },
  immersiveCloseIcon: {
    width: '50px',
    height: '50px',
    objectFit: 'contain',
    display: 'block',
    filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))'
  },
  immersiveScrollContainer: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollBehavior: 'smooth',
    boxSizing: 'border-box'
  },
  immersiveContent: {
    display: 'flex',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    animation: 'contentFloatIn 0.6s cubic-bezier(0.2, 0.95, 0.4, 1)'
  },
  immersiveMedia: {
    flex: 1.3,
    display: 'flex',
    flexDirection: 'column',
    gap: '40px'
  },
  immersiveImageArea: {
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: '24px',
    overflow: 'hidden',
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(20, 30, 45, 0.4) 0%, rgba(116, 140, 171, 0.08) 100%)',
    boxShadow: '0 25px 45px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    transition: 'all 0.4s cubic-bezier(0.2, 0.95, 0.4, 1.05)'
  },
  immersiveImagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(125deg, rgba(29, 45, 68, 0.7) 0%, rgba(116, 140, 171, 0.2) 100%)'
  },
  immersiveImageText: {
    fontSize: '120px',
    fontWeight: 400,
    color: 'rgba(240, 235, 216, 0.15)',
    fontFamily: "'Source Code Pro', monospace",
    letterSpacing: '0.05em'
  },
  imageAreaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(192, 132, 252, 0.08), transparent 70%)',
    pointerEvents: 'none'
  },
  immersiveAdditionalImageWrapper: {
    width: '100%',
    opacity: 0,
    transform: 'translateY(30px)',
    animation: 'fadeSlideUp 0.7s cubic-bezier(0.2, 0.95, 0.4, 1) forwards',
    transition: 'transform 0.3s ease, filter 0.3s ease'
  },
  immersiveAdditionalImage: {
    width: '100%',
    borderRadius: '20px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, rgba(20, 30, 45, 0.3) 0%, rgba(116, 140, 171, 0.05) 100%)',
    boxShadow: '0 8px 24px -8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
    position: 'relative',
    transition: 'all 0.4s cubic-bezier(0.2, 0.95, 0.4, 1.05)'
  },
  immersiveAdditionalImagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, rgba(29, 45, 68, 0.5) 0%, rgba(116, 140, 171, 0.12) 100%)'
  },
  immersiveAdditionalImageText: {
    fontSize: '15px',
    fontWeight: 300,
    color: 'rgba(240, 235, 216, 0.45)',
    fontFamily: "'Source Code Pro', monospace",
    textAlign: 'center',
    padding: '24px',
    letterSpacing: '0.02em'
  },
  additionalImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent)',
    pointerEvents: 'none'
  },
  immersiveText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
    paddingTop: '12px'
  },
  textHeaderGroup: {
    borderBottom: '1px solid rgba(240, 235, 216, 0.08)',
    paddingBottom: '24px',
    marginBottom: '4px'
  },
  immersiveTitle: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 500,
    fontSize: '72px',
    letterSpacing: '0.08em',
    color: '#f0ebd8',
    margin: 0,
    lineHeight: 1.08,
    marginBottom: '20px',
    textShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
  },
  immersiveCategory: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 350,
    fontSize: '14px',
    letterSpacing: '0.28em',
    color: '#5e9cfa',
    textTransform: 'uppercase',
    margin: 0,
    opacity: 0.9
  },
  immersiveDescription: {
    marginTop: '0px',
    lineHeight: 1.75,
    fontSize: '15px',
    maxWidth: '520px',
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 300,
    letterSpacing: '0.02em',
    color: '#f0ebd8',
    opacity: 0.9
  },
  immersiveDetails: {
    display: 'flex',
    gap: '48px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(240, 235, 216, 0.05)',
    marginTop: '8px'
  },
  immersiveDetailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  immersiveDetailLabel: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 300,
    fontSize: '11px',
    letterSpacing: '0.24em',
    color: '#748cab',
    textTransform: 'uppercase'
  },
  immersiveDetailValue: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 400,
    fontSize: '17px',
    color: '#f0ebd8',
    opacity: 0.95,
    letterSpacing: '0.01em'
  },
  immersiveTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '8px'
  },
  immersiveTag: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 350,
    fontSize: '12px',
    letterSpacing: '0.14em',
    color: '#5e9cfa',
    background: 'rgba(192, 132, 252, 0.08)',
    padding: '6px 20px',
    borderRadius: '30px',
    border: '1px solid rgba(192, 132, 252, 0.2)',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease'
  },
  immersiveProjectUrl: {
    marginTop: '20px'
  },
  immersiveProjectUrlLink: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 400,
    fontSize: '13px',
    letterSpacing: '0.1em',
    color: '#5e9cfa',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    display: 'inline-block',
    padding: '8px 0',
    borderBottom: '1px solid rgba(94, 156, 250, 0.3)'
  },
  videoSection: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(240, 235, 216, 0.06)'
  },
  rightPanelVideoContainer: {
    marginBottom: '12px',
    width: '100%'
  },
  rightPanelVideoWrapper: {
    width: '100%',
    borderRadius: '20px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    animation: 'floatVideo 6s cubic-bezier(0.4, 0.0, 0.2, 1) infinite'
  },
  rightPanelVideo: {
    width: '100%',
    height: 'auto',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    display: 'block'
  },
  rightPanelVideoCaption: {
    fontFamily: "'Source Code Pro', monospace",
    fontWeight: 300,
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: '#748cab',
    marginTop: '10px',
    textAlign: 'center',
    textTransform: 'uppercase',
    opacity: 0.7
  }
}

// Add keyframes and dynamic animation delays
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
  
  @keyframes fadeSlideUp {
    0% {
      opacity: 0;
      transform: translateY(40px);
    }
    100% {
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
      box-shadow: 0 0 0 4px rgba(16, 61, 185, 0);
    }
    100% {
      opacity: 0.5;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
  
  @keyframes contentFloatIn {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes floatVideo {
    0% {
      transform: translateY(0px) translateX(0px) scale(1);
    }
    20% {
      transform: translateY(-6px) translateX(2px) scale(1.01);
    }
    40% {
      transform: translateY(-14px) translateX(-2px) scale(1.02);
    }
    60% {
      transform: translateY(-10px) translateX(1px) scale(1.015);
    }
    80% {
      transform: translateY(-6px) translateX(-1px) scale(1.01);
    }
    100% {
      transform: translateY(0px) translateX(0px) scale(1);
    }
  }
  
  .nav-label-bloom {
    transition: all 0.3s ease;
  }
  
  .nav-label-bloom:hover {
    text-shadow: 0 0 8px rgba(240, 235, 216, 0.9), 0 0 16px rgba(240, 235, 216, 0.6), 0 0 24px rgba(192, 132, 252, 0.4) !important;
    opacity: 1 !important;
  }
  
  .work-panel-content {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .work-panel-content::-webkit-scrollbar {
    display: none;
  }
  
  .immersive-scroll-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .immersive-scroll-container::-webkit-scrollbar {
    display: none;
  }
  
  .immersive-additional-image:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 32px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  
  .immersive-image-area:hover {
    transform: scale(1.01);
    box-shadow: 0 30px 50px -16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  
  .right-panel-video-wrapper:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 32px -12px rgba(0, 0, 0, 0.4);
  }
  
  /* Contact Image Bloom Effect on Hover */
  .contact-image-wrapper:hover {
    filter: drop-shadow(0 0 20px rgba(94, 156, 250, 0.5)) drop-shadow(0 0 40px rgba(94, 156, 250, 0.3));
    transform: scale(1.02);
  }
  
  /* Social Button Hover Effects */
  .social-button {
    transition: all 0.3s cubic-bezier(0.2, 0.95, 0.4, 1.05) !important;
  }
  
  .social-button:hover {
    transform: scale(1.1) !important;
  }
  
  .social-button:hover img {
    filter: brightness(1.2) drop-shadow(0 0 8px rgba(240, 235, 216, 0.8)) !important;
  }
  
  /* Contact Info Hover Effects */
  .contact-email:hover, .contact-phone:hover {
    opacity: 1 !important;
    color: #5e9cfa !important;
    text-shadow: 0 0 8px rgba(94, 156, 250, 0.4) !important;
  }
  
  /* Contact close button hover */
  .contact-close-button:hover {
    opacity: 1 !important;
    transform: scale(1.1) !important;
    background: rgba(13, 19, 33, 1) !important;
    border-color: rgba(240, 235, 216, 0.7) !important;
    box-shadow: 0 0 15px rgba(94, 156, 250, 0.3) !important;
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    .contact-close-button {
      top: 3% !important;
      right: 3% !important;
      width: 28px !important;
      height: 28px !important;
      font-size: 14px !important;
    }
    
    .contact-email, .contact-phone {
      font-size: 10px !important;
    }
    
    .social-buttons-container {
      gap: 15px !important;
    }
    
    .social-icon {
      width: 30px !important;
    }
  }

  @media (max-width: 480px) {
    .contact-email, .contact-phone {
      font-size: 9px !important;
    }
    
    .social-buttons-container {
      gap: 12px !important;
    }
    
    .social-icon {
      width: 25px !important;
    }
  }
`;
document.head.appendChild(styleSheet);