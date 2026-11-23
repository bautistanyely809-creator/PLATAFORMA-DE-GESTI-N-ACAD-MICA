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
  const isDraggingMeshRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  // 1. Estados de animación Three.js
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

  // 2. Estados del Avatar / Emoji Interactivo
  const userRole = (user?.rol || localStorage.getItem('edunova_user_role') || 'estudiante').toLowerCase();
  const initialGender = localStorage.getItem('edunova_user_gender') || 'femenino';

  const getDefaultEmoji = (r, g) => {
    const roleKey = (r || 'estudiante').toLowerCase();
    const genderKey = (g || 'femenino').toLowerCase();
    return DEFAULT_ROLE_EMOJIS[roleKey]?.[genderKey] || '👩🏼‍🎓';
  };

  const [currentEmoji, setCurrentEmoji] = useState(() => {
    return localStorage.getItem('edunova_user_avatar') || getDefaultEmoji(userRole, initialGender);
  });

  const [selectedRole, setSelectedRole] = useState(userRole);
  const [selectedGender, setSelectedGender] = useState(initialGender);

  // Posición del badge de usuario (x, y) con persistencia
  const [avatarPos, setAvatarPos] = useState(() => {
    const saved = localStorage.getItem('edunova_hero_avatar_pos');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return { x: 16, y: 16 };
  });

  const isDraggingAvatarRef = useRef(false);
  const dragAvatarStartRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

  // Modal / Popover de edición
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [customInputEmoji, setCustomInputEmoji] = useState('');
  const [tempPreviewEmoji, setTempPreviewEmoji] = useState(currentEmoji);

  // Función para generar la textura del emoji en alta resolución
  const drawEmojiCanvas = (emojiChar, canvas) => {
    if (!canvas) canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 512, 512);

    // Fondo degradado circular marfil suave
    const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.75, '#fcfaf6');
    grad.addColorStop(1, '#f2ece0');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(256, 256, 256, 0, Math.PI * 2);
    ctx.fill();

    // Aro interior institucional naranja suave
    ctx.strokeStyle = 'rgba(238, 96, 24, 0.4)';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(256, 256, 244, 0, Math.PI * 2);
    ctx.stroke();

    // Aro decorativo verde métrico
    ctx.strokeStyle = 'rgba(160, 202, 146, 0.5)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.stroke();

    // Dibujo del Emoji central
    ctx.font = '270px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 14;
    ctx.fillText(emojiChar, 256, 274);

    return canvas;
  };

  // Inicialización de la escena Three.js con el Emoji 3D
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 340;
    const height = currentMount.clientHeight || 240;

    // Escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Cámara con encuadre óptimo
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 6.2);
    camera.lookAt(0, 0, 0);

    // Renderizador WebGL con soporte ACESFilmic
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

    // Iluminación de Estudio
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf0, 1.4);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffe8dc, 0.7);
    fillLight.position.set(-5, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    const spotLight = new THREE.PointLight(0xfff6ea, 0.6, 8);
    spotLight.position.set(0, 0, 2.5);
    scene.add(spotLight);

    // Grupo Raíz del Emoji 3D
    const rootGroup = new THREE.Group();
    // Inclinación inicial suave para apreciarlo en 3D
    rootGroup.rotation.set(0.18, -0.22, 0.04);
    scene.add(rootGroup);

    // Grupo giratorio continuo
    const emojiGroup = new THREE.Group();
    rootGroup.add(emojiGroup);

    // --- CONSTRUCCIÓN DEL MEDALLÓN / TOKEN EMOJI 3D ---
    const radius = 1.45;
    const thickness = 0.24;

    // Crear textura del emoji
    const emojiCanvas = drawEmojiCanvas(currentEmoji);
    const emojiTexture = new THREE.CanvasTexture(emojiCanvas);
    emojiTexture.needsUpdate = true;

    // Material de la cara frontal y trasera con el emoji
    const faceMaterial = new THREE.MeshStandardMaterial({
      map: emojiTexture,
      roughness: 0.28,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // Material del borde perimetral en rojo coral / naranja cálido satinado (#EE3B2B)
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xee3b2b,
      roughness: 0.3,
      metalness: 0.2
    });

    // Material de los aros dorados decorativos
    const goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xf07830,
      roughness: 0.25,
      metalness: 0.75
    });

    const registeredMaterials = [faceMaterial, rimMaterial, goldAccentMaterial];

    // 1. Cilindro base del medallón (Cuerpo 3D)
    const cylinderGeo = new THREE.CylinderGeometry(radius, radius, thickness, 64);
    cylinderGeo.rotateX(Math.PI / 2); // Orientar la cara hacia el frente (eje Z)

    // Crear disco compuesto: tapas con el emoji, borde con el color institucional
    const discMesh = new THREE.Mesh(cylinderGeo, [
      rimMaterial,  // Perímetro exterior
      faceMaterial, // Cara frontal
      faceMaterial  // Cara trasera
    ]);
    discMesh.castShadow = true;
    discMesh.receiveShadow = true;
    emojiGroup.add(discMesh);

    // 2. Bisel redondeado perimetral frontal y trasero (Aro Torus satinado)
    const torusGeo = new THREE.TorusGeometry(radius, 0.045, 16, 64);

    const frontTorus = new THREE.Mesh(torusGeo, goldAccentMaterial);
    frontTorus.position.z = thickness / 2;
    emojiGroup.add(frontTorus);

    const backTorus = new THREE.Mesh(torusGeo, goldAccentMaterial);
    backTorus.position.z = -thickness / 2;
    emojiGroup.add(backTorus);

    // 3. Anillo Orbital Inclinado decorativo que acompaña al emoji
    const orbitGeo = new THREE.TorusGeometry(2.15, 0.02, 16, 80);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0xee6018,
      transparent: true,
      opacity: 0.55
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = Math.PI / 3;
    orbitMesh.rotation.y = Math.PI / 6;
    emojiGroup.add(orbitMesh);

    // 4. Satélite / Esfera de luz en órbita verde métrica (#A0CA92)
    const satGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xa0ca92,
      roughness: 0.2,
      metalness: 0.6,
      emissive: 0xa0ca92,
      emissiveIntensity: 0.3
    });
    const satMesh = new THREE.Mesh(satGeo, satMat);
    emojiGroup.add(satMesh);

    // 5. Micro-partículas flotantes tenues
    const particleCount = 55;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cWhite = new THREE.Color(0xfcfbf9);
    const cOrange = new THREE.Color(0xee6018);
    const cGreen = new THREE.Color(0xa0ca92);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const r = 2.0 + Math.random() * 2.0;
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

    // Referencias de control
    objectsRef.current = {
      rootGroup,
      emojiGroup,
      orbitMesh,
      satMesh,
      discMesh,
      emojiCanvas,
      emojiTexture,
      particleCloud,
      registeredMaterials,
      camera,
      renderer,
      targetTilt: { x: 0, y: 0 },
      baseRotationY: 0
    };

    // Bucle de Animación
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const currentSpeed = speeds[speedIndexRef.current];

      if (!isPausedRef.current && emojiGroup) {
        // Giro continuo 360° en el eje Y
        objectsRef.current.baseRotationY += 0.018 * currentSpeed;
        emojiGroup.rotation.y = objectsRef.current.baseRotationY;

        // Flotación senoidal suave
        floatingTimeRef.current += delta * currentSpeed;
        emojiGroup.position.y = Math.sin(floatingTimeRef.current * 1.8) * 0.08;

        // Movimiento del satélite a lo largo de la órbita
        const orbAngle = floatingTimeRef.current * 1.5 * currentSpeed;
        satMesh.position.x = Math.cos(orbAngle) * 2.15 * Math.cos(Math.PI / 6);
        satMesh.position.y = Math.sin(orbAngle) * 2.15 * Math.sin(Math.PI / 3);
        satMesh.position.z = Math.sin(orbAngle) * 2.15 * Math.cos(Math.PI / 3);

        // Parallax hacia el cursor
        const { targetTilt } = objectsRef.current;
        rootGroup.rotation.x += (0.18 + targetTilt.x - rootGroup.rotation.x) * 0.05;
        rootGroup.rotation.z += (targetTilt.y * 0.4 - rootGroup.rotation.z) * 0.05;

        // Rotación de partículas
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

      cylinderGeo.dispose();
      torusGeo.dispose();
      orbitGeo.dispose();
      satGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      emojiTexture.dispose();
      registeredMaterials.forEach(m => m.dispose());
      renderer.dispose();
    };
  }, [variant]);

  // Actualizar la textura del Emoji 3D en tiempo real cuando cambia
  const update3DEmojiTexture = useCallback((newEmoji) => {
    if (objectsRef.current.emojiCanvas && objectsRef.current.emojiTexture) {
      drawEmojiCanvas(newEmoji, objectsRef.current.emojiCanvas);
      objectsRef.current.emojiTexture.needsUpdate = true;
    }
  }, []);

  // Arrastre 360° del Emoji 3D con el puntero
  const handlePointerDown = (e) => {
    if (e.target.closest('.interactive-avatar-pill') || e.target.closest('.avatar-editor-popover')) return;

    isDraggingMeshRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!objectsRef.current.emojiGroup) return;

    if (isDraggingMeshRef.current) {
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      objectsRef.current.baseRotationY += deltaX * 0.01;
      objectsRef.current.emojiGroup.rotation.y = objectsRef.current.baseRotationY;
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
    isDraggingMeshRef.current = false;
  };

  // --- ARRASTRE DEL BADGE DE AVATAR (DRAG & DROP) ---
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

    const rect = containerRef.current.getBoundingClientRect();
    const maxX = rect.width - 160;
    const maxY = rect.height - 56;

    newX = Math.max(8, Math.min(newX, maxX));
    newY = Math.max(34, Math.min(newY, maxY));

    setAvatarPos({ x: newX, y: newY });
  };

  const handleAvatarPointerUp = (e) => {
    if (!isDraggingAvatarRef.current) return;
    isDraggingAvatarRef.current = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
    localStorage.setItem('edunova_hero_avatar_pos', JSON.stringify(avatarPos));
  };

  // Guardar nuevo emoji seleccionado y actualizar escena 3D
  const handleSaveAvatar = (newEmoji, newRole, newGender) => {
    const emojiToSave = newEmoji || tempPreviewEmoji;
    setCurrentEmoji(emojiToSave);
    if (newRole) setSelectedRole(newRole);
    if (newGender) setSelectedGender(newGender);

    localStorage.setItem('edunova_user_avatar', emojiToSave);
    if (newGender) localStorage.setItem('edunova_user_gender', newGender);
    if (newRole) localStorage.setItem('edunova_user_role', newRole);

    // Actualizar textura en tiempo real en la escena 3D
    update3DEmojiTexture(emojiToSave);

    window.dispatchEvent(new CustomEvent('edunova_avatar_updated', { detail: { emoji: emojiToSave } }));
    setIsEditorOpen(false);
  };

  // Controles Three.js
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
    if (pulseActiveRef.current || !objectsRef.current.emojiGroup) return;
    pulseActiveRef.current = true;
    setPulseActive(true);

    const { emojiGroup } = objectsRef.current;
    let progress = 0;
    const initialRotY = objectsRef.current.baseRotationY;

    const pulseInterval = setInterval(() => {
      progress += 0.05;
      const peak = Math.sin(progress * Math.PI);

      const s = 1 + peak * 0.22;
      if (emojiGroup) {
        emojiGroup.scale.set(s, s, s);
      }
      objectsRef.current.baseRotationY = initialRotY + progress * Math.PI * 2;

      if (progress >= 1) {
        clearInterval(pulseInterval);
        if (emojiGroup) {
          emojiGroup.scale.set(1, 1, 1);
        }
        objectsRef.current.baseRotationY = initialRotY;
        pulseActiveRef.current = false;
        setPulseActive(false);
      }
    }, 20);
  }, []);

  const resetOrientation = useCallback(() => {
    if (objectsRef.current.rootGroup && objectsRef.current.emojiGroup) {
      const { rootGroup, emojiGroup } = objectsRef.current;
      objectsRef.current.baseRotationY = 0;
      objectsRef.current.targetTilt = { x: 0, y: 0 };
      rootGroup.rotation.set(0.18, -0.22, 0.04);
      emojiGroup.rotation.set(0, 0, 0);
      emojiGroup.scale.set(1, 1, 1);
      emojiGroup.position.set(0, 0, 0);
    }
  }, []);

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
            AVATAR INSTITUCIONAL // EMOJI 3D INTERACTIVO
          </span>
        </div>
        
        {/* Acceso rápido a modificar emoji */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTempPreviewEmoji(currentEmoji);
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 bg-white/80 hover:bg-white text-[#101010] border border-[#3d3a39]/20 rounded text-[9px] font-sans font-medium transition-colors shadow-xs"
            title="Modificar avatar / emoji"
          >
            <span>{currentEmoji}</span>
            <span>Modificar</span>
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
        title="Arrastra con el ratón para rotar el emoji 3D en 360°"
      >
        {/* BADGE MOVIBLE (DRAGGABLE) DEL AVATAR */}
        <div
          onPointerDown={handleAvatarPointerDown}
          onPointerMove={handleAvatarPointerMove}
          onPointerUp={handleAvatarPointerUp}
          onPointerCancel={handleAvatarPointerUp}
          style={{ left: `${avatarPos.x}px`, top: `${avatarPos.y}px` }}
          className="interactive-avatar-pill absolute z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#3d3a39]/20 rounded-full px-2.5 py-1.5 shadow-md cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow group"
          title="Arrastra para mover este badge · Clic en ✏️ para editar"
        >
          <div 
            onClick={() => {
              setTempPreviewEmoji(currentEmoji);
              setIsEditorOpen(true);
            }}
            className="text-2xl leading-none w-8 h-8 flex items-center justify-center bg-[#faf9f5] rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
          >
            {currentEmoji}
          </div>

          <div className="flex flex-col text-left pointer-events-none">
            <span className="text-[10px] font-bold text-[#1c1a19] leading-tight">
              {user?.nombre || 'Anyely'}
            </span>
            <span className="text-[8px] font-mono uppercase tracking-wider text-[#ee6018] font-semibold leading-tight">
              {selectedRole} · {selectedGender}
            </span>
          </div>

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

        {/* Leyenda Inferior */}
        <div className="absolute bottom-1.5 left-2 pointer-events-none text-[9px] font-mono text-[#4d4947]/70">
          Arrastrar para rotar · 360°
        </div>
      </div>

      {/* POPOVER EDITOR DE AVATAR Y EMOJI */}
      {isEditorOpen && (
        <div className="avatar-editor-popover absolute inset-x-2 top-8 bottom-2 bg-white/95 backdrop-blur-md border border-[#3d3a39]/25 rounded-lg shadow-2xl z-30 p-3.5 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150">
          
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">{tempPreviewEmoji}</span>
              <span className="text-xs font-bold text-[#1c1a19]">Personalizar Emoji 3D</span>
            </div>
            <button
              onClick={() => setIsEditorOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded"
            >
              <X size={14} />
            </button>
          </div>

          {/* Selector de Rol y Género */}
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
                <option value="estudiante">Estudiante / Aprendiz</option>
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

          {/* Entrada de Emoji Personalizado */}
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

          {/* Botón: Selector de Velocidad */}
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
            title="Alternar entre acabado 3D sólido y vista wireframe"
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

          {/* Botón: Centrar Badge */}
          <button
            onClick={resetAvatarPosition}
            className="px-1.5 py-1 bg-transparent hover:bg-[#101010]/10 text-[#4d4947] rounded-[3px] text-[10px] font-mono transition-colors"
            title="Restablecer posición del badge del avatar"
          >
            <User size={10} />
          </button>

          {/* Botón: Reiniciar Orientación 3D */}
          <button
            onClick={resetOrientation}
            className="px-1.5 py-1 bg-transparent hover:bg-[#101010]/10 text-[#4d4947] rounded-[3px] text-[10px] font-mono transition-colors"
            title="Restablecer posición inicial del emoji 3D"
          >
            <RefreshCw size={10} />
          </button>
        </div>

      </div>

    </div>
  );
}
