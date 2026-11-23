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

  // 1. Estados de animación
  const speeds = [0.5, 1, 1.5, 2];
  const [speedIndex, setSpeedIndex] = useState(1);
  const speedIndexRef = useRef(1);

  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  const [isWireframe, setIsWireframe] = useState(false);
  const isWireframeRef = useRef(false);

  const [pulseActive, setPulseActive] = useState(false);
  const pulseActiveRef = useRef(false);

  const animClockRef = useRef(0);

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

  // Posición del badge de usuario (x, y)
  const [avatarPos, setAvatarPos] = useState(() => {
    const saved = localStorage.getItem('edunova_hero_avatar_pos');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return { x: 14, y: 14 };
  });

  const isDraggingAvatarRef = useRef(false);
  const dragAvatarStartRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

  // Modal / Popover de edición
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [customInputEmoji, setCustomInputEmoji] = useState('');
  const [tempPreviewEmoji, setTempPreviewEmoji] = useState(currentEmoji);

  // Generador de textura del Emoji puro (fondo 100% transparente, sin plato ni discos)
  const drawPureEmojiCanvas = (emojiChar, canvas) => {
    if (!canvas) canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Limpieza total transparente (SIN plato, sin discos, sin bordes)
    ctx.clearRect(0, 0, 512, 512);

    // Dibujo del Emoji con suavizado y leve sombra de profundidad
    ctx.font = '330px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 16;
    ctx.fillText(emojiChar, 256, 268);

    return canvas;
  };

  // Generador de textura para sombra ovalada en el piso
  const createShadowCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(40, 30, 25, 0.22)');
    grad.addColorStop(0.5, 'rgba(40, 30, 25, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    return canvas;
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 340;
    const height = currentMount.clientHeight || 240;

    // Escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Cámara con encuadre cercano y centrado
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);
    camera.lookAt(0, 0, 0);

    // Renderizador con fondo transparente
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    if (renderer.outputColorSpace !== undefined) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Iluminación suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaee, 1.2);
    dirLight.position.set(3, 6, 5);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xffe8dc, 0.6);
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);

    // Grupo Raíz del Personaje Emoji
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    // 1. Textura del Emoji Puro (sin platos ni fondos)
    const emojiCanvas = drawPureEmojiCanvas(currentEmoji);
    const emojiTexture = new THREE.CanvasTexture(emojiCanvas);
    emojiTexture.needsUpdate = true;

    // Plano del Emoji en tamaño grande
    const emojiGeo = new THREE.PlaneGeometry(2.7, 2.7);
    const emojiMat = new THREE.MeshStandardMaterial({
      map: emojiTexture,
      transparent: true,
      alphaTest: 0.02,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    const emojiMesh = new THREE.Mesh(emojiGeo, emojiMat);
    characterGroup.add(emojiMesh);

    // 2. Sombra suave ovalada en el piso
    const shadowCanvas = createShadowCanvas();
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(2.4, 0.9);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.7,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.45;
    scene.add(shadowMesh);

    // 3. Micro-partículas tenues flotando alrededor
    const particleCount = 45;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cWhite = new THREE.Color(0xfcfbf9);
    const cOrange = new THREE.Color(0xee6018);
    const cGreen = new THREE.Color(0xa0ca92);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const r = 1.6 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[idx + 2] = r * Math.cos(phi);

      const rand = Math.random();
      const col = rand < 0.6 ? cWhite : rand < 0.85 ? cOrange : cGreen;
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
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // Referencias
    objectsRef.current = {
      characterGroup,
      emojiMesh,
      emojiMat,
      emojiCanvas,
      emojiTexture,
      shadowMesh,
      particleCloud,
      camera,
      renderer,
      targetLook: { x: 0, y: 0 },
      baseRotationY: 0,
      gestureType: 'idle'
    };

    // Bucle de Animación y Gestos Vivos
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const currentSpeed = speeds[speedIndexRef.current];

      if (!isPausedRef.current && characterGroup) {
        animClockRef.current += delta * currentSpeed;
        const t = animClockRef.current;

        // 1. GESTO DE FLOTACIÓN Y RESPIRACIÓN VIVA (Idle bobbing & breathing)
        const bobY = Math.sin(t * 2.2) * 0.11;
        const breatheScale = 1.0 + Math.sin(t * 2.2) * 0.035;
        
        // 2. GESTO DE BALANCEO SIMPÁTICO / SALUDO (Playful tilt)
        const playfulTiltZ = Math.sin(t * 1.6) * 0.09; // Inclinación suave de cabeza a los lados
        const playfulNodX = Math.sin(t * 1.1) * 0.04;  // Asentimiento suave

        // 3. SEGUIMIENTO DE MIRADA HACIA EL CURSOR (Interactive Eye-Contact)
        const { targetLook } = objectsRef.current;
        const lookTargetY = targetLook.x * 0.45;
        const lookTargetX = -targetLook.y * 0.35;

        // Si el usuario no está arrastrando manualmente, el emoji mira hacia el cursor con su balanceo
        if (!isDraggingMeshRef.current && !pulseActiveRef.current) {
          characterGroup.position.y = bobY;
          characterGroup.scale.set(breatheScale, breatheScale, breatheScale);
          
          characterGroup.rotation.y += (lookTargetY - characterGroup.rotation.y) * 0.06;
          characterGroup.rotation.x += (playfulNodX + lookTargetX - characterGroup.rotation.x) * 0.06;
          characterGroup.rotation.z += (playfulTiltZ - characterGroup.rotation.z) * 0.06;
        }

        // Dinámica de la sombra: se reduce y atenúa al flotar alto, se ensancha al bajar
        if (shadowMesh) {
          const shadowScale = 1.0 - bobY * 0.8;
          shadowMesh.scale.set(shadowScale, shadowScale, 1);
          shadowMat.opacity = 0.65 - bobY * 1.2;
        }

        // Giro lento de las partículas de ambiente
        particleCloud.rotation.y += 0.03 * delta * currentSpeed;
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

      emojiGeo.dispose();
      emojiMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      emojiTexture.dispose();
      renderer.dispose();
    };
  }, [variant]);

  // Actualizar textura en vivo al cambiar de emoji
  const updateEmojiVisual = useCallback((newEmoji) => {
    if (objectsRef.current.emojiCanvas && objectsRef.current.emojiTexture) {
      drawPureEmojiCanvas(newEmoji, objectsRef.current.emojiCanvas);
      objectsRef.current.emojiTexture.needsUpdate = true;
    }
  }, []);

  // Interacción con Mouse: Arrastrar para rotar 360° o Hover para seguimiento de mirada
  const handlePointerDown = (e) => {
    if (e.target.closest('.interactive-avatar-pill') || e.target.closest('.avatar-editor-popover')) return;

    isDraggingMeshRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!objectsRef.current.characterGroup) return;

    if (isDraggingMeshRef.current) {
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      objectsRef.current.characterGroup.rotation.y += deltaX * 0.012;
      objectsRef.current.characterGroup.rotation.x += deltaY * 0.008;

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (objectsRef.current.targetLook) {
        objectsRef.current.targetLook.x = nx;
        objectsRef.current.targetLook.y = ny;
      }
    }
  };

  const handlePointerUp = () => {
    isDraggingMeshRef.current = false;
  };

  const handlePointerLeave = () => {
    isDraggingMeshRef.current = false;
    if (objectsRef.current.targetLook) {
      objectsRef.current.targetLook.x = 0;
      objectsRef.current.targetLook.y = 0;
    }
  };

  // Arrastre del Badge Flotante del Usuario
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

  // Guardar nuevo emoji seleccionado y actualizar el personaje 3D
  const handleSaveAvatar = (newEmoji, newRole, newGender) => {
    const emojiToSave = newEmoji || tempPreviewEmoji;
    setCurrentEmoji(emojiToSave);
    if (newRole) setSelectedRole(newRole);
    if (newGender) setSelectedGender(newGender);

    localStorage.setItem('edunova_user_avatar', emojiToSave);
    if (newGender) localStorage.setItem('edunova_user_gender', newGender);
    if (newRole) localStorage.setItem('edunova_user_role', newRole);

    updateEmojiVisual(emojiToSave);

    window.dispatchEvent(new CustomEvent('edunova_avatar_updated', { detail: { emoji: emojiToSave } }));
    setIsEditorOpen(false);
  };

  // Controles
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
    if (objectsRef.current.emojiMat) {
      objectsRef.current.emojiMat.wireframe = nextState;
    }
  }, []);

  // GESTO ESPECIAL: PULSO (Salto de celebración alegre con pirueta y rebote)
  const triggerPulse = useCallback(() => {
    if (pulseActiveRef.current || !objectsRef.current.characterGroup) return;
    pulseActiveRef.current = true;
    setPulseActive(true);

    const { characterGroup } = objectsRef.current;
    let progress = 0;
    const initialY = characterGroup.position.y;
    const initialRotY = characterGroup.rotation.y;

    const pulseInterval = setInterval(() => {
      progress += 0.05;
      
      // Curva elástica de salto hacia arriba
      const jumpHeight = Math.sin(progress * Math.PI) * 0.55;
      characterGroup.position.y = initialY + jumpHeight;

      // Pirueta festiva de giro completo
      characterGroup.rotation.y = initialRotY + progress * Math.PI * 2;

      // Estiramiento elástico en el aire (squash and stretch)
      const squash = 1.0 + Math.sin(progress * Math.PI) * 0.22;
      characterGroup.scale.set(squash, squash, squash);

      if (progress >= 1) {
        clearInterval(pulseInterval);
        characterGroup.position.y = initialY;
        characterGroup.scale.set(1, 1, 1);
        characterGroup.rotation.y = initialRotY;
        pulseActiveRef.current = false;
        setPulseActive(false);
      }
    }, 20);
  }, []);

  // Restablecer Orientación Inicial
  const resetOrientation = useCallback(() => {
    if (objectsRef.current.characterGroup) {
      const { characterGroup } = objectsRef.current;
      characterGroup.rotation.set(0, 0, 0);
      characterGroup.scale.set(1, 1, 1);
      characterGroup.position.set(0, 0, 0);
    }
  }, []);

  const resetAvatarPosition = (e) => {
    e.stopPropagation();
    const defaultPos = { x: 14, y: 14 };
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
            AVATAR INTERACTIVO // GESTOS 3D
          </span>
        </div>
        
        {/* Acceso a modificar emoji */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTempPreviewEmoji(currentEmoji);
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 bg-white/80 hover:bg-white text-[#101010] border border-[#3d3a39]/20 rounded text-[9px] font-sans font-medium transition-colors shadow-xs"
            title="Cambiar emoji"
          >
            <span>{currentEmoji}</span>
            <span>Modificar</span>
            <Edit3 size={9} className="text-[#ee6018]" />
          </button>
          <span className="text-[#8c8682] tracking-wider font-medium">THREE.JS WEBGL</span>
        </div>
      </div>

      {/* Contenedor del Canvas Interactivo con el Emoji Puro Animado */}
      <div 
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className="w-full h-48 sm:h-56 cursor-grab active:cursor-grabbing relative flex items-center justify-center overflow-hidden"
        title="Mueve el cursor para que el emoji te mire · Arrastra para rotar 360°"
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
          Mueve el cursor para interactuar · Arrastrar para rotar · 360°
        </div>
      </div>

      {/* POPOVER EDITOR DE AVATAR Y EMOJI */}
      {isEditorOpen && (
        <div className="avatar-editor-popover absolute inset-x-2 top-8 bottom-2 bg-white/95 backdrop-blur-md border border-[#3d3a39]/25 rounded-lg shadow-2xl z-30 p-3.5 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150">
          
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">{tempPreviewEmoji}</span>
              <span className="text-xs font-bold text-[#1c1a19]">Cambiar Emoji del Personaje</span>
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
            title={isPaused ? "Reanudar gestos" : "Pausar animación"}
          >
            {isPaused ? <Play size={10} className="text-[#a0ca92]" /> : <Pause size={10} className="text-[#ee6018]" />}
            <span>{isPaused ? 'PLAY' : 'PAUSE'}</span>
          </button>

          {/* Botón: Selector de Velocidad */}
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 bg-[#ffffff]/60 hover:bg-[#ffffff] text-[#101010] rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors border border-[#3d3a39]/30"
            title="Ajustar velocidad"
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
            title="Alternar vista de estructura alámbrica"
          >
            <Eye size={10} />
            <span>{isWireframe ? 'ALAMBRE' : 'SÓLIDO'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Botón: PULSO (Gesto de Salto Alegre) */}
          <button
            onClick={triggerPulse}
            disabled={pulseActive}
            className="px-2 py-1 bg-[#ee6018] hover:bg-[#d85513] text-white rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors disabled:opacity-50"
            title="Disparar salto alegre de celebración"
          >
            <Zap size={10} className="fill-current" />
            <span>PULSO</span>
          </button>

          {/* Botón: Centrar Badge */}
          <button
            onClick={resetAvatarPosition}
            className="px-1.5 py-1 bg-transparent hover:bg-[#101010]/10 text-[#4d4947] rounded-[3px] text-[10px] font-mono transition-colors"
            title="Restablecer posición del badge"
          >
            <User size={10} />
          </button>

          {/* Botón: Reiniciar Orientación */}
          <button
            onClick={resetOrientation}
            className="px-1.5 py-1 bg-transparent hover:bg-[#101010]/10 text-[#4d4947] rounded-[3px] text-[10px] font-mono transition-colors"
            title="Restablecer posición inicial del personaje"
          >
            <RefreshCw size={10} />
          </button>
        </div>

      </div>

    </div>
  );
}
