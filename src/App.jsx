// App.jsx - PORTFOLIO COMPLETO CON DESCRIPCIÓN COMPLETA Y SCROLL EN PANEL
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import Spline from '@splinetool/react-spline'

// Detectar móvil al inicio
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

// Función para determinar el modo de imagen según proyecto e índice
const getImageDisplayMode = (projectId, imageSrc = '', imageIndex = 0) => {
  // Proyecto ORNAMENTAL (id 4) - siempre usar contain para preservar composición
  if (projectId === 4) {
    return { mode: 'contain', bg: true }
  }
  
  // Imágenes de asset/mochila
  if (imageSrc?.toLowerCase().includes('mochila') || 
      imageSrc?.toLowerCase().includes('asset')) {
    return { mode: 'contain', bg: true }
  }
  
  // Para imágenes de detalle técnico (índice alto, captions con detail)
  if (imageIndex >= 2 || imageSrc?.toLowerCase().includes('detail')) {
    return { mode: 'contain', bg: true }
  }
  
  // Por defecto: cinematic cover
  return { mode: 'cover', bg: false }
}

// Componente ImageLightbox Mejorado - CON SISTEMA DE FORMATOS PREMIUM
const ImageLightbox = memo(({ images, currentIndex, onClose, onPrev, onNext, isMobile, projectId }) => {
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
  
  // Determinar el modo de visualización para el lightbox
  const getLightboxMode = () => {
    const src = currentImage.src || ''
    const caption = currentImage.caption || ''
    
    // Proyecto ORNAMENTAL - tratamiento especial cinematográfico
    if (projectId === 4) {
      return { mode: 'ornamental', displayMode: 'contain', bgIntensity: 'high', centered: true }
    }
    
    // Imágenes de asset/mochila
    if (src.toLowerCase().includes('mochila') || 
        src.toLowerCase().includes('asset') ||
        caption.toLowerCase().includes('detail') ||
        caption.toLowerCase().includes('layout')) {
      return { mode: 'asset', displayMode: 'contain', bgIntensity: 'medium', centered: true }
    }
    
    // Imágenes panorámicas (overview, walkthrough, vistas amplias)
    if (caption.toLowerCase().includes('overview') || 
        caption.toLowerCase().includes('walkthrough') ||
        caption.toLowerCase().includes('view') ||
        (projectId === 2 && currentIndex === 0)) {
      return { mode: 'cinematic', displayMode: 'cover', bgIntensity: 'low', centered: false }
    }
    
    // Escenas de ambiente / arquitectura
    if (projectId === 1 || projectId === 3) {
      return { mode: 'cinematic', displayMode: 'cover', bgIntensity: 'low', centered: false }
    }
    
    // Por defecto: contain con fondo elegante
    return { mode: 'standard', displayMode: 'contain', bgIntensity: 'medium', centered: true }
  }
  
  const lightboxConfig = getLightboxMode()
  const isOrnamental = lightboxConfig.mode === 'ornamental'
  const isCinematic = lightboxConfig.mode === 'cinematic'
  const isAsset = lightboxConfig.mode === 'asset'
  const useContain = lightboxConfig.displayMode === 'contain'
  const bgIntensity = lightboxConfig.bgIntensity

  return (
    <div className="lightbox-premium-container" onClick={onClose}>
      <div className={`lightbox-premium-bg bg-${bgIntensity}`} />
      
      <div className="lightbox-premium-header">
        <span className="lightbox-premium-counter">
          {currentIndex + 1} / {images.length}
        </span>
        <button className="lightbox-premium-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="lightbox-premium-main" onClick={(e) => e.stopPropagation()}>
        <button 
          className="lightbox-premium-nav lightbox-premium-prev" 
          onClick={onPrev} 
          disabled={images.length <= 1}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className={`lightbox-premium-canvas 
          ${useContain ? 'canvas-contain' : 'canvas-cover'}
          ${isCinematic ? 'canvas-cinematic' : ''}
          ${isOrnamental ? 'canvas-ornamental' : ''}
          ${isAsset ? 'canvas-asset' : ''}
        `}>
          <img
            src={currentImage.src}
            alt={currentImage.caption || `Image ${currentIndex + 1}`}
            className={`lightbox-premium-img 
              ${useContain ? 'img-contain' : 'img-cover'}
              ${isOrnamental ? 'img-ornamental' : ''}
            `}
            style={isOrnamental ? { objectPosition: 'center 45%' } : {}}
          />
        </div>

        <button 
          className="lightbox-premium-nav lightbox-premium-next" 
          onClick={onNext} 
          disabled={images.length <= 1}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {currentImage.caption && (
        <div className="lightbox-premium-caption">
          <span>{currentImage.caption}</span>
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
          projectId={focusedCard.id}
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

        {/* ============ VISTA INMERSIVA DEL PROYECTO - CON SISTEMA DE FORMATOS DE IMAGEN ============ */}
        {focusedCard && (
          <div className="project-master-view">
            <div className="project-overlay" />
            
            <button className="project-close-btn" onClick={closeFocusedCard}>
              <span>×</span>
            </button>

            <div className="project-layout">
              
              {/* COLUMNA IZQUIERDA - GALERÍA */}
              <div className="project-gallery">
                {/* Hero Image con formato inteligente */}
                {(() => {
                  const heroMode = getImageDisplayMode(focusedCard.id, focusedCard.image, 0)
                  const isHeroContain = heroMode.mode === 'contain'
                  return (
                    <div 
                      className={`gallery-hero ${isHeroContain ? 'hero-contain-mode' : 'hero-cover-mode'}`}
                      onClick={() => openLightbox(0)}
                    >
                      <div className="hero-image-wrapper">
                        <img 
                          src={focusedCard.image} 
                          alt={focusedCard.title}
                          className={`hero-img ${isHeroContain ? 'img-contain' : 'img-cover'}`}
                        />
                      </div>
                      <div className="hero-hint">VIEW</div>
                    </div>
                  )
                })()}

                {/* Secondary Images Grid con formato por imagen */}
                <div className="gallery-grid">
                  {focusedCard.additionalImages?.map((img, idx) => {
                    const imgMode = getImageDisplayMode(focusedCard.id, img.src, idx + 1)
                    const isContain = imgMode.mode === 'contain'
                    return (
                      <div 
                        key={img.id} 
                        className={`grid-item ${isContain ? 'grid-contain-mode' : 'grid-cover-mode'}`}
                        onClick={() => openLightbox(idx + 1)}
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="grid-image-wrapper">
                          <img 
                            src={img.src} 
                            alt={img.caption}
                            className={`grid-img ${isContain ? 'img-contain' : 'img-cover'}`}
                          />
                        </div>
                        <div className="grid-overlay">
                          <span>{img.caption}</span>
                        </div>
                        <div className="grid-hint">VIEW</div>
                      </div>
                    )
                  })}
                </div>

                {/* Video Asset Preview */}
                {focusedCard.videos?.length > 0 && (
                  <div className="gallery-video">
                    <div className="video-container">
                      <video 
                        src={focusedCard.videos[0]} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        preload="auto"
                        className="video-player"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* COLUMNA DERECHA - INFO PANEL */}
              <div className="project-info">
                <div className="info-card">
                  <div className="info-accent-line" />
                  <div className="info-category">{focusedCard.category}</div>
                  <h1 className="info-title">{focusedCard.title}</h1>
                  <p className="info-description">{focusedCard.fullDescription}</p>
                  
                  <div className="info-metadata">
                    <div className="metadata-row">
                      <div className="metadata-field">
                        <span className="field-label">CLIENT</span>
                        <span className="field-value">{focusedCard.client}</span>
                      </div>
                      <div className="metadata-field">
                        <span className="field-label">YEAR</span>
                        <span className="field-value">{focusedCard.year}</span>
                      </div>
                    </div>
                    <div className="metadata-row">
                      <div className="metadata-field">
                        <span className="field-label">ROLE</span>
                        <span className="field-value">{focusedCard.role}</span>
                      </div>
                      <div className="metadata-field">
                        <span className="field-label">SOFTWARE</span>
                        <span className="field-value">
                          {focusedCard.software?.length > 0 ? focusedCard.software.join(', ') : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-tags">
                    {focusedCard.tags.map((tag, idx) => (
                      <span key={idx} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                  
                  {focusedCard.projectUrl && (
                    <a href={focusedCard.projectUrl} target="_blank" rel="noopener noreferrer" className="info-link">
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
  aboutImageOverlay: { position: 'fixed', top: '50%', right: '20%', transform: 'translateY(-50%)', zIndex: 20, transition: 'opacity 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)' },
  aboutImageVisible: { opacity: 1, transform: 'translateY(-50%) translateY(0)' },
  aboutImageHidden: { opacity: 0, transform: 'translateY(-50%) translateY(20px)', pointerEvents: 'none' },
  aboutImageContainer: { position: 'relative', display: 'inline-block' },
  closeButton: { position: 'absolute', top: '65px', right: '50px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(13, 19, 33, 0.9)', border: '1px solid rgba(240, 235, 216, 0.3)', color: '#f0ebd8', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6, backdropFilter: 'blur(4px)', fontFamily: 'monospace', zIndex: 21 },
  aboutImage: { maxWidth: '300px', width: '90%', height: 'auto', borderRadius: '15px', boxShadow: '0 30px 35px -10px rgba(0,0,0,0.3)' },
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
}

// Inyectar estilos CSS globales
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  /* === ANIMACIONES === */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulseGreen {
    0% { opacity: 0.5; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.3); }
    70% { opacity: 0.8; box-shadow: 0 0 0 4px rgba(16, 61, 185, 0); }
    100% { opacity: 0.5; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }

  /* === ESTILOS GLOBALES === */
  body.lightbox-open { overflow: hidden; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  .work-panel-content { scrollbar-width: none; -ms-overflow-style: none; }
  .work-panel-content::-webkit-scrollbar { display: none; }
  
  .nav-label-bloom { transition: all 0.3s ease; cursor: pointer; }
  .nav-label-bloom:hover {
    text-shadow: 0 0 8px rgba(240, 235, 216, 0.9), 0 0 16px rgba(240, 235, 216, 0.6);
    opacity: 1 !important;
  }

  /* === VISTA INMERSIVA DEL PROYECTO === */
  .project-master-view {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 200;
    animation: fadeIn 0.5s ease;
  }

  .project-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(2, 5, 10, 0.94);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }

  .project-close-btn {
    position: fixed;
    top: 28px;
    right: 28px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(13, 19, 33, 0.6);
    border: 1px solid rgba(240, 235, 216, 0.12);
    color: #f0ebd8;
    font-size: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 210;
    transition: all 0.25s ease;
    backdrop-filter: blur(8px);
    opacity: 0.7;
  }

  .project-close-btn:hover {
    opacity: 1;
    transform: scale(1.05);
    background: rgba(13, 19, 33, 0.85);
    border-color: rgba(240, 235, 216, 0.25);
  }

  .project-close-btn span {
    line-height: 1;
    margin-top: -2px;
  }

  .project-layout {
    display: flex;
    height: 100vh;
    width: 100%;
    gap: 0;
    overflow: hidden;
    position: relative;
    z-index: 201;
  }

  /* === COLUMNA IZQUIERDA - GALERÍA === */
  .project-gallery {
    flex: 0 0 58%;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 100px 40px 60px 60px;
    scrollbar-width: thin;
    scrollbar-color: rgba(240, 235, 216, 0.12) transparent;
  }

  .project-gallery::-webkit-scrollbar { width: 4px; }
  .project-gallery::-webkit-scrollbar-track { background: transparent; }
  .project-gallery::-webkit-scrollbar-thumb { background: rgba(240, 235, 216, 0.12); border-radius: 4px; }

  /* Hero Image */
  .gallery-hero {
    position: relative;
    width: 100%;
    margin-bottom: 28px;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .hero-cover-mode {
    background: transparent;
    aspect-ratio: 16 / 9;
  }

  .hero-contain-mode {
    background: #0a0e16;
    aspect-ratio: 4 / 3;
  }

  .hero-image-wrapper {
    width: 100%;
    height: 100%;
  }

  .hero-img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .hero-img.img-cover {
    object-fit: cover;
  }

  .hero-img.img-contain {
    object-fit: contain;
  }

  .gallery-hero:hover {
    transform: scale(1.008);
    box-shadow: 0 30px 60px -25px rgba(0, 0, 0, 0.5);
  }

  .hero-hint {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Source Code Pro', monospace;
    font-size: 11px;
    font-weight: 300;
    letter-spacing: 0.2em;
    color: #f0ebd8;
    background: rgba(0, 0, 0, 0.4);
    padding: 8px 20px;
    border-radius: 30px;
    border: 1px solid rgba(240, 235, 216, 0.15);
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
    backdrop-filter: blur(4px);
  }

  .gallery-hero:hover .hero-hint {
    opacity: 1;
  }

  /* Grid secundario */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .grid-item {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: slideUp 0.5s ease forwards;
    opacity: 0;
  }

  .grid-cover-mode {
    background: transparent;
    aspect-ratio: 4 / 3;
  }

  .grid-contain-mode {
    background: #0a0e16;
    aspect-ratio: 4 / 3;
  }

  .grid-image-wrapper {
    width: 100%;
    height: 100%;
  }

  .grid-img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .grid-img.img-cover {
    object-fit: cover;
  }

  .grid-img.img-contain {
    object-fit: contain;
  }

  .grid-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px -18px rgba(0, 0, 0, 0.5);
  }

  .grid-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 16px 16px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.65), transparent);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .grid-overlay span {
    font-family: 'Source Code Pro', monospace;
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 0.03em;
    color: #f0ebd8;
  }

  .grid-item:hover .grid-overlay {
    opacity: 1;
  }

  .grid-hint {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Source Code Pro', monospace;
    font-size: 9px;
    font-weight: 300;
    letter-spacing: 0.15em;
    color: #f0ebd8;
    background: rgba(0, 0, 0, 0.35);
    padding: 5px 14px;
    border-radius: 20px;
    border: 1px solid rgba(240, 235, 216, 0.12);
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
    backdrop-filter: blur(4px);
  }

  .grid-item:hover .grid-hint {
    opacity: 1;
  }

  /* Video */
  .gallery-video {
    margin-top: 16px;
    margin-bottom: 40px;
  }

  .video-container {
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
    background: #0a0e16;
    border: 1px solid rgba(240, 235, 216, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    aspect-ratio: 16 / 9;
  }

  .video-container:hover {
    transform: translateY(-3px);
    box-shadow: 0 30px 50px -25px rgba(0, 0, 0, 0.5);
  }

  .video-player {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    background: #0a0e16;
  }

  /* === COLUMNA DERECHA - INFO PANEL === */
  .project-info {
    flex: 0 0 42%;
    height: 100vh;
    display: flex;
    align-items: center;
    padding: 100px 60px 60px 20px;
    overflow-y: auto;
  }

  .info-card {
    width: 100%;
    padding: 48px 40px;
    background: rgba(6, 10, 18, 0.55);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 28px;
    border: 1px solid rgba(240, 235, 216, 0.04);
    box-shadow: 0 40px 70px -35px rgba(0, 0, 0, 0.5);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    animation: slideInRight 0.6s ease 0.1s both;
  }

  .info-card:hover {
    border-color: rgba(240, 235, 216, 0.07);
    box-shadow: 0 45px 80px -35px rgba(0, 0, 0, 0.55);
  }

  .info-accent-line {
    width: 42px;
    height: 1px;
    background: linear-gradient(90deg, rgba(94, 156, 250, 0.6), rgba(94, 156, 250, 0.05), transparent);
    margin-bottom: 28px;
  }

  .info-category {
    font-family: 'Source Code Pro', monospace;
    font-size: 9px;
    font-weight: 350;
    letter-spacing: 0.28em;
    color: #8a9bb5;
    text-transform: uppercase;
    margin-bottom: 14px;
  }

  .info-title {
    font-family: 'Source Code Pro', monospace;
    font-size: 38px;
    font-weight: 450;
    letter-spacing: 0.02em;
    color: #f0ebd8;
    margin: 0 0 24px 0;
    line-height: 1.2;
  }

  .info-description {
    font-family: 'Source Code Pro', monospace;
    font-size: 13px;
    font-weight: 300;
    line-height: 1.7;
    color: #b8c4d4;
    margin-bottom: 36px;
    letter-spacing: 0.01em;
  }

  .info-metadata {
    margin-bottom: 32px;
    padding: 24px 0;
    border-top: 1px solid rgba(240, 235, 216, 0.03);
    border-bottom: 1px solid rgba(240, 235, 216, 0.03);
  }

  .metadata-row {
    display: flex;
    gap: 32px;
    margin-bottom: 20px;
  }

  .metadata-row:last-child {
    margin-bottom: 0;
  }

  .metadata-field {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-label {
    font-family: 'Source Code Pro', monospace;
    font-size: 7.5px;
    font-weight: 400;
    letter-spacing: 0.18em;
    color: #8a9bb5;
    text-transform: uppercase;
  }

  .field-value {
    font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    font-weight: 400;
    color: #e2ded0;
    letter-spacing: 0.01em;
    word-break: break-word;
  }

  .info-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 28px;
  }

  .tag-pill {
    font-family: 'Source Code Pro', monospace;
    font-size: 8px;
    font-weight: 350;
    letter-spacing: 0.06em;
    color: #8a9bb5;
    background: rgba(138, 155, 181, 0.08);
    padding: 4px 14px;
    border-radius: 20px;
    transition: all 0.2s ease;
  }

  .tag-pill:hover {
    background: rgba(138, 155, 181, 0.14);
    color: #c8d4e4;
  }

  .info-link {
    font-family: 'Source Code Pro', monospace;
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.08em;
    color: #8a9bb5;
    text-decoration: none;
    padding: 8px 0 6px 0;
    border-bottom: 1px solid rgba(138, 155, 181, 0.3);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.25s ease;
    opacity: 0.8;
  }

  .info-link:hover {
    opacity: 1;
    color: #a8b8cc;
    border-bottom-color: rgba(138, 155, 181, 0.6);
  }

  /* === LIGHTBOX PREMIUM - SISTEMA DE FORMATOS === */
  .lightbox-premium-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(2, 5, 10, 0.98);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
  }

  .lightbox-premium-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: all 0.3s ease;
  }
  
  .lightbox-premium-bg.bg-low {
    width: 40vw;
    height: 40vh;
    background: radial-gradient(ellipse, rgba(94, 156, 250, 0.04), transparent 70%);
  }
  
  .lightbox-premium-bg.bg-medium {
    width: 50vw;
    height: 50vh;
    background: radial-gradient(ellipse, rgba(94, 156, 250, 0.06), rgba(5, 8, 12, 0.2) 70%);
  }
  
  .lightbox-premium-bg.bg-high {
    width: 60vw;
    height: 60vh;
    background: radial-gradient(ellipse, rgba(94, 156, 250, 0.08), rgba(5, 8, 12, 0.3) 70%);
  }

  .lightbox-premium-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 24px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1002;
    background: linear-gradient(to bottom, rgba(2, 5, 10, 0.8), transparent);
  }

  .lightbox-premium-counter {
    font-family: 'Source Code Pro', monospace;
    font-size: 10px;
    font-weight: 300;
    color: #8a9bb5;
    letter-spacing: 0.12em;
    padding: 4px 12px;
    background: rgba(13, 19, 33, 0.4);
    border-radius: 20px;
    border: 1px solid rgba(138, 155, 181, 0.1);
  }

  .lightbox-premium-close {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(13, 19, 33, 0.4);
    border: 1px solid rgba(240, 235, 216, 0.1);
    color: #f0ebd8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    opacity: 0.6;
  }

  .lightbox-premium-close:hover {
    opacity: 1;
    transform: scale(1.05);
    background: rgba(13, 19, 33, 0.7);
    border-color: rgba(240, 235, 216, 0.2);
  }

  .lightbox-premium-main {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 80px 100px;
    z-index: 1001;
  }

  /* Canvas por modo */
  .lightbox-premium-canvas.canvas-contain {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 80vw;
    max-height: 75vh;
    background: rgba(5, 8, 12, 0.4);
    border-radius: 16px;
    padding: 32px;
    transition: all 0.3s ease;
  }
  
  .lightbox-premium-canvas.canvas-cover {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    min-width: 50vw;
    max-width: 85vw;
    height: auto;
    min-height: 45vh;
    max-height: 75vh;
    background: transparent;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .lightbox-premium-canvas.canvas-cinematic {
    width: auto;
    min-width: 65vw;
    max-width: 90vw;
    aspect-ratio: 16 / 9;
    background: #05080c;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.6);
  }
  
  .lightbox-premium-canvas.canvas-ornamental {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    min-width: 45vw;
    max-width: 70vw;
    aspect-ratio: 3 / 4;
    background: linear-gradient(135deg, #0a0e16, #060910);
    border-radius: 24px;
    padding: 28px;
    box-shadow: 0 30px 60px -25px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(94, 156, 250, 0.08) inset;
  }
  
  .lightbox-premium-canvas.canvas-asset {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    min-width: 40vw;
    max-width: 65vw;
    aspect-ratio: 1 / 1;
    background: #0a0e16;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(240, 235, 216, 0.04);
  }

  /* Imagen dentro del canvas */
  .lightbox-premium-img {
    display: block;
  }
  
  .lightbox-premium-img.img-contain {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }
  
  .lightbox-premium-img.img-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }
  
  .lightbox-premium-img.img-ornamental {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.5);
  }

  /* Navegación */
  .lightbox-premium-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(13, 19, 33, 0.5);
    border: 1px solid rgba(240, 235, 216, 0.1);
    color: #f0ebd8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;
    opacity: 0.5;
    z-index: 1003;
    backdrop-filter: blur(4px);
  }

  .lightbox-premium-nav:hover:not(:disabled) {
    opacity: 1;
    background: rgba(13, 19, 33, 0.8);
    border-color: rgba(240, 235, 216, 0.25);
    transform: translateY(-50%) scale(1.08);
  }

  .lightbox-premium-nav:disabled {
    opacity: 0;
    cursor: default;
    visibility: hidden;
  }

  .lightbox-premium-prev {
    left: 32px;
  }

  .lightbox-premium-next {
    right: 32px;
  }

  /* Caption */
  .lightbox-premium-caption {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 18px;
    background: rgba(13, 19, 33, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 24px;
    border: 1px solid rgba(240, 235, 216, 0.06);
    font-family: 'Source Code Pro', monospace;
    font-size: 10px;
    font-weight: 300;
    color: #a8b8cc;
    letter-spacing: 0.06em;
    z-index: 1002;
    white-space: nowrap;
    max-width: 80vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* === RESPONSIVE === */
  @media (max-width: 1200px) {
    .project-layout {
      flex-direction: column;
      overflow-y: auto;
    }
    .project-gallery {
      flex: none;
      height: auto;
      padding: 80px 30px 30px 30px;
    }
    .project-info {
      flex: none;
      height: auto;
      padding: 0 30px 60px 30px;
    }
    .info-title {
      font-size: 32px;
    }
    .info-card {
      padding: 40px 32px;
    }
    .lightbox-premium-main {
      padding: 60px 80px;
    }
    .lightbox-premium-canvas.canvas-cinematic {
      min-width: 75vw;
    }
    .lightbox-premium-canvas.canvas-ornamental {
      min-width: 55vw;
      max-width: 80vw;
    }
    .lightbox-premium-canvas.canvas-asset {
      min-width: 50vw;
      max-width: 70vw;
    }
  }

  @media (max-width: 768px) {
    .project-close-btn {
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      font-size: 24px;
    }
    .project-gallery {
      padding: 70px 20px 20px 20px;
    }
    .project-info {
      padding: 0 20px 40px 20px;
    }
    .gallery-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .info-title {
      font-size: 28px;
    }
    .info-card {
      padding: 32px 24px;
      border-radius: 24px;
    }
    .metadata-row {
      flex-direction: column;
      gap: 16px;
    }
    .lightbox-premium-main {
      padding: 40px 50px;
    }
    .lightbox-premium-canvas.canvas-contain {
      padding: 20px;
      max-width: 88vw;
      max-height: 70vh;
    }
    .lightbox-premium-canvas.canvas-cover {
      min-width: 70vw;
      max-width: 90vw;
      min-height: 40vh;
    }
    .lightbox-premium-canvas.canvas-cinematic {
      min-width: 85vw;
    }
    .lightbox-premium-canvas.canvas-ornamental {
      min-width: 70vw;
      max-width: 85vw;
      padding: 20px;
    }
    .lightbox-premium-canvas.canvas-asset {
      min-width: 65vw;
      max-width: 80vw;
      padding: 24px;
    }
    .lightbox-premium-nav {
      width: 38px;
      height: 38px;
    }
    .lightbox-premium-prev {
      left: 16px;
    }
    .lightbox-premium-next {
      right: 16px;
    }
    .lightbox-premium-caption {
      white-space: normal;
      text-align: center;
      max-width: 85vw;
      font-size: 9px;
      bottom: 20px;
      padding: 5px 14px;
    }
    .lightbox-premium-header {
      padding: 18px 24px;
    }
  }

  @media (max-width: 480px) {
    .info-title {
      font-size: 24px;
    }
    .info-card {
      padding: 28px 20px;
      border-radius: 20px;
    }
    .info-description {
      font-size: 12px;
      line-height: 1.6;
    }
    .field-value {
      font-size: 11px;
    }
    .hero-contain-mode {
      background: #0a0e16;
    }
    .grid-contain-mode {
      background: #0a0e16;
    }
    .lightbox-premium-main {
      padding: 30px 30px;
    }
    .lightbox-premium-canvas.canvas-contain {
      padding: 16px;
      max-width: 92vw;
      max-height: 65vh;
    }
    .lightbox-premium-canvas.canvas-cinematic {
      min-width: 92vw;
    }
    .lightbox-premium-canvas.canvas-ornamental {
      min-width: 85vw;
      max-width: 92vw;
      padding: 16px;
    }
    .lightbox-premium-canvas.canvas-asset {
      min-width: 80vw;
      max-width: 90vw;
      padding: 20px;
    }
    .lightbox-premium-nav {
      width: 34px;
      height: 34px;
    }
    .lightbox-premium-prev {
      left: 8px;
    }
    .lightbox-premium-next {
      right: 8px;
    }
    .lightbox-premium-close {
      width: 34px;
      height: 34px;
    }
    .lightbox-premium-counter {
      font-size: 9px;
      padding: 3px 10px;
    }
  }
`;

document.head.appendChild(styleSheet);