// App.jsx - PORTFOLIO COMPLETO CON DESCRIPCIÓN COMPLETA Y SCROLL EN PANEL
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import Spline from '@splinetool/react-spline'

// Detectar móvil al inicio
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

// Componente ImageLightbox Mejorado
const ImageLightbox = memo(({ images, currentIndex, onClose, onPrev, onNext, isMobile }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    document.body.classList.add('lightbox-open')
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      document.body.classList.remove('lightbox-open')
    }
  }, [onClose, onPrev, onNext])

  if (!images || images.length === 0) return null

  const currentImage = images[currentIndex]
  
  const isAssetImage = currentImage.src?.toLowerCase().includes('mochila') || 
                       currentImage.src?.toLowerCase().includes('asset') ||
                       currentImage.caption?.toLowerCase().includes('detail') ||
                       currentImage.caption?.toLowerCase().includes('overview') ||
                       currentImage.caption?.toLowerCase().includes('layout')

  return (
    <div 
      className="lightbox-overlay"
      style={styles.lightboxOverlay}
      onClick={onClose}
    >
      <div className="lightbox-bg-glow" style={styles.lightboxBackgroundGlow} />
      
      <div className="lightbox-header" style={styles.lightboxHeader}>
        <span className="lightbox-counter" style={styles.lightboxCounter}>
          {currentIndex + 1} / {images.length}
        </span>
        <button 
          className="lightbox-close-button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={styles.lightboxCloseButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.background = 'rgba(13, 19, 33, 0.95)'
            e.currentTarget.style.borderColor = 'rgba(240, 235, 216, 0.3)'
            e.currentTarget.style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.background = 'rgba(13, 19, 33, 0.5)'
            e.currentTarget.style.borderColor = 'rgba(240, 235, 216, 0.12)'
            e.currentTarget.style.opacity = '0.75'
          }}
          aria-label="Close lightbox"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f0ebd8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div 
        style={styles.lightboxMainContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="lightbox-nav-button lightbox-prev-button"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{
            ...styles.lightboxNavButton,
            ...styles.lightboxPrevButton,
            opacity: images.length <= 1 ? 0 : undefined,
            pointerEvents: images.length <= 1 ? 'none' : undefined
          }}
          onMouseEnter={(e) => {
            if (images.length > 1) {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.background = 'rgba(240, 235, 216, 0.12)'
              e.currentTarget.style.borderColor = 'rgba(240, 235, 216, 0.25)'
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'
            }
          }}
          onMouseLeave={(e) => {
            if (images.length > 1) {
              e.currentTarget.style.opacity = '0.4'
              e.currentTarget.style.background = 'rgba(240, 235, 216, 0.03)'
              e.currentTarget.style.borderColor = 'rgba(240, 235, 216, 0.1)'
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
            }
          }}
          aria-label="Previous image"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f0ebd8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div 
          className={`lightbox-image-canvas ${isAssetImage ? 'lightbox-image-canvas-asset' : ''}`}
          style={{
            ...styles.lightboxImageCanvas,
            ...(isAssetImage && styles.lightboxImageCanvasAsset)
          }}
        >
          <img
            src={currentImage.src}
            alt={currentImage.caption || `Image ${currentIndex + 1}`}
            className={`lightbox-image ${isAssetImage ? 'lightbox-image-asset' : ''}`}
            style={{
              ...styles.lightboxImage,
              ...(isAssetImage && styles.lightboxImageAsset)
            }}
            key={currentImage.src}
          />
        </div>

        <button 
          className="lightbox-nav-button lightbox-next-button"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{
            ...styles.lightboxNavButton,
            ...styles.lightboxNextButton,
            opacity: images.length <= 1 ? 0 : undefined,
            pointerEvents: images.length <= 1 ? 'none' : undefined
          }}
          onMouseEnter={(e) => {
            if (images.length > 1) {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.background = 'rgba(240, 235, 216, 0.12)'
              e.currentTarget.style.borderColor = 'rgba(240, 235, 216, 0.25)'
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'
            }
          }}
          onMouseLeave={(e) => {
            if (images.length > 1) {
              e.currentTarget.style.opacity = '0.4'
              e.currentTarget.style.background = 'rgba(240, 235, 216, 0.03)'
              e.currentTarget.style.borderColor = 'rgba(240, 235, 216, 0.1)'
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
            }
          }}
          aria-label="Next image"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f0ebd8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {currentImage.caption && (
        <div className="lightbox-caption" style={styles.lightboxCaption}>
          <span className="lightbox-caption-text" style={styles.lightboxCaptionText}>{currentImage.caption}</span>
        </div>
      )}
    </div>
  )
})

ImageLightbox.displayName = 'ImageLightbox'

// Componente ProjectCard optimizado
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
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        </div>
        
        <div style={{
          ...styles.imageOverlay,
          ...(isHovered && styles.imageOverlayHovered)
        }}>
          <h3 style={styles.overlayTitle}>{project.title}</h3>
          <p style={styles.overlayCategory}>{project.category}</p>
        </div>
      </div>
      
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
              <a 
                href={project.projectUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()} 
                style={styles.floatingUrlLink}
              >
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

// Componente principal App
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
  
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  
  const [focusedCard, setFocusedCard] = useState(null)
  const [focusTransitioning, setFocusTransitioning] = useState(false)
  
  const splineRef = useRef(null)
  const robotSplineRef = useRef(null)
  const pulseTimeoutRef = useRef(null)
  const transitionTimeoutRef = useRef(null)
  const exitButtonRef = useRef(null)
  
  const scrollContainerRef = useRef(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const velocityRef = useRef(0)
  const lastXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const animationFrameRef = useRef(null)
  
  const [hoveredCard, setHoveredCard] = useState(null)
  const [cardImageOffsets, setCardImageOffsets] = useState({})
  const [cardTilt, setCardTilt] = useState({})

  const [activeSection, setActiveSection] = useState('INDEX')
  const sectionAngles = { 'INDEX': 270, 'WORK': 330, 'ABOUT': 30, 'CONTACT': 150 }
  const [currentAngle, setCurrentAngle] = useState(sectionAngles['INDEX'])
  const animationRef = useRef(null)

  const circleRadius = 110
  const centerX = 130
  const centerY = 130

  const getLightboxImages = useCallback(() => {
    if (!focusedCard) return []
    const images = [{ src: focusedCard.image, caption: focusedCard.title }]
    if (focusedCard.additionalImages) {
      focusedCard.additionalImages.forEach(img => {
        images.push({ src: img.src, caption: img.caption })
      })
    }
    return images
  }, [focusedCard])

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  const nextImage = useCallback(() => {
    const images = getLightboxImages()
    setLightboxIndex(prev => (prev + 1) % images.length)
  }, [getLightboxImages])

  const prevImage = useCallback(() => {
    const images = getLightboxImages()
    setLightboxIndex(prev => (prev - 1 + images.length) % images.length)
  }, [getLightboxImages])

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
    
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
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
    setTimeout(() => animateDot(currentAngle, sectionAngles['WORK'], 500), 100)
  }

  const closeAboutImage = () => setShowAboutImage(false)
  const closeContactOverlay = () => setShowContactOverlay(false)

  const getDotPosition = (angleDeg) => {
    const angleRad = (angleDeg * Math.PI) / 180
    return {
      x: centerX + circleRadius * Math.cos(angleRad),
      y: centerY + circleRadius * Math.sin(angleRad)
    }
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
    if (splineRef.current) splineRef.current.emitEvent('sphereHoverStart')
  }

  const handleSphereMouseLeave = () => {
    if (isTransitioning) return
    setHover(false)
    if (splineRef.current) splineRef.current.emitEvent('sphereHoverEnd')
  }

  const handleSphereClick = () => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setActive(true)
    if (splineRef.current) splineRef.current.emitEvent('portalActivate')

    pulseTimeoutRef.current = setTimeout(() => {
      setActive(false)
      if (splineRef.current) splineRef.current.emitEvent('sphereDissolve')
    }, 600)

    transitionTimeoutRef.current = setTimeout(() => setShowHome(true), 800)
  }

  const handleMouseDown = useCallback((e) => {
    if (focusedCard || lightboxOpen) return
    if (!scrollContainerRef.current) return
    isDraggingRef.current = true
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft
    lastXRef.current = e.pageX
    lastTimeRef.current = performance.now()
    velocityRef.current = 0
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    scrollContainerRef.current.style.cursor = 'grabbing'
    scrollContainerRef.current.style.userSelect = 'none'
  }, [focusedCard, lightboxOpen])

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !scrollContainerRef.current || focusedCard || lightboxOpen) return
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
  }, [focusedCard, lightboxOpen])

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab'
      scrollContainerRef.current.style.userSelect = 'auto'
    }
    
    const applyInertia = () => {
      if (!scrollContainerRef.current || focusedCard || lightboxOpen) return
      velocityRef.current *= 0.96
      if (Math.abs(velocityRef.current) > 0.3) {
        scrollContainerRef.current.scrollLeft -= velocityRef.current * 2.5
        animationFrameRef.current = requestAnimationFrame(applyInertia)
      } else {
        animationFrameRef.current = null
      }
    }
    
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    animationFrameRef.current = requestAnimationFrame(applyInertia)
  }, [focusedCard, lightboxOpen])

  const handleCardMouseMove = useCallback((cardId, e) => {
    if (focusedCard) return
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5
    
    setCardImageOffsets(prev => ({ ...prev, [cardId]: { x: mouseX * 25, y: mouseY * 18 } }))
    setCardTilt(prev => ({ ...prev, [cardId]: { rotateX: mouseY * 8, rotateY: mouseX * 8 } }))
  }, [focusedCard])

  const handleCardMouseLeave = useCallback((cardId) => {
    if (focusedCard) return
    setCardImageOffsets(prev => { const newState = { ...prev }; delete newState[cardId]; return newState })
    setCardTilt(prev => { const newState = { ...prev }; delete newState[cardId]; return newState })
    setHoveredCard(null)
  }, [focusedCard])

  const handleCardClick = useCallback((project) => {
    if (focusTransitioning || focusedCard) return
    setFocusTransitioning(true)
    setFocusedCard(project)
    setTimeout(() => setFocusTransitioning(false), 500)
  }, [focusTransitioning, focusedCard])

  const closeFocusedCard = useCallback(() => {
    if (focusTransitioning) return
    setFocusTransitioning(true)
    setFocusedCard(null)
    setTimeout(() => setFocusTransitioning(false), 500)
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

  const projects = useMemo(() => [
    {
      id: 1,
      title: "NO DAYS OFF",
      category: "ENVIRONMENT / REAL-TIME",
      image: "/1.jpg",
      description: "Gameplay-driven coastal village environment focused on spatial readability, navigation flow, and in-engine performance validation.",
      extendedDescription: "Coastal stilt-village environment designed with a gameplay-first approach.",
      fullDescription: "Coastal stilt-village environment designed with a gameplay-first approach. Focused on spatial readability, organic navigation, and functional layout. Each structure operates as a gameplay node, supporting exploration, cover, and interaction. Tested in-engine for scale, sightlines, LOD transitions, draw calls, and stable framerate performance. The environment was built to support verticality, clear sightlines, and distinct gameplay zones.",
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
      extendedDescription: "Industrial Kitchen prepared for Unreal Engine.",
      fullDescription: "Industrial Kitchen prepared for Unreal Engine. Modeled with clean topology and optimized geometry, materials follow a PBR workflow. Lighting is configured for real-time playback and 360 walkthroughs, and assets are optimized for interactive performance with LODs, organized UVs and controlled reflection maps. The project includes a 360 walkthrough, Unreal viewport captures and a production breakdown.",
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
      ]
    },
    {
      id: 3,
      title: "ARCHITECTURAL RESIDENCE",
      category: "ENVIRONMENT / ARCHITECTURE",
      image: "/10.jpg",
      description: "High-end architectural environment developed entirely in Blender with premium residential aesthetic and cinematic composition.",
      extendedDescription: "A polished architectural environment built around strong silhouette language.",
      fullDescription: "This project presents a high-end architectural environment developed entirely in Blender, with a strong emphasis on visual clarity, material fidelity, and cinematic composition. The scene was built to deliver a polished and believable atmosphere, using a restrained palette of natural wood, stone, glass, and soft interior lighting to reinforce a premium residential aesthetic. The environment was designed around strong silhouette language and clean spatial hierarchy, allowing both the interior and exterior views to read clearly from multiple camera positions.",
      tags: ["ARCHITECTURE", "BLENDER", "LIGHTING", "PBR"],
      year: "2025",
      client: "Personal Project",
      role: "3D Environment Artist",
      software: ["Blender"],
      has3DContent: false,
      additionalImages: [
        { id: 1, src: "/12.jpg", caption: "Material detail - Wood and stone textures" },
        { id: 2, src: "/11.jpg", caption: "Exterior view - Premium residential aesthetic" }
      ]
    },
    {
      id: 4,
      title: "ORNAMENTAL",
      category: "ENVIRONMENT / LIGHTING",
      image: "/20.jpg",
      description: "Cinematic lighting study focused on a traditional street lamp within a rain-soaked urban scene.",
      extendedDescription: "A focused environment study built around a traditional street lamp.",
      fullDescription: "This project is a cinematic lighting study built around a traditional street lamp as the main focal point within a rain-soaked urban scene. The composition emphasizes atmosphere, contrast, and depth, using warm emissive light against a colder environment to strengthen mood and visual hierarchy. Special attention was given to wet surfaces, reflections, and material response under low-light conditions.",
      tags: ["ENVIRONMENT", "LIGHTING", "MOOD", "ATMOSPHERIC"],
      year: "2024",
      client: "IMPORLED",
      role: "Environment Artist",
      software: [],
      has3DContent: false,
      additionalImages: [
        { id: 1, src: "/21.jpg", caption: "Secondary environment angle" },
        { id: 2, src: "/22.jpg", caption: "Material and atmosphere detail" }
      ]
    }
  ], [])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
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
  const lightboxImages = getLightboxImages()

  return (
    <>
      {lightboxOpen && focusedCard && (
        <ImageLightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
          isMobile={isMobile}
        />
      )}

      <div style={{ ...styles.splashScreen, ...(isTransitioning && styles.splashScreenExit) }}>
        <div style={{ ...styles.container, padding: isMobile ? '20px' : '40px' }}>
          <div style={{ ...styles.sceneWrapper, ...(isLoaded && styles.sceneWrapperLoaded), ...(isTransitioning && styles.sceneWrapperExit) }}>
            <div style={{ ...styles.scene, ...(hover && styles.sceneHover), ...(active && styles.sceneActive), ...(isTransitioning && styles.sceneExit) }}>
              <div style={styles.sphereClickArea} onMouseEnter={handleSphereMouseEnter} onMouseLeave={handleSphereMouseLeave} onClick={handleSphereClick}>
                <Spline scene="/scene.splinecode" onLoad={onLoad} />
              </div>
            </div>
          </div>
          <div style={{ ...styles.enter, ...(hover && styles.enterHover), ...(active && styles.enterActive), ...(isTransitioning && styles.enterExit), transform: isMobile ? 'translateY(-60px)' : 'translateY(-125px)' }}>
            ENTER
          </div>
        </div>
      </div>

      <div style={{ ...styles.homePage, ...(showHome && styles.homePageVisible) }}>
        {showHome && (
          <div style={styles.robotBackground}>
            <Spline scene="/robotsplinecode" onLoad={onRobotLoad} />
          </div>
        )}

        <div style={{ ...styles.logoArea, top: isMobile ? '20px' : '40px', left: isMobile ? '20px' : '75px' }}>
          <img src="/A.png" alt="Logo" style={styles.logoImage} />
          <span style={styles.logoName}>Annya Fraysheht</span>
        </div>
        
        <div style={{ ...styles.headline, fontSize: isMobile ? '11px' : '13px', whiteSpace: isMobile ? 'normal' : 'nowrap', padding: isMobile ? '0 20px' : '0' }}>
          3D Artist specialized in Hard Surface / Real-Time and Digital Experiences
        </div>
        
        <div style={{ ...styles.availability, right: isMobile ? '20px' : '64px', top: isMobile ? '20px' : '38px' }}>
          <div style={styles.greenDot}></div>
          <span style={styles.availabilityText}>Currently available for new projects</span>
        </div>
        
        <div style={{ ...styles.description, left: isMobile ? '20px' : '80px', bottom: isMobile ? '40px' : '120px', maxWidth: isMobile ? '90%' : '440px' }}>
          <p style={styles.descLine}>I approach every project with a production mindset, prioritizing clean topology, smart asset organization, and real-time performance to create environments that work in motion, not just in</p>
          <p style={styles.descLine}>static frames. Each space is developed to stay visually strong, functionally consistent, and coherent across different angles and viewing distances.</p>
          <p style={styles.descLine}>The result is a complete real-time experience where clarity, performance, and visual intent come together seamlessly.</p>
        </div>
        
        <div className="circle-nav-container" style={{ ...styles.navWrapper, ...(showWorkPanel && styles.navWrapperDimmed), ...(focusedCard && styles.navWrapperHidden), right: isMobile ? '50%' : '110px', bottom: isMobile ? '30px' : 'auto', top: isMobile ? 'auto' : '70%', transform: isMobile ? 'translateX(50%) translateY(0)' : 'translateY(-50%)' }}>
          <div style={{ ...styles.circleContainer, transform: isMobile ? 'scale(0.65)' : 'scale(1)' }}>
            <svg width="260" height="260" viewBox="0 0 260 260" style={styles.svgCircle}>
              <circle cx="130" cy="130" r={circleRadius} fill="none" stroke="rgba(240, 235, 216, 0.18)" strokeWidth="0.6" />
              <circle cx={dotPos.x} cy={dotPos.y} r="5" fill="#f0ebd8" style={{ filter: 'drop-shadow(0 0 5px rgba(240, 235, 216, 0.6))', transition: showWorkPanel ? 'all 0.5s cubic-bezier(0.4, 0.2, 0.2, 1)' : 'none', transform: getSphereTransform() }} />
            </svg>
            
            <div style={{...styles.navLabel, ...styles.navLabelIndex}} className="nav-label-bloom" onClick={() => handleSectionClick('INDEX')}>INDEX</div>
            <div style={{...styles.navLabel, ...styles.navLabelWork}} className="nav-label-bloom" onClick={() => handleSectionClick('WORK')}>WORK</div>
            <div style={{...styles.navLabel, ...styles.navLabelAbout}} className="nav-label-bloom" onClick={() => handleSectionClick('ABOUT')}>ABOUT</div>
            <div style={{...styles.navLabel, ...styles.navLabelContact}} className="nav-label-bloom" onClick={() => handleSectionClick('CONTACT')}>CONTACT</div>
          </div>
        </div>

        <div style={{ ...styles.aboutImageOverlay, ...(showAboutImage ? styles.aboutImageVisible : styles.aboutImageHidden), ...(isMobile && { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '320px', zIndex: 25 }) }}>
          <div style={styles.aboutImageContainer}>
            <button onClick={closeAboutImage} style={{ ...styles.closeButton, ...(isMobile && { top: '10px', right: '10px', width: '32px', height: '32px' }) }}>✕</button>
            <img src="/About.png" alt="About" style={{ ...styles.aboutImage, ...(isMobile && { width: '100%', borderRadius: '16px' }) }} />
          </div>
        </div>

        <div style={{ ...styles.contactOverlay, ...(showContactOverlay ? styles.contactOverlayVisible : styles.contactOverlayHidden), ...(isMobile && { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '320px', zIndex: 25 }) }}>
          <div style={styles.contactContainer}>
            <button onClick={closeContactOverlay} style={{ ...styles.contactCloseButton, ...(isMobile && { top: '8px', right: '8px', width: '28px', height: '28px' }) }} className="contact-close-button">✕</button>
            
            <div style={styles.contactImageWrapper} className="contact-image-wrapper">
              <img src="/contact.png" alt="Contact" style={{ ...styles.contactImage, ...(isMobile && { width: '100%' }) }} />
              
              <div style={{ ...styles.contactInfoContainer, ...(isMobile && { gap: '12px', padding: '0 16px', bottom: '12%' }) }}>
                <a href="mailto:annya.frayshehtd@gmail.com" style={{...styles.contactEmail, ...(isMobile && { fontSize: '11px' })}} className="contact-email">annya.frayshehtd@gmail.com</a>
                <a href="tel:+573045658688" style={{...styles.contactPhone, ...(isMobile && { fontSize: '11px' })}} className="contact-phone">+57 304 565 8688</a>
              </div>
              
              <div style={{ ...styles.socialButtonsContainer, ...(isMobile && { gap: '20px', bottom: '28%' }) }}>
                <a href="https://www.instagram.com/trinity3d.360/" target="_blank" rel="noopener noreferrer" style={styles.socialButton} className="social-button">
                  <img src="/instagram.png" alt="Instagram" style={{...styles.socialIcon, ...(isMobile && { width: '28px' })}} />
                </a>
                <a href="https://www.linkedin.com/in/annya-fraysheht/" target="_blank" rel="noopener noreferrer" style={styles.socialButton} className="social-button">
                  <img src="/linkedin.png" alt="LinkedIn" style={{...styles.socialIcon, ...(isMobile && { width: '28px' })}} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...styles.workPanel, ...(showWorkPanel && !focusedCard && styles.workPanelVisible), ...(focusedCard && styles.workPanelWithFocus), ...(!showWorkPanel && styles.workPanelHidden) }}>
          <div ref={scrollContainerRef} className="work-panel-content" style={{ ...styles.workPanelContent, ...(focusedCard && styles.workPanelContentBlurred), ...(isMobile && { padding: '20px 0 20px 20px', alignItems: 'flex-start' }) }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <div style={{ ...styles.projectsContainer, padding: isMobile ? '20px 0' : '20px 40px', gap: isMobile ? '16px' : '30px' }}>
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
          
          <button ref={exitButtonRef} onClick={closeWorkPanel} style={{ ...styles.workCloseButton, ...(focusedCard && styles.workCloseButtonHidden), ...(isMobile && { bottom: '20px', right: '20px' }) }}>
            <img src="/Exit Work.png" alt="Close" style={{ ...styles.workCloseIcon, ...(isMobile && { width: '40px', height: '40px' }) }} />
          </button>
        </div>

        {focusedCard && (
          <div style={{ ...styles.immersiveOverlay, ...(focusTransitioning ? styles.immersiveOverlayClosing : styles.immersiveOverlayOpen) }}>
            <div style={styles.immersiveHeader}>
              <button onClick={closeFocusedCard} style={styles.immersiveCloseButton} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'rgba(13, 19, 33, 0.8)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(13, 19, 33, 0.5)' }}>
                <span style={styles.closeIcon}>×</span>
              </button>
            </div>

            <div className="landscape-layout" style={{ ...styles.landscapeLayout, flexDirection: isMobile ? 'column' : 'row', padding: isMobile ? '80px 20px 40px' : '100px 60px 60px' }}>
              
              <div className="gallery-container" style={styles.galleryContainer}>
                <div className="hero-image-wrapper clickable-image" style={{...styles.heroImageWrapper, cursor: 'pointer'}} onClick={() => openLightbox(0)} onMouseEnter={(e) => { const hint = e.currentTarget.querySelector('.view-hint'); if (hint) hint.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.005)' }} onMouseLeave={(e) => { const hint = e.currentTarget.querySelector('.view-hint'); if (hint) hint.style.opacity = '0'; e.currentTarget.style.transform = 'scale(1)' }}>
                  <img src={focusedCard.image} alt={focusedCard.title} style={{ ...styles.heroImage, objectFit: focusedCard.id === 4 ? 'contain' : 'cover', background: focusedCard.id === 4 ? '#0a0f16' : 'transparent' }} />
                  <div style={styles.heroImageGlow} />
                  <div className="view-hint" style={styles.viewHint}>VIEW</div>
                </div>

                <div className="secondary-images-grid" style={styles.secondaryImagesGrid}>
                  {focusedCard.additionalImages?.map((img, idx) => (
                    <div key={img.id} className="secondary-image-card clickable-image" style={{ ...styles.secondaryImageCard, animationDelay: `${idx * 0.1}s`, cursor: 'pointer' }} onClick={() => openLightbox(idx + 1)} onMouseEnter={(e) => { const hint = e.currentTarget.querySelector('.view-hint-small'); if (hint) hint.style.opacity = '1' }} onMouseLeave={(e) => { const hint = e.currentTarget.querySelector('.view-hint-small'); if (hint) hint.style.opacity = '0' }}>
                      <img src={img.src} alt={img.caption} style={{ ...styles.secondaryImage, objectFit: focusedCard.id === 4 ? 'contain' : 'cover', background: focusedCard.id === 4 ? '#0a0f16' : 'transparent' }} />
                      <div className="secondary-image-overlay" style={styles.secondaryImageOverlay}>
                        <span style={styles.secondaryImageCaption}>{img.caption}</span>
                      </div>
                      <div className="view-hint-small" style={styles.viewHintSmall}>VIEW</div>
                    </div>
                  ))}
                </div>

                {focusedCard.videos?.length > 0 && (
                  <div style={styles.videoContainer}>
                    <div style={styles.assetShowcaseHeader}>
                      <span style={styles.assetShowcaseLabel}>ASSET PREVIEW</span>
                      <span style={styles.assetShowcaseLine}></span>
                    </div>

                    <div className="video-wrapper" style={styles.videoWrapper}>
                      <video src={focusedCard.videos[0]} autoPlay loop muted playsInline preload="auto" style={styles.videoPlayer} />
                    </div>
                  </div>
                )}
              </div>

              {/* PANEL DE INFORMACIÓN - CON DESCRIPCIÓN COMPLETA Y SCROLL - VERSIÓN PREMIUM */}
              <div className="info-panel" style={styles.infoPanel}>
                <div className="info-content" style={styles.infoContent}>
                  {/* Glow ornamental */}
                  <div style={styles.infoGlowTop} />
                  <div style={styles.infoGlowCorner} />

                  {/* Línea superior elegante */}
                  <div style={styles.infoTopLine} />
                  
                  {/* Header - Categoría y título */}
                  <div style={styles.projectHeader}>
                    <span style={styles.projectCategory}>{focusedCard.category}</span>
                    <h1 style={{ ...styles.projectTitle, fontSize: isMobile ? '28px' : '38px' }}>{focusedCard.title}</h1>
                  </div>

                  {/* DESCRIPCIÓN COMPLETA - SIN TRUNCAR */}
                  <p style={{
                    ...styles.projectDescription,
                    fontSize: isMobile ? '12px' : '13px'
                  }}>
                    {focusedCard.fullDescription}
                  </p>

                  {/* Metadata - Versión premium */}
                  <div style={styles.metadataGrid}>
                    <div style={styles.metadataItem}>
                      <span style={styles.metadataLabel}>CLIENT</span>
                      <span style={styles.metadataValue}>{focusedCard.client}</span>
                    </div>
                    <div style={styles.metadataItem}>
                      <span style={styles.metadataLabel}>YEAR</span>
                      <span style={styles.metadataValue}>{focusedCard.year}</span>
                    </div>
                    <div style={styles.metadataItem}>
                      <span style={styles.metadataLabel}>ROLE</span>
                      <span style={styles.metadataValue}>{focusedCard.role}</span>
                    </div>
                    {focusedCard.software?.length > 0 ? (
                      <div style={styles.metadataItem}>
                        <span style={styles.metadataLabel}>SOFTWARE</span>
                        <span style={styles.metadataValue}>{focusedCard.software.join(', ')}</span>
                      </div>
                    ) : (
                      <div style={styles.metadataItem}>
                        <span style={styles.metadataLabel}>SOFTWARE</span>
                        <span style={{...styles.metadataValue, opacity: 0.4, fontStyle: 'italic'}}>—</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div style={styles.tagsContainer}>
                    {focusedCard.tags.map((tag, idx) => (
                      <span key={idx} className="tag" style={styles.tag}>{tag}</span>
                    ))}
                  </div>

                  {/* View Project Link */}
                  {focusedCard.projectUrl && (
                    <a 
                      href={focusedCard.projectUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-project-link" 
                      style={styles.viewProjectLink}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1'
                        e.currentTarget.style.letterSpacing = '0.14em'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.85'
                        e.currentTarget.style.letterSpacing = '0.1em'
                      }}
                    >
                      VIEW PROJECT →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ============ ESTILOS ============
const styles = {
  // Lightbox
  lightboxOverlay: {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(2, 5, 12, 0.97)', backdropFilter: 'blur(40px) saturate(1.2)',
    WebkitBackdropFilter: 'blur(40px) saturate(1.2)', zIndex: 1000,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    animation: 'lightboxFadeIn 0.35s cubic-bezier(0.2, 0.95, 0.4, 1)', cursor: 'zoom-out', overflow: 'hidden'
  },
  lightboxBackgroundGlow: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '60vw', height: '60vh',
    background: 'radial-gradient(ellipse at center, rgba(94, 156, 250, 0.06) 0%, rgba(8, 12, 20, 0) 70%)',
    pointerEvents: 'none', zIndex: 0
  },
  lightboxHeader: {
    position: 'fixed', top: 0, left: 0, right: 0, height: '70px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px',
    zIndex: 1002,
    background: 'linear-gradient(to bottom, rgba(8, 12, 20, 0.9) 0%, rgba(8, 12, 20, 0.4) 70%, transparent 100%)',
    pointerEvents: 'none'
  },
  lightboxCounter: {
    fontFamily: "'Source Code Pro', monospace", fontSize: '11px', fontWeight: 350,
    color: '#748cab', letterSpacing: '0.15em', pointerEvents: 'auto',
    padding: '6px 14px', background: 'rgba(13, 19, 33, 0.5)', borderRadius: '6px',
    border: '1px solid rgba(116, 140, 171, 0.1)', backdropFilter: 'blur(8px)'
  },
  lightboxCloseButton: {
    width: '42px', height: '42px', borderRadius: '50%',
    border: '1px solid rgba(240, 235, 216, 0.12)', background: 'rgba(13, 19, 33, 0.5)',
    backdropFilter: 'blur(10px)', color: '#f0ebd8', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.2, 0.95, 0.4, 1.05)', pointerEvents: 'auto',
    fontFamily: "'Source Code Pro', monospace", fontWeight: 300, opacity: 0.75
  },
  lightboxMainContainer: {
    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', height: '100%', padding: '80px 100px 80px 100px', zIndex: 1001, cursor: 'default'
  },
  lightboxImageCanvas: {
    position: 'relative', maxWidth: '82vw', maxHeight: '78vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(8, 12, 20, 0.65)', borderRadius: '12px',
    border: '1px solid rgba(240, 235, 216, 0.08)',
    boxShadow: '0 40px 80px -30px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(240, 235, 216, 0.03) inset',
    overflow: 'hidden', padding: '24px'
  },
  lightboxImageCanvasAsset: { maxHeight: '65vh', maxWidth: '70vw', padding: '32px' },
  lightboxImage: {
    maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block',
    animation: 'lightboxImageIn 0.45s cubic-bezier(0.2, 0.95, 0.4, 1)', borderRadius: '4px'
  },
  lightboxImageAsset: { maxHeight: '60vh', objectFit: 'contain' },
  lightboxNavButton: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: '52px', height: '52px', borderRadius: '50%',
    border: '1px solid rgba(240, 235, 216, 0.1)', background: 'rgba(240, 235, 216, 0.03)',
    backdropFilter: 'blur(8px)', color: '#f0ebd8', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4,
    transition: 'all 0.3s cubic-bezier(0.2, 0.95, 0.4, 1.05)', zIndex: 1003, margin: '0 20px'
  },
  lightboxPrevButton: { left: '20px' },
  lightboxNextButton: { right: '20px' },
  lightboxCaption: {
    position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
    padding: '8px 20px', background: 'rgba(13, 19, 33, 0.7)', backdropFilter: 'blur(12px)',
    borderRadius: '20px', border: '1px solid rgba(240, 235, 216, 0.06)',
    zIndex: 1002, maxWidth: '60vw', textAlign: 'center'
  },
  lightboxCaptionText: {
    fontFamily: "'Source Code Pro', monospace", fontSize: '11px', fontWeight: 300,
    color: '#748cab', letterSpacing: '0.06em', lineHeight: 1.4
  },

  // Splash Screen
  splashScreen: {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: '#000000', zIndex: 10,
    transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 1, transform: 'scale(1)'
  },
  splashScreenExit: { opacity: 0, transform: 'scale(1.05)', pointerEvents: 'none' },
  container: {
    width: '100vw', height: '100vh', background: '#000000',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: '48px', margin: 0, overflow: 'hidden', position: 'relative'
  },
  sceneWrapper: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', maxWidth: '600px', opacity: 0, transform: 'scale(0.95)',
    transition: 'all 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
  },
  sceneWrapperLoaded: { opacity: 1, transform: 'scale(1)' },
  sceneWrapperExit: { opacity: 0, transform: 'scale(1.3)', filter: 'blur(20px)', transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' },
  scene: {
    width: '100%', aspectRatio: '1 / 1',
    transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    filter: 'drop-shadow(0 0 0px rgba(0, 150, 255, 0))', position: 'relative'
  },
  sphereClickArea: { width: '100%', height: '100%', cursor: 'pointer', position: 'relative', zIndex: 15 },
  sceneHover: { filter: 'drop-shadow(0 0 25px rgba(0, 150, 255, 0.5)) drop-shadow(0 0 10px rgba(0, 150, 255, 0.8))', transform: 'scale(1.02)' },
  sceneActive: { filter: 'drop-shadow(0 0 40px rgba(0, 150, 255, 0.9)) drop-shadow(0 0 80px rgba(0, 150, 255, 0.6))', transform: 'scale(1.05)', transition: 'all 0.2s cubic-bezier(0.2, 1.2, 0.4, 1)' },
  sceneExit: { filter: 'drop-shadow(0 0 60px rgba(0, 150, 255, 0.8)) blur(8px)', transform: 'scale(1.15)', opacity: 0, transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' },
  enter: {
    position: 'relative', color: '#ffffff', letterSpacing: '0.5em', fontSize: '14px',
    fontFamily: "'Source Code Pro', monospace", fontWeight: 350, opacity: 0.55,
    textTransform: 'uppercase', padding: '12px 24px', background: 'transparent',
    border: 'none', textAlign: 'center', zIndex: 20, pointerEvents: 'none',
    transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    textShadow: '0 0 8px rgba(0, 150, 255, 0.3), 0 0 2px rgba(255,255,255,0.5)'
  },
  enterHover: { opacity: 0.85, letterSpacing: '0.65em', textShadow: '0 0 15px rgba(0, 150, 255, 0.7), 0 0 30px rgba(0, 150, 255, 0.4), 0 0 5px rgba(255,255,255,0.8)' },
  enterActive: { opacity: 1, letterSpacing: '0.8em', textShadow: '0 0 25px rgba(0, 150, 255, 0.9), 0 0 50px rgba(0, 150, 255, 0.6), 0 0 80px rgba(0, 150, 255, 0.3), 0 0 10px #ffffff' },
  enterExit: { opacity: 0, filter: 'blur(4px)', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: 'none' },

  // Home Page
  homePage: {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: '#000000', zIndex: 5, opacity: 0, transform: 'translateY(30px)',
    transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none', margin: 0, padding: 0, overflow: 'hidden'
  },
  homePageVisible: { opacity: 1, transform: 'translateY(0)', pointerEvents: 'auto' },
  robotBackground: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1, pointerEvents: 'none', overflow: 'hidden' },
  logoArea: { position: 'absolute', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10 },
  logoImage: { height: '26px', width: 'auto', opacity: 0.85 },
  logoName: { fontFamily: "'Source Code Pro', monospace", fontWeight: 400, fontSize: '15px', letterSpacing: '0.08em', color: '#f0ebd8', opacity: 0.85 },
  headline: {
    position: 'absolute', top: '42px', left: '50%', transform: 'translateX(-50%)',
    fontFamily: "'Source Code Pro', monospace", fontWeight: 300, fontSize: '13px',
    letterSpacing: '0.03em', color: '#f0ebd8', opacity: 0.55,
    maxWidth: '900px', width: '100%', lineHeight: 1.4, zIndex: 10, textAlign: 'center'
  },
  availability: {
    position: 'absolute', display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(240, 235, 216, 0.02)', padding: '6px 12px',
    borderRadius: '40px', border: '1px solid rgba(217, 240, 216, 0.05)', zIndex: 10
  },
  greenDot: { width: '5px', height: '5px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 4px #10b981', animation: 'pulseGreen 2s infinite' },
  availabilityText: { fontFamily: "'Source Code Pro', monospace", fontWeight: 300, fontSize: '11px', letterSpacing: '0.02em', color: '#f0ebd8', opacity: 0.6 },
  description: { position: 'absolute', zIndex: 10 },
  descLine: { fontFamily: "'Source Code Pro', monospace", fontWeight: 300, fontSize: '14px', lineHeight: 1.55, letterSpacing: '0.01em', color: '#f0ebd8', opacity: 0.75, marginBottom: '10px' },

  // Navigation
  navWrapper: {
    position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center',
    zIndex: 10, transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)', transformOrigin: 'center'
  },
  navWrapperDimmed: { opacity: 0.25 },
  navWrapperHidden: { opacity: 0, pointerEvents: 'none' },
  circleContainer: { position: 'relative', width: '200px', height: '200px' },
  svgCircle: { width: '100%', height: '100%', display: 'block' },
  navLabel: { position: 'absolute', fontFamily: "'Source Code Pro', monospace", fontSize: '10px', letterSpacing: '0.2em', fontWeight: 350, color: '#f0ebd8', opacity: 0.65, cursor: 'pointer', transition: 'opacity 0.2s ease', whiteSpace: 'nowrap' },
  navLabelIndex: { top: '-20px', left: '50%', transform: 'translateX(-50%)' },
  navLabelWork: { top: '50%', right: '197px', transform: 'translateY(-50%)' },
  navLabelAbout: { top: '50%', right: '-40px', transform: 'translateY(-50%)' },
  navLabelContact: { bottom: '-10px', left: '50%', transform: 'translateX(-50%)' },

  // About
  aboutImageOverlay: { position: 'fixed', top: '50%', right: '20%', transform: 'translateY(-50%)', zIndex: 20, transition: 'opacity 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)' },
  aboutImageVisible: { opacity: 1, transform: 'translateY(-50%) translateY(0)' },
  aboutImageHidden: { opacity: 0, transform: 'translateY(-50%) translateY(20px)', pointerEvents: 'none' },
  aboutImageContainer: { position: 'relative', display: 'inline-block' },
  closeButton: { position: 'absolute', top: '65px', right: '50px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(13, 19, 33, 0.9)', border: '1px solid rgba(240, 235, 216, 0.3)', color: '#f0ebd8', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6, backdropFilter: 'blur(4px)', fontFamily: 'monospace', zIndex: 21 },
  aboutImage: { maxWidth: '300px', width: '90%', height: 'auto', borderRadius: '15px', boxShadow: '0 30px 35px -10px rgba(0,0,0,0.3)' },

  // Contact
  contactOverlay: { position: 'fixed', top: '50%', left: '70%', transform: 'translate(-50%, -50%)', zIndex: 20, width: 'auto', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  contactOverlayVisible: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
  contactOverlayHidden: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.95)', pointerEvents: 'none' },
  contactContainer: { position: 'relative', display: 'inline-block' },
  contactCloseButton: { position: 'absolute', top: '10%', right: '5%', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(13, 19, 33, 0.85)', border: '1px solid rgba(240, 235, 216, 0.3)', color: '#f0ebd8', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7, backdropFilter: 'blur(6px)', fontFamily: 'monospace', zIndex: 25 },
  contactImageWrapper: { position: 'relative', display: 'inline-block' },
  contactImage: { maxWidth: 'min(85vw, 370px)', width: 'auto', maxHeight: '85vh', height: 'auto', objectFit: 'contain', display: 'block' },
  contactInfoContainer: { position: 'absolute', bottom: '15%', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '95px', zIndex: 22, padding: '0 70px' },
  contactEmail: { fontFamily: "'Source Code Pro', monospace", fontWeight: 300, fontSize: '15px', letterSpacing: '0.03em', color: '#f0ebd8', textDecoration: 'none', opacity: 0.85, textAlign: 'center' },
  contactPhone: { fontFamily: "'Source Code Pro', monospace", fontWeight: 1, fontSize: '15px', letterSpacing: '0.03em', color: '#f0ebd8', textDecoration: 'none', opacity: 0.85, textAlign: 'center' },
  socialButtonsContainer: { position: 'absolute', bottom: '35%', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '14px', zIndex: 22 },
  socialButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.2, 0.95, 0.4, 1.05)' },
  socialIcon: { width: 'clamp(165px, 6vw, 40px)', height: 'auto', objectFit: 'contain', filter: 'brightness(0.9)', transition: 'all 0.3s ease' },

  // Work Panel
  workPanel: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000000', zIndex: 30, overflow: 'hidden' },
  workPanelVisible: { opacity: 1, transform: 'scale(1)' },
  workPanelWithFocus: { opacity: 1, transform: 'scale(1)' },
  workPanelHidden: { opacity: 0, transform: 'scale(0.98)', pointerEvents: 'none' },
  workPanelContent: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '60px 60px', overflowX: 'auto', overflowY: 'hidden', cursor: 'grab', transition: 'filter 0.5s cubic-bezier(0.3, 0.9, 0.4, 1)' },
  workPanelContentBlurred: { filter: 'blur(12px)' },
  projectsContainer: { display: 'flex', gap: '30px', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'nowrap' },

  projectCard: { flex: '0 0 auto', width: '360px', background: 'transparent', borderRadius: '20px', overflow: 'visible', cursor: 'pointer', position: 'relative', zIndex: 1, willChange: 'transform' },
  projectCardHovered: { transform: 'translateY(-8px) scale(1.02)', zIndex: 10 },
  projectImageContainer: { width: '100%', aspectRatio: '4 / 3', borderRadius: '20px', overflow: 'hidden', position: 'relative', background: '#0a0a0a', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)' },
  projectImagePlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(11, 23, 41, 0.9) 0%, rgba(33, 42, 54, 0.2) 100%)', transition: 'transform 0.5s cubic-bezier(0.2, 0.95, 0.4, 1.05)', willChange: 'transform' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px 20px 20px 20px', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' },
  imageOverlayHovered: { padding: '25px 20px 25px 20px', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)' },
  overlayTitle: { fontFamily: "'Source Code Pro', monospace", fontWeight: 500, fontSize: '18px', letterSpacing: '0.08em', color: '#f0ebd8', margin: 0, marginBottom: '6px' },
  overlayCategory: { fontFamily: "'Source Code Pro', monospace", fontWeight: 300, fontSize: '10px', letterSpacing: '0.2em', color: '#5e9cfa', margin: 0, textTransform: 'uppercase' },
  cardGlow: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, rgba(8, 5, 189, 0.15), transparent)', pointerEvents: 'none', opacity: 0 },
  floatingPanel: { position: 'absolute', bottom: '-20px', left: '15px', right: '15px', background: 'rgba(13, 25, 45, 0.98)', backdropFilter: 'blur(16px)', borderRadius: '16px', overflow: 'hidden', opacity: 0, transform: 'translateY(20px) scale(0.95)', pointerEvents: 'none', zIndex: 20 },
  floatingPanelVisible: { opacity: 1, transform: 'translateY(0) scale(1)', pointerEvents: 'auto', bottom: '-10px' },
  floatingContent: { padding: '16px 18px 18px 18px' },
  floatingDescription: { fontFamily: "'Source Code Pro', monospace", fontWeight: 300, fontSize: '11px', lineHeight: 1.5, color: '#f0ebd8', opacity: 0.85, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  floatingTags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
  floatingTag: { fontFamily: "'Source Code Pro', monospace", fontWeight: 300, fontSize: '8px', letterSpacing: '0.1em', color: '#5e9cfa', background: 'rgba(94, 156, 250, 0.12)', padding: '3px 10px', borderRadius: '14px' },
  floatingMeta: { display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Source Code Pro', monospace", fontWeight: 300, fontSize: '9px', color: '#748cab', paddingTop: '8px', borderTop: '1px solid rgba(116, 140, 171, 0.2)' },
  floatingSeparator: { color: '#748cab', opacity: 0.5 },
  floatingUrl: { marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(94, 156, 250, 0.15)' },
  floatingUrlLink: { fontFamily: "'Source Code Pro', monospace", fontWeight: 350, fontSize: '9px', letterSpacing: '0.12em', color: '#5e9cfa', textDecoration: 'none', display: 'inline-block' },

  workCloseButton: { position: 'fixed', bottom: '48px', right: '48px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.8, zIndex: 31 },
  workCloseButtonHidden: { opacity: 0, pointerEvents: 'none' },
  workCloseIcon: { width: '48px', height: '48px', objectFit: 'contain' },

  // View hints
  viewHint: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    fontFamily: "'Source Code Pro', monospace", fontSize: '16px', fontWeight: 400, letterSpacing: '0.3em',
    color: '#f0ebd8', opacity: 0, transition: 'opacity 0.3s ease', textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
    pointerEvents: 'none', zIndex: 10, background: 'rgba(0, 0, 0, 0.5)', padding: '10px 24px',
    borderRadius: '30px', border: '1px solid rgba(240, 235, 216, 0.2)', backdropFilter: 'blur(4px)'
  },
  viewHintSmall: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    fontFamily: "'Source Code Pro', monospace", fontSize: '11px', fontWeight: 400, letterSpacing: '0.2em',
    color: '#f0ebd8', opacity: 0, transition: 'opacity 0.3s ease', textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
    pointerEvents: 'none', zIndex: 10, background: 'rgba(0, 0, 0, 0.5)', padding: '6px 16px',
    borderRadius: '20px', border: '1px solid rgba(240, 235, 216, 0.15)', backdropFilter: 'blur(4px)'
  },

  // VIDEO/ASSET
  videoContainer: {
    width: '100%', marginTop: '48px', marginBottom: '48px',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    padding: '56px 0 40px', position: 'relative'
  },
  videoWrapper: {
    width: 'min(620px, 78%)', minHeight: '380px', borderRadius: '20px',
    overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(8, 12, 20, 0.45)', border: '1px solid rgba(240, 235, 216, 0.07)',
    boxShadow: '0 40px 90px -45px rgba(0, 0, 0, 0.85), 0 0 80px rgba(94, 156, 250, 0.05)'
  },
  videoPlayer: {
    width: '100%', height: '100%', maxHeight: '440px',
    objectFit: 'contain', display: 'block', background: 'transparent', padding: '32px'
  },
  assetShowcaseHeader: {
    position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
    display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2, opacity: 0.55
  },
  assetShowcaseLabel: {
    fontFamily: "'Source Code Pro', monospace", fontSize: '9px', fontWeight: 350,
    letterSpacing: '0.22em', color: '#748cab', whiteSpace: 'nowrap'
  },
  assetShowcaseLine: { width: '48px', height: '1px', background: 'rgba(116, 140, 171, 0.35)' },

  // Vista Expandida
  immersiveOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(8, 12, 20, 0.95)', backdropFilter: 'blur(20px)', zIndex: 200, overflow: 'hidden' },
  immersiveOverlayOpen: { opacity: 1 },
  immersiveOverlayClosing: { opacity: 0 },
  immersiveHeader: { position: 'fixed', top: 0, left: 0, right: 0, height: '60px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 40px', zIndex: 201, background: 'linear-gradient(to bottom, rgba(8, 12, 20, 0.9), transparent)' },
  immersiveCloseButton: { width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(240, 235, 216, 0.15)', background: 'rgba(13, 19, 33, 0.5)', backdropFilter: 'blur(10px)', color: '#f0ebd8', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.65, fontFamily: "'Source Code Pro', monospace", fontWeight: 300 },
  closeIcon: { lineHeight: 1, fontWeight: 300 },
  landscapeLayout: { display: 'flex', height: '100vh', width: '100%', gap: '60px', overflow: 'hidden' },
  galleryContainer: { flex: '0 0 65%', height: '100%', overflowY: 'auto', overflowX: 'hidden', paddingRight: '20px' },
  heroImageWrapper: { width: '100%', marginBottom: '24px', borderRadius: '16px', overflow: 'hidden', position: 'relative', boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.5)', transition: 'transform 0.4s ease' },
  heroImage: { width: '100%', height: 'auto', aspectRatio: '16 / 9', display: 'block' },
  heroImageGlow: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.05), transparent 60%)', pointerEvents: 'none' },
  secondaryImagesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' },
  secondaryImageCard: { borderRadius: '12px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 25px -10px rgba(0, 0, 0, 0.3)', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.2, 0.95, 0.4, 1) forwards' },
  secondaryImage: { width: '100%', height: 'auto', aspectRatio: '4 / 3', display: 'block' },
  secondaryImageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', opacity: 0 },
  secondaryImageCaption: { fontFamily: "'Source Code Pro', monospace", fontSize: '11px', fontWeight: 300, color: '#f0ebd8', opacity: 0.9, letterSpacing: '0.03em' },

  // INFO PANEL - VERSIÓN PREMIUM - CON DESCRIPCIÓN COMPLETA Y SCROLL INTERNO
  infoPanel: {
    flex: '0 0 35%', height: '100%', display: 'flex', alignItems: 'flex-start',
    animation: 'panelSlideIn 0.8s cubic-bezier(0.2, 0.95, 0.4, 1) 0.2s both',
    paddingRight: '20px'
  },
  infoContent: {
    width: '100%', padding: '44px 36px',
    background: 'rgba(6, 10, 18, 0.65)',
    backdropFilter: 'blur(20px) saturate(1.5)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
    borderRadius: '26px',
    border: '1px solid rgba(240, 235, 216, 0.06)',
    boxShadow: '0 45px 85px -35px rgba(0, 0, 0, 0.65), 0 0 0 0.5px rgba(94, 156, 250, 0.08) inset, 0 8px 20px -8px rgba(0, 0, 0, 0.4)',
    position: 'relative', overflowY: 'auto', overflowX: 'hidden',
    maxHeight: 'calc(100vh - 160px)',
    transition: 'box-shadow 0.4s ease, border-color 0.3s ease'
  },
  infoGlowTop: {
    position: 'absolute', top: '-40px', right: '-20%',
    width: '150%', height: '100px',
    background: 'radial-gradient(ellipse, rgba(94, 156, 250, 0.08), transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
    borderRadius: '100%'
  },
  infoGlowCorner: {
    position: 'absolute', bottom: '20px', left: '20px',
    width: '80px', height: '80px',
    background: 'radial-gradient(circle, rgba(94, 156, 250, 0.04), transparent 80%)',
    pointerEvents: 'none', zIndex: 0
  },
  infoTopLine: {
    width: '48px', height: '2px',
    background: 'linear-gradient(90deg, #5e9cfa, rgba(94, 156, 250, 0.2), transparent)',
    marginBottom: '32px',
    borderRadius: '2px',
    position: 'relative',
    zIndex: 1
  },
  projectHeader: {
    marginBottom: '32px', position: 'relative',
    paddingBottom: '24px', borderBottom: '1px solid rgba(240, 235, 216, 0.05)'
  },
  projectCategory: {
    fontFamily: "'Source Code Pro', monospace", fontSize: '10px', fontWeight: 380,
    letterSpacing: '0.28em', color: '#5e9cfa', textTransform: 'uppercase',
    marginBottom: '16px', display: 'inline-block',
    background: 'rgba(94, 156, 250, 0.08)',
    padding: '4px 12px',
    borderRadius: '20px',
    backdropFilter: 'blur(4px)',
    border: '0.5px solid rgba(94, 156, 250, 0.15)'
  },
  projectTitle: {
    fontFamily: "'Source Code Pro', monospace", fontSize: '38px', fontWeight: 480,
    letterSpacing: '0.03em', color: '#f0ebd8', margin: 0, lineHeight: 1.15,
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)', position: 'relative',
    maxWidth: '100%', wordBreak: 'break-word'
  },
  // DESCRIPCIÓN COMPLETA - SIN TRUNCAR
  projectDescription: {
    fontFamily: "'Source Code Pro', monospace", fontSize: '13px', fontWeight: 320,
    lineHeight: 1.72, color: '#b8c7dc', margin: '0 0 34px 0', letterSpacing: '0.015em',
    maxWidth: '100%', opacity: 0.88, overflow: 'visible',
    textRendering: 'geometricPrecision'
  },
  metadataGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px 24px',
    marginBottom: '32px', padding: '28px 0 24px 0',
    borderTop: '1px solid rgba(240, 235, 216, 0.04)',
    borderBottom: '1px solid rgba(240, 235, 216, 0.04)',
    position: 'relative'
  },
  metadataItem: {
    display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative',
    background: 'rgba(255, 255, 255, 0.01)',
    padding: '6px 0'
  },
  metadataLabel: {
    fontFamily: "'Source Code Pro', monospace", fontSize: '8px', fontWeight: 420,
    letterSpacing: '0.2em', color: '#5e9cfa', textTransform: 'uppercase', opacity: 0.65,
    lineHeight: 1.2
  },
  metadataValue: {
    fontFamily: "'Source Code Pro', monospace", fontSize: '13px', fontWeight: 420,
    color: '#e8e4d4', letterSpacing: '0.01em', opacity: 0.92, lineHeight: 1.35,
    wordBreak: 'break-word'
  },
  tagsContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' },
  tag: {
    fontFamily: "'Source Code Pro', monospace", fontSize: '9px', fontWeight: 370,
    letterSpacing: '0.08em', color: '#6ea8fe', background: 'rgba(94, 156, 250, 0.06)',
    padding: '4px 14px', borderRadius: '24px', border: '0.5px solid rgba(94, 156, 250, 0.2)',
    textTransform: 'uppercase', transition: 'all 0.25s cubic-bezier(0.2, 0.95, 0.4, 1)',
    backdropFilter: 'blur(4px)'
  },
  viewProjectLink: {
    fontFamily: "'Source Code Pro', monospace", fontSize: '11px', fontWeight: 410,
    letterSpacing: '0.1em', color: '#5e9cfa', textDecoration: 'none',
    padding: '10px 0 8px 0', borderBottom: '1px solid rgba(94, 156, 250, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.2, 0.95, 0.4, 1)', display: 'inline-flex',
    alignItems: 'center', gap: '4px', opacity: 0.9,
    background: 'transparent'
  }
}

// Inyectar estilos CSS globales
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes lightboxFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes lightboxImageIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulseGreen { 0% { opacity: 0.5; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.3); } 70% { opacity: 0.8; box-shadow: 0 0 0 4px rgba(16, 61, 185, 0); } 100% { opacity: 0.5; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
  @keyframes gallerySlideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes panelSlideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  
  body.lightbox-open { overflow: hidden; }
  
  .nav-label-bloom:hover {
    text-shadow: 0 0 8px rgba(240, 235, 216, 0.9), 0 0 16px rgba(240, 235, 216, 0.6), 0 0 24px rgba(192, 132, 252, 0.4) !important;
    opacity: 1 !important;
  }
  .secondary-image-card:hover { transform: translateY(-4px); box-shadow: 0 15px 35px -12px rgba(0, 0, 0, 0.5); }
  .secondary-image-card:hover .secondary-image-overlay { opacity: 1; }
  .hero-image-wrapper:hover { box-shadow: 0 35px 70px -25px rgba(0, 0, 0, 0.6); }
  .video-wrapper { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .video-wrapper:hover { transform: translateY(-2px); box-shadow: 0 45px 100px -45px rgba(0, 0, 0, 0.9), 0 0 100px rgba(94, 156, 250, 0.08); }
  
  .tag:hover {
    background: rgba(94, 156, 250, 0.14) !important;
    border-color: rgba(94, 156, 250, 0.4) !important;
    transform: translateY(-1px);
    color: #89b9ff !important;
  }
  .view-project-link::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 0;
    height: 1px;
    background: #5e9cfa;
    transition: width 0.3s cubic-bezier(0.2, 0.95, 0.4, 1);
  }
  .view-project-link:hover::after {
    width: 100%;
  }
  
  .info-content {
    transition: transform 0.3s ease, box-shadow 0.4s ease;
    scrollbar-width: thin;
    scrollbar-color: rgba(240, 235, 216, 0.12) transparent;
  }
  .info-content::-webkit-scrollbar { width: 3px; }
  .info-content::-webkit-scrollbar-track { background: transparent; margin: 20px 0; }
  .info-content::-webkit-scrollbar-thumb { background: rgba(240, 235, 216, 0.12); border-radius: 3px; }
  .info-content::-webkit-scrollbar-thumb:hover { background: rgba(240, 235, 216, 0.22); }
  .info-content:hover {
    border-color: rgba(240, 235, 216, 0.09);
    box-shadow: 0 50px 90px -35px rgba(0, 0, 0, 0.7), 0 0 0 0.5px rgba(94, 156, 250, 0.12) inset;
  }
  .info-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 40px;
    right: 40px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(94, 156, 250, 0.2) 30%, rgba(94, 156, 250, 0.2) 70%, transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .info-content:hover::before { opacity: 1; }
  
  .contact-close-button:hover { opacity: 1 !important; transform: scale(1.1) !important; background: rgba(13, 19, 33, 1) !important; border-color: rgba(240, 235, 216, 0.7) !important; box-shadow: 0 0 15px rgba(94, 156, 250, 0.3) !important; }
  .contact-image-wrapper:hover { filter: drop-shadow(0 0 20px rgba(94, 156, 250, 0.5)) drop-shadow(0 0 40px rgba(94, 156, 250, 0.3)); transform: scale(1.02); }
  .social-button:hover { transform: scale(1.1) !important; }
  .social-button:hover img { filter: brightness(1.2) drop-shadow(0 0 8px rgba(240, 235, 216, 0.8)) !important; }
  .contact-email:hover, .contact-phone:hover { opacity: 1 !important; color: #5e9cfa !important; text-shadow: 0 0 8px rgba(94, 156, 250, 0.4) !important; }

  .gallery-container { scrollbar-width: thin; scrollbar-color: rgba(240, 235, 216, 0.15) transparent; }
  .gallery-container::-webkit-scrollbar { width: 4px; }
  .gallery-container::-webkit-scrollbar-track { background: transparent; }
  .gallery-container::-webkit-scrollbar-thumb { background: rgba(240, 235, 216, 0.15); border-radius: 2px; }
  .work-panel-content { scrollbar-width: none; -ms-overflow-style: none; }
  .work-panel-content::-webkit-scrollbar { display: none; }

  @media (max-width: 1440px) { .landscape-layout { gap: 40px; } }
  @media (max-width: 1200px) { .gallery-container { flex: 0 0 60% !important; } .info-panel { flex: 0 0 40% !important; } }
  @media (max-width: 1024px) {
    .landscape-layout { flex-direction: column !important; gap: 40px; padding: 80px 40px 50px !important; overflow-y: auto; }
    .gallery-container { flex: none !important; width: 100%; height: auto; overflow-y: visible; }
    .info-panel { flex: none !important; width: 100%; height: auto; padding: 0 0 40px; }
    .project-title { font-size: 32px !important; }
    .info-content { padding: 36px 28px !important; border-radius: 22px !important; max-height: none !important; overflow-y: visible !important; }
    .info-content::before { left: 28px; right: 28px; }
    .metadata-grid { gap: 24px 20px !important; padding: 24px 0 !important; }
    .lightbox-image-canvas { max-width: 88vw; max-height: 72vh; padding: 20px; border-radius: 10px; }
    .lightbox-image-canvas-asset { max-height: 60vh; max-width: 80vw; padding: 24px; }
    .video-wrapper { width: min(560px, 85%) !important; min-height: 340px !important; }
    .video-player { max-height: 400px !important; padding: 24px !important; }
  }
  @media (max-width: 768px) {
    .immersive-header { padding: 0 20px; height: 50px; }
    .secondary-images-grid { grid-template-columns: 1fr !important; }
    .project-title { font-size: 28px !important; }
    .metadata-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px 16px !important; padding: 20px 0 !important; }
    .landscape-layout { padding: 70px 20px 40px !important; }
    .info-content { padding: 32px 24px !important; border-radius: 20px !important; }
    .info-content::before { left: 24px; right: 24px; }
    .project-description { max-width: 100% !important; margin-bottom: 28px !important; }
    .tags-container { gap: 6px !important; }
    .tag { padding: 4px 12px !important; font-size: 8px !important; }
    .lightbox-image-canvas { max-width: 90vw; max-height: 70vh; padding: 16px; border-radius: 8px; }
    .lightbox-nav-button { width: 40px; height: 40px; margin: 0 8px; }
    .lightbox-prev-button { left: 4px; }
    .lightbox-next-button { right: 4px; }
    .lightbox-header { height: 56px; padding: 0 16px; }
    .lightbox-counter { font-size: 10px; padding: 4px 10px; }
    .lightbox-close-button { width: 36px; height: 36px; }
    .lightbox-caption { bottom: 20px; max-width: 80vw; padding: 6px 16px; }
    .lightbox-caption-text { font-size: 10px; }
    .video-wrapper { width: min(480px, 90%) !important; min-height: 300px !important; border-radius: 16px !important; }
    .video-player { max-height: 360px !important; padding: 20px !important; }
    .asset-showcase-label { font-size: 8px !important; letter-spacing: 0.18em !important; }
    .asset-showcase-line { width: 32px !important; }
  }
  @media (max-width: 480px) {
    .lightbox-image-canvas { max-width: 94vw; max-height: 66vh; padding: 12px; }
    .lightbox-nav-button { width: 36px; height: 36px; margin: 0 4px; }
    .lightbox-prev-button { left: 2px; }
    .lightbox-next-button { right: 2px; }
    .lightbox-header { height: 50px; padding: 0 12px; }
    .lightbox-close-button { width: 32px; height: 32px; }
    .lightbox-caption { bottom: 16px; max-width: 88vw; }
    .project-title { font-size: 24px !important; }
    .info-content { padding: 28px 20px !important; border-radius: 18px !important; }
    .info-content::before { left: 20px; right: 20px; }
    .metadata-grid { grid-template-columns: 1fr 1fr !important; gap: 16px 12px !important; }
    .metadata-value { font-size: 12px !important; }
    .video-wrapper { width: 92% !important; min-height: 260px !important; border-radius: 14px !important; }
    .video-player { max-height: 300px !important; padding: 16px !important; }
    .asset-showcase-header { top: 6px !important; }
  }
`;
document.head.appendChild(styleSheet);