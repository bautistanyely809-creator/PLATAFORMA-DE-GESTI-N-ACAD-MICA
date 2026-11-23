import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Zap, RefreshCw, Play, Pause, Edit3, X, Check, RotateCcw, User } from 'lucide-react';

// Reglas institucionales de emojis por defecto según Rol y Género
const DEFAULT_ROLE_EMOJIS = {
  estudiante: {
    femenino: '👩🏼‍🎓',
    masculino: '👨🏻‍🎓'
  },
  aprendiz: {
    femenino: '👩🏼‍🎓',
    masculino: '👨🏻‍🎓'
  },
  profesor: {
    femenino: '👩🏻‍🏫',
    masculino: '👨🏻‍🏫'
  },
  instructor: {
    femenino: '👩🏻‍🏫',
    masculino: '👨🏻‍🏫'
  },
  admin: {
    masculino: '👨🏻‍💼',
    femenino: '👨🏻‍💼' // Regla: admin solo hombre
  },
  administrador: {
    masculino: '👨🏻‍💼',
    femenino: '👨🏻‍💼'
  }
};

const SUGGESTED_EMOJIS = [
  '👩🏼‍🎓', '👨🏻‍🎓', '👩🏻‍🏫', '👨🏻‍🏫', '👨🏻‍💼', '🧑‍🎓',
  '🧑‍🏫', '🧑‍💼', '👩‍💻', '👨‍💻', '👩‍🔬', '👨‍🔬',
  '🦉', '📚', '💡', '⭐', '🚀', '🎯'
];

export default function Hero3DCanvas({ className = '', variant = 'bone', user = null }) {
  const mountRef = useRef(null);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const objectsRef = useRef({});
  const isDraggingBookRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  // 1. Estados de animación de Three.js
  const speeds = [0.5, 1, 1.5, 2];
  const [speedIndex, setSpeedIndex] = useState(1);
  const speedIndexRef = useRef(1);

  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  const [isWireframe, setIsWireframe] = useState(false);
  const isWireframeRef = useRef(false);

  const [pulseActive, setPulseActive] = useState(false);
  const pulseActiveRef = useRef(false);

  const floatingTimeRef = useRef(0);

  // 2. Estados del Avatar / Emoji Interactivo y Movible
  // Detectar rol y género inicial
  const userRole = (user?.rol || localStorage.getItem('edunova_user_role') || 'estudiante').toLowerCase();
  const initialGender = localStorage.getItem('edunova_user_gender') || 'femenino';

  const getDefaultEmoji = (r, g) => {
    const roleKey = r.toLowerCase();
    const genderKey = g.toLowerCase();
    return DEFAULT_ROLE_EMOJIS[roleKey]?.[genderKey] || '👩🏼‍🎓';
  };

  const [currentEmoji, setCurrentEmoji] = useState(() => {
    return localStorage.getItem('edunova_user_avatar') || getDefaultEmoji(userRole, initialGender);
  });

  const [selectedRole, setSelectedRole] = useState(userRole);
  const [selectedGender, setSelectedGender] = useState(initialGender);

  // Posición del avatar en el contenedor (x, y) con persistencia
  const [avatarPos, setAvatarPos] = useState(() => {
    const saved = localStorage.getItem('edunova_hero_avatar_pos');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return { x: 16, y: 16 }; // Esquina superior izquierda por defecto
  });

  const isDraggingAvatarRef = useRef(false);
  const dragAvatarStartRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

  // Modal / Popover de edición de avatar
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [customInputEmoji, setCustomInputEmoji] = useState('');
  const [tempPreviewEmoji, setTempPreviewEmoji] = useState(currentEmoji);

  // Inicialización de la Escena Three.js con libro 3D corregido
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 340;
    const height = currentMount.clientHeight || 240;

    // Escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Cámara con encuadre suave
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 6.8);
    camera.lookAt(0, 0, 0);

    // Renderizador WebGL con antialiasing y color ACESFilmic
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    if (renderer.outputColorSpace !== undefined) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Luces de Estudio Suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf0, 1.5);
    keyLight.position.set(4, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffe2d0, 0.75);
    fillLight.position.set(-5, 2.5, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);

    const spotLight = new THREE.PointLight(0xfff5e6, 0.65, 10);
    spotLight.position.set(0, 3, 2.5);
    scene.add(spotLight);

    // Grupo Raíz con inclinación frontal para ver páginas desde arriba/frente
    const rootGroup = new THREE.Group();
    const defaultTiltX = 0.45;
    rootGroup.rotation.x = defaultTiltX;
    scene.add(rootGroup);

    // Grupo de rotación continua 360° en Y
    const bookGroup = new THREE.Group();
    rootGroup.add(bookGroup);

    // --- MATERIALES PBR SUAVES (SOFT 3D CLAY) ---
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: 0xee3b2b,
      roughness: 0.35,
      metalness: 0.05,
      flatShading: false,
      side: THREE.DoubleSide
    });

    const pageMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4efe4,
      roughness: 0.38,
      metalness: 0.02,
      flatShading: false,
      side: THREE.DoubleSide
    });

    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3a,
      roughness: 0.32,
      metalness: 0.06,
      flatShading: false
    });

    const registeredMaterials = [coverMaterial, pageMaterial, textMaterial];

    // Función de curvatura convexa en arco de las hojas
    const getPageHeight = (x, maxW, peakH) => {
      const u = Math.max(0, Math.min(1, Math.abs(x) / maxW));
      return Math.sin(u * Math.PI * 0.82 + 0.14) * peakH - Math.sin(0.14) * peakH;
    };

    const pageHalfW = 1.35;
    const pageDepth = 2.05;
    const archH = 0.38;

    // --- 1. BASE: TAPA ROJA/CORAL GRUESA Y REDONDEADA (#EE3B2B) ---
    // Ubicada estrictamente en la base inferior (Y = -0.16)
    const coverHalfW = pageHalfW + 0.12;
    const coverDepth = pageDepth + 0.18;
    const coverThick = 0.10;
    const coverBaseY = -0.16;

    const coverShape = new THREE.Shape();
    const cSteps = 32;

    coverShape.moveTo(-coverHalfW, coverBaseY + getPageHeight(-coverHalfW, coverHalfW, archH));
    for (let i = 0; i <= cSteps; i++) {
      const x = -coverHalfW + (i / cSteps) * (2 * coverHalfW);
      const y = coverBaseY + getPageHeight(x, coverHalfW, archH);
      coverShape.lineTo(x, y);
    }
    const cRightY = coverBaseY + getPageHeight(coverHalfW, coverHalfW, archH);
    coverShape.lineTo(coverHalfW, cRightY - coverThick);

    for (let i = cSteps; i >= 0; i--) {
      const x = -coverHalfW + (i / cSteps) * (2 * coverHalfW);
      const y = coverBaseY + getPageHeight(x, coverHalfW, archH) - coverThick;
      coverShape.lineTo(x, y);
    }
    coverShape.closePath();

    const coverGeo = new THREE.ExtrudeGeometry(coverShape, {
      steps: 1,
      depth: coverDepth,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.045,
      bevelSegments: 6
    });
    // Trasladar Z para centrar la profundidad
    coverGeo.translate(0, 0, -coverDepth / 2);
    coverGeo.computeVertexNormals();

    const coverMesh = new THREE.Mesh(coverGeo, coverMaterial);
    coverMesh.castShadow = true;
    coverMesh.receiveShadow = true;
    bookGroup.add(coverMesh);

    // --- 2. MEDIO: DOS BLOQUES DE HOJAS COLOR CREMA EN 2 CAPAS ESCALONADAS (#F4EFE4) ---
    // Colocados estrictamente encima de la tapa roja (Capa 1 en Y=-0.05, Capa 2 en Y=0.03)
    const layers = [
      { w: pageHalfW + 0.03, d: pageDepth + 0.05, thick: 0.07, yBase: -0.05 },
      { w: pageHalfW,        d: pageDepth,        thick: 0.07, yBase: 0.03 }
    ];

    layers.forEach((layer) => {
      const layerShape = new THREE.Shape();
      const pSteps = 28;

      layerShape.moveTo(-layer.w, layer.yBase + getPageHeight(-layer.w, layer.w, archH));
      for (let i = 0; i <= pSteps; i++) {
        const x = -layer.w + (i / pSteps) * (2 * layer.w);
        const y = layer.yBase + getPageHeight(x, layer.w, archH);
        layerShape.lineTo(x, y);
      }

      const rY = layer.yBase + getPageHeight(layer.w, layer.w, archH);
      layerShape.lineTo(layer.w, rY - layer.thick);

      for (let i = pSteps; i >= 0; i--) {
        const x = -layer.w + (i / pSteps) * (2 * layer.w);
        const y = layer.yBase + getPageHeight(x, layer.w, archH) - layer.thick;
        layerShape.lineTo(x, y);
      }
      layerShape.closePath();

      const layerGeo = new THREE.ExtrudeGeometry(layerShape, {
        steps: 1,
        depth: layer.d,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 5
      });
      layerGeo.translate(0, 0, -layer.d / 2);
      layerGeo.computeVertexNormals();

      const layerMesh = new THREE.Mesh(layerGeo, pageMaterial);
      layerMesh.castShadow = true;
      layerMesh.receiveShadow = true;
      bookGroup.add(layerMesh);
    });

    // --- 3. ARRIBA: 5 LÍNEAS DE TEXTO OSCURAS POR PÁGINA (ESTRICTAMENTE CONTENIDAS) ---
    // Ubicadas sobre la superficie superior de la capa crema 2 + 0.012 de relieve
    const textGroup = new THREE.Group();
    bookGroup.add(textGroup);

    const topLayer = layers[1];
    const numLines = 5;
    const zStart = -topLayer.d * 0.34;
    const zEnd = topLayer.d * 0.34;
    const zStep = (zEnd - zStart) / (numLines - 1);

    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < numLines; i++) {
        const lineZ = zStart + i * zStep;
        const lengthFactor = (i === numLines - 1) ? 0.72 : 1.0;
        
        const innerX = 0.28;
        const outerX = 0.28 + (1.12 - 0.28) * lengthFactor;
        
        const startX = side === 1 ? innerX : -outerX;
        const endX = side === 1 ? outerX : -innerX;

        const linePoints = [];
        const samples = 14;

        for (let s = 0; s <= samples; s++) {
          const t = s / samples;
          const px = startX + t * (endX - startX);
          const py = topLayer.yBase + getPageHeight(px, topLayer.w, archH) + 0.012;
          linePoints.push(new THREE.Vector3(px, py, lineZ));
        }

        const curve = new THREE.CatmullRomCurve3(linePoints);
        const tubeRadius = 0.022;
        const tubeGeo = new THREE.TubeGeometry(curve, 14, tubeRadius, 8, false);
        tubeGeo.computeVertexNormals();

        const tubeMesh = new THREE.Mesh(tubeGeo, textMaterial);
        tubeMesh.castShadow = true;
        textGroup.add(tubeMesh);

        const sphereGeo = new THREE.SphereGeometry(tubeRadius, 8, 8);
        const startCap = new THREE.Mesh(sphereGeo, textMaterial);
        startCap.position.copy(linePoints[0]);
        textGroup.add(startCap);

        const endCap = new THREE.Mesh(sphereGeo, textMaterial);
        endCap.position.copy(linePoints[samples]);
        textGroup.add(endCap);
      }
    }

    // Micro-partículas de ambiente
    const particleCount = 60;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cWhite = new THREE.Color(0xfcfbf9);
    const cOrange = new THREE.Color(0xee6018);
    const cGreen = new THREE.Color(0xa0ca92);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const r = 2.2 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[idx + 2] = r * Math.cos(phi);

      const rand = Math.random();
      const col = rand < 0.65 ? cWhite : rand < 0.85 ? cOrange : cGreen;
      particleColors[idx] = col.r;
      particleColors[idx + 1] = col.g;
      particleColors[idx + 2] = col.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleCloud);

    // Referencias
    objectsRef.current = {
      rootGroup,
      bookGroup,
      particleCloud,
      registeredMaterials,
      camera,
      renderer,
      targetTilt: { x: 0, y: 0 },
      defaultTiltX
    };

    // Bucle de Animación
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const currentSpeed = speeds[speedIndexRef.current];

      if (!isPausedRef.current && bookGroup) {
        // Giro continuo 360° en Y
        bookGroup.rotation.y += 0.015 * currentSpeed;

        // Flotación senoidal
        floatingTimeRef.current += delta * currentSpeed;
        bookGroup.position.y = Math.sin(floatingTimeRef.current * 1.8) * 0.06;

        // Parallax hacia el cursor
        const { targetTilt } = objectsRef.current;
        rootGroup.rotation.x += (defaultTiltX + targetTilt.x - rootGroup.rotation.x) * 0.05;
        rootGroup.rotation.z += (targetTilt.y * 0.4 - rootGroup.rotation.z) * 0.05;

        particleCloud.rotation.y += 0.04 * delta * currentSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount || !renderer || !camera) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(currentMount);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      coverGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      registeredMaterials.forEach(m => m.dispose());
      renderer.dispose();
    };
  }, [variant]);

  // Arrastre 360° del libro 3D con el puntero
  const handlePointerDown = (e) => {
    // Si se hace clic sobre el avatar flotante, no arrastrar el libro
    if (e.target.closest('.interactive-avatar-pill') || e.target.closest('.avatar-editor-popover')) return;

    isDraggingBookRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!objectsRef.current.bookGroup) return;

    if (isDraggingBookRef.current) {
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      objectsRef.current.bookGroup.rotation.y += deltaX * 0.01;
      objectsRef.current.rootGroup.rotation.x += deltaY * 0.006;

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (objectsRef.current.targetTilt) {
        objectsRef.current.targetTilt.x = ny * 0.16;
        objectsRef.current.targetTilt.y = nx * 0.22;
      }
    }
  };

  const handlePointerUp = () => {
    isDraggingBookRef.current = false;
  };

  // --- MOTOR DE ARRASTRE DEL AVATAR (DRAG & DROP CON POINTER EVENTS) ---
  const handleAvatarPointerDown = (e) => {
    e.stopPropagation();
    isDraggingAvatarRef.current = true;
    dragAvatarStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startX: avatarPos.x,
      startY: avatarPos.y
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleAvatarPointerMove = (e) => {
    if (!isDraggingAvatarRef.current || !containerRef.current) return;
    e.stopPropagation();

    const deltaX = e.clientX - dragAvatarStartRef.current.x;
    const deltaY = e.clientY - dragAvatarStartRef.current.y;

    let newX = dragAvatarStartRef.current.startX + deltaX;
    let newY = dragAvatarStartRef.current.startY + deltaY;

    // Confinar dentro del contenedor visual del Hero Card
    const rect = containerRef.current.getBoundingClientRect();
    const maxX = rect.width - 150;
    const maxY = rect.height - 56;

    newX = Math.max(8, Math.min(newX, maxX));
    newY = Math.max(34, Math.min(newY, maxY));

    setAvatarPos({ x: newX, y: newY });
  };

  const handleAvatarPointerUp = (e) => {
    if (!isDraggingAvatarRef.current) return;
    isDraggingAvatarRef.current = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
    // Guardar posición en localStorage
    localStorage.setItem('edunova_hero_avatar_pos', JSON.stringify(avatarPos));
  };

  // Guardar nuevo emoji seleccionado
  const handleSaveAvatar = (newEmoji, newRole, newGender) => {
    const emojiToSave = newEmoji || tempPreviewEmoji;
    setCurrentEmoji(emojiToSave);
    if (newRole) setSelectedRole(newRole);
    if (newGender) setSelectedGender(newGender);

    localStorage.setItem('edunova_user_avatar', emojiToSave);
    if (newGender) localStorage.setItem('edunova_user_gender', newGender);
    if (newRole) localStorage.setItem('edunova_user_role', newRole);

    // Emitir evento para sincronizar con Header u otros componentes
    window.dispatchEvent(new CustomEvent('edunova_avatar_updated', { detail: { emoji: emojiToSave } }));
    setIsEditorOpen(false);
  };

  // Controles de Animación Three.js
  const togglePlayPause = useCallback(() => {
    const nextState = !isPausedRef.current;
    isPausedRef.current = nextState;
    setIsPaused(nextState);
  }, []);

  const cycleSpeed = useCallback(() => {
    const nextIndex = (speedIndexRef.current + 1) % speeds.length;
    speedIndexRef.current = nextIndex;
    setSpeedIndex(nextIndex);
  }, [speeds.length]);

  const toggleWireframe = useCallback(() => {
    const nextState = !isWireframeRef.current;
    isWireframeRef.current = nextState;
    setIsWireframe(nextState);
    if (objectsRef.current.registeredMaterials) {
      objectsRef.current.registeredMaterials.forEach(mat => {
        mat.wireframe = nextState;
      });
    }
  }, []);

  const triggerPulse = useCallback(() => {
    if (pulseActiveRef.current || !objectsRef.current.bookGroup) return;
    pulseActiveRef.current = true;
    setPulseActive(true);

    const { bookGroup } = objectsRef.current;
    let progress = 0;
    const initialRotY = bookGroup.rotation.y;

    const pulseInterval = setInterval(() => {
      progress += 0.05;
      const peak = Math.sin(progress * Math.PI);

      const s = 1 + peak * 0.2;
      if (bookGroup) {
        bookGroup.scale.set(s, s, s);
        bookGroup.rotation.y = initialRotY + progress * Math.PI * 2;
      }

      if (progress >= 1) {
        clearInterval(pulseInterval);
        if (bookGroup) {
          bookGroup.scale.set(1, 1, 1);
          bookGroup.rotation.y = initialRotY;
        }
        pulseActiveRef.current = false;
        setPulseActive(false);
      }
    }, 20);
  }, []);

  const resetOrientation = useCallback(() => {
    if (objectsRef.current.rootGroup && objectsRef.current.bookGroup) {
      const { defaultTiltX, rootGroup, bookGroup } = objectsRef.current;
      objectsRef.current.targetTilt = { x: 0, y: 0 };
      rootGroup.rotation.set(defaultTiltX, 0, 0);
      bookGroup.rotation.set(0, 0, 0);
      bookGroup.scale.set(1, 1, 1);
      bookGroup.position.set(0, 0, 0);
    }
  }, []);

  // Resetear la posición del avatar flotante a la esquina superior izquierda
  const resetAvatarPosition = (e) => {
    e.stopPropagation();
    const defaultPos = { x: 16, y: 16 };
    setAvatarPos(defaultPos);
    localStorage.setItem('edunova_hero_avatar_pos', JSON.stringify(defaultPos));
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col items-center select-none ${className}`}>
      
      {/* Encabezado Superior */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 text-[10px] font-mono text-[#4d4947] border-b border-[#3d3a39]/20 z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
          <span className="uppercase tracking-wider font-medium text-[#101010]">
            BIBLIOTECA VIRTUAL // LIBRO 3D INTERACTIVO
          </span>
        </div>
        
        {/* Acceso rápido a modificar avatar desde el encabezado */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTempPreviewEmoji(currentEmoji);
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 bg-white/80 hover:bg-white text-[#101010] border border-[#3d3a39]/20 rounded text-[9px] font-sans font-medium transition-colors"
            title="Modificar avatar / emoji"
          >
            <span>{currentEmoji}</span>
            <span className="hidden sm:inline">Modificar</span>
            <Edit3 size={9} className="text-[#ee6018]" />
          </button>
          <span className="text-[#8c8682] tracking-wider font-medium">THREE.JS WEBGL</span>
        </div>
      </div>

      {/* Contenedor del Canvas Interactivo Three.js */}
      <div 
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-48 sm:h-56 cursor-grab active:cursor-grabbing relative flex items-center justify-center overflow-hidden"
        title="Arrastra con el ratón para rotar el libro 360°"
      >
        {/* ======================================================================== */}
        {/* AVATAR / EMOJI MOVIBLE (DRAGGABLE) Y EDITABLE SOBRE LA ESCENA */}
        {/* ======================================================================== */}
        <div
          onPointerDown={handleAvatarPointerDown}
          onPointerMove={handleAvatarPointerMove}
          onPointerUp={handleAvatarPointerUp}
          onPointerCancel={handleAvatarPointerUp}
          style={{ left: `${avatarPos.x}px`, top: `${avatarPos.y}px` }}
          className="interactive-avatar-pill absolute z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#3d3a39]/20 rounded-full px-2.5 py-1.5 shadow-md cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow group"
          title="Arrastra para mover este avatar · Clic en ✏️ para editar emoji"
        >
          {/* Círculo con el Emoji */}
          <div 
            onClick={() => {
              setTempPreviewEmoji(currentEmoji);
              setIsEditorOpen(true);
            }}
            className="text-2xl leading-none w-8 h-8 flex items-center justify-center bg-[#faf9f5] rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
          >
            {currentEmoji}
          </div>

          {/* Información y Rol del Usuario */}
          <div className="flex flex-col text-left pointer-events-none">
            <span className="text-[10px] font-bold text-[#1c1a19] leading-tight">
              {user?.nombre || 'Laura Martínez'}
            </span>
            <span className="text-[8px] font-mono uppercase tracking-wider text-[#ee6018] font-semibold leading-tight">
              {selectedRole} · {selectedGender}
            </span>
          </div>

          {/* Botón de editar emoji rápido */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTempPreviewEmoji(currentEmoji);
              setIsEditorOpen(true);
            }}
            className="w-5 h-5 bg-[#ee6018] hover:bg-[#d85513] text-white rounded-full flex items-center justify-center text-[10px] shadow transition-colors ml-0.5"
            title="Cambiar emoji"
          >
            <Edit3 size={10} />
          </button>
        </div>

        {/* Leyenda Inferior Sutil */}
        <div className="absolute bottom-1.5 left-2 pointer-events-none text-[9px] font-mono text-[#4d4947]/70">
          Arrastrar para rotar · 360°
        </div>
      </div>

      {/* ======================================================================== */}
      {/* MODAL / POPOVER FLOTANTE: MODIFICAR AVATAR / EMOJI DIRECTAMENTE AQUÍ */}
      {/* ======================================================================== */}
      {isEditorOpen && (
        <div className="avatar-editor-popover absolute inset-x-2 top-8 bottom-2 bg-white/95 backdrop-blur-md border border-[#3d3a39]/25 rounded-lg shadow-2xl z-30 p-3.5 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150">
          
          {/* Cabecera del Editor */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{tempPreviewEmoji}</span>
              <span className="text-xs font-bold text-[#1c1a19]">Personalizar Avatar / Emoji</span>
            </div>
            <button
              onClick={() => setIsEditorOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded"
            >
              <X size={14} />
            </button>
          </div>

          {/* Selector de Rol y Género para aplicar las reglas institucionales */}
          <div className="grid grid-cols-2 gap-2 text-left pt-1">
            <div>
              <label className="block text-[9px] font-mono text-[#78716c] uppercase font-semibold mb-0.5">
                Rol Institucional:
              </label>
              <select
                value={selectedRole}
                onChange={(e) => {
                  const newR = e.target.value;
                  setSelectedRole(newR);
                  const newDef = getDefaultEmoji(newR, selectedGender);
                  setTempPreviewEmoji(newDef);
                }}
                className="w-full text-xs p-1 border border-gray-200 rounded bg-[#faf9f5] focus:outline-none focus:ring-1 focus:ring-[#ee6018]"
              >
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor / Instructor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-mono text-[#78716c] uppercase font-semibold mb-0.5">
                Género:
              </label>
              <select
                value={selectedGender}
                disabled={selectedRole === 'admin'}
                onChange={(e) => {
                  const newG = e.target.value;
                  setSelectedGender(newG);
                  const newDef = getDefaultEmoji(selectedRole, newG);
                  setTempPreviewEmoji(newDef);
                }}
                className="w-full text-xs p-1 border border-gray-200 rounded bg-[#faf9f5] focus:outline-none focus:ring-1 focus:ring-[#ee6018] disabled:opacity-50"
              >
                <option value="femenino">Femenino (Mujer)</option>
                <option value="masculino">Masculino (Hombre)</option>
              </select>
            </div>
          </div>

          {/* Grilla de Emojis Sugeridos */}
          <div className="text-left py-1">
            <span className="block text-[9px] font-mono text-[#78716c] uppercase font-semibold mb-1">
              Sugerencias Rápidas:
            </span>
            <div className="grid grid-cols-6 gap-1">
              {SUGGESTED_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setTempPreviewEmoji(emoji)}
                  className={`text-lg p-1 rounded border transition-transform hover:scale-110 active:scale-95 flex items-center justify-center ${
                    tempPreviewEmoji === emoji ? 'bg-[#ee6018]/15 border-[#ee6018]' : 'bg-[#faf9f5] border-gray-100 hover:border-gray-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Escribir o pegar cualquier otro emoji */}
          <div className="text-left">
            <div className="flex gap-1.5 items-center">
              <input
                type="text"
                placeholder="Escribe o pega cualquier emoji..."
                value={customInputEmoji}
                onChange={(e) => setCustomInputEmoji(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customInputEmoji.trim()) {
                    e.preventDefault();
                    setTempPreviewEmoji(customInputEmoji.trim());
                    setCustomInputEmoji('');
                  }
                }}
                className="flex-1 text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#ee6018]"
              />
              <button
                type="button"
                onClick={() => {
                  if (customInputEmoji.trim()) {
                    setTempPreviewEmoji(customInputEmoji.trim());
                    setCustomInputEmoji('');
                  }
                }}
                className="px-2 py-1 bg-[#101010] text-white text-[10px] font-mono rounded hover:bg-[#2d2926]"
              >
                Aplicar
              </button>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                const def = getDefaultEmoji(selectedRole, selectedGender);
                setTempPreviewEmoji(def);
              }}
              className="text-[10px] font-mono text-[#ee6018] hover:underline flex items-center gap-1"
            >
              <RotateCcw size={10} />
              <span>Por Defecto</span>
            </button>

            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-2 py-1 text-[10px] text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSaveAvatar(tempPreviewEmoji, selectedRole, selectedGender)}
                className="px-3 py-1 bg-[#ee6018] hover:bg-[#d85513] text-white text-[10px] font-mono font-medium rounded flex items-center gap-1 shadow-sm"
              >
                <Check size={11} />
                <span>Guardar</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Barra de Controles Inferiores */}
      <div className="w-full flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-[#3d3a39]/20 z-10">
        
        <div className="flex items-center gap-1">
          {/* Botón: PAUSE / PLAY */}
          <button
            onClick={togglePlayPause}
            className="px-2 py-1 bg-[#101010] hover:bg-[#1d1a18] text-[#fafafa] rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors border border-[#3d3a39]"
            title={isPaused ? "Reanudar giro continuo" : "Pausar giro y flotación"}
          >
            {isPaused ? <Play size={10} className="text-[#a0ca92]" /> : <Pause size={10} className="text-[#ee6018]" />}
            <span>{isPaused ? 'PLAY' : 'PAUSE'}</span>
          </button>

          {/* Botón: Selector de Velocidad (0.5x, 1x, 1.5x, 2x) */}
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 bg-[#ffffff]/60 hover:bg-[#ffffff] text-[#101010] rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors border border-[#3d3a39]/30"
            title="Ajustar velocidad de rotación"
          >
            <RotateCw size={10} />
            <span>{speeds[speedIndex]}x</span>
          </button>

          {/* Botón: Modo de Vista SÓLIDO / ALAMBRE */}
          <button
            onClick={toggleWireframe}
            className={`px-2 py-1 rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors border ${
              isWireframe 
                ? 'bg-[#ee6018] text-white border-[#ee6018]' 
                : 'bg-[#ffffff]/60 hover:bg-[#ffffff] text-[#101010] border-[#3d3a39]/30'
            }`}
            title="Alternar entre acabado soft-3D sólido y vista wireframe"
          >
            <Eye size={10} />
            <span>{isWireframe ? 'ALAMBRE' : 'SÓLIDO'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Botón: PULSO */}
          <button
            onClick={triggerPulse}
            disabled={pulseActive}
            className="px-2 py-1 bg-[#ee6018] hover:bg-[#d85513] text-white rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors disabled:opacity-50"
            title="Disparar giro rápido con rebote de escala"
          >
            <Zap size={10} className="fill-current" />
            <span>PULSO</span>
          </button>

          {/* Botón: Resetear Posición del Avatar */}
          <button
            onClick={resetAvatarPosition}
            className="px-1.5 py-1 bg-transparent hover:bg-[#101010]/10 text-[#4d4947] rounded-[3px] text-[10px] font-mono transition-colors"
            title="Centrar/Restablecer posición del avatar"
          >
            <User size={10} />
          </button>

          {/* Botón: Reiniciar Orientación 3D */}
          <button
            onClick={resetOrientation}
            className="px-1.5 py-1 bg-transparent hover:bg-[#101010]/10 text-[#4d4947] rounded-[3px] text-[10px] font-mono transition-colors"
            title="Restablecer posición inicial frontal-inclinada del libro"
          >
            <RefreshCw size={10} />
          </button>
        </div>

      </div>

    </div>
  );
}
