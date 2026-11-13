import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Zap, RefreshCw, Play, Pause } from 'lucide-react';

export default function Hero3DCanvas({ className = '', variant = 'bone' }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const objectsRef = useRef({});
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  // Controles de estado interactivo
  const [isWireframe, setIsWireframe] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [currentMode, setCurrentMode] = useState('NORMAL');

  // Inicialización de Three.js
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 300;
    const height = currentMount.clientHeight || 240;

    // 1. Escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Cámara
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // 3. Renderizador con alpha transparente
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xee6018, 1.0); // Signal Orange highlight
    dirLight2.position.set(-5, -4, -3);
    scene.add(dirLight2);

    // 5. Grupo Principal de Objetos
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Core central: Icosaedro Sólido
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: variant === 'bone' ? 0x1d1a18 : 0xeeeeee,
      roughness: 0.35,
      metalness: 0.7,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Jaula Externa Wireframe
    const outerGeo = new THREE.IcosahedronGeometry(1.85, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: variant === 'bone' ? 0x3d3a39 : 0x8c8682,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    mainGroup.add(outerMesh);

    // Anillo Orbital 1 (Plano Ecuatorial Inclinado)
    const ringGeo1 = new THREE.TorusGeometry(2.35, 0.022, 16, 90);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xee6018, // Signal Orange
      transparent: true,
      opacity: 0.85,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    mainGroup.add(ring1);

    // Satélite / Nodo en Órbita 1
    const satGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xee6018 });
    const sat1 = new THREE.Mesh(satGeo, satMat);
    mainGroup.add(sat1);

    // Anillo Orbital 2 (Plano Polar Inclinado)
    const ringGeo2 = new THREE.TorusGeometry(2.65, 0.018, 16, 90);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xa0ca92, // Metric Green
      transparent: true,
      opacity: 0.75,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    mainGroup.add(ring2);

    // Satélite 2 en Órbita 2
    const satMat2 = new THREE.MeshBasicMaterial({ color: 0xa0ca92 });
    const sat2 = new THREE.Mesh(satGeo, satMat2);
    mainGroup.add(sat2);

    // Nube de Partículas / Nodos de Telemetría
    const particleCount = 80;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.4 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: variant === 'bone' ? 0x101010 : 0xfafafa,
      size: 0.045,
      transparent: true,
      opacity: 0.6,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleCloud);

    // Guardar referencias
    objectsRef.current = {
      mainGroup,
      coreMesh,
      coreMat,
      outerMesh,
      outerMat,
      ring1,
      ring2,
      sat1,
      sat2,
      particleCloud,
      camera,
      renderer,
      baseScale: 1,
      targetRotation: { x: 0, y: 0 },
    };

    // 6. Bucle de Animación
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (!isPaused && mainGroup) {
        // Rotación continua con multiplicador de velocidad
        const mult = speedMultiplier;
        mainGroup.rotation.y += 0.5 * delta * mult;
        mainGroup.rotation.x += 0.25 * delta * mult;

        // Rotación contra-axial del anillo 2
        ring2.rotation.z += 0.4 * delta * mult;

        // Levitación senoidal suave
        mainGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.08;

        // Movimiento de satélites a lo largo de las órbitas
        const orbitSpeed1 = elapsedTime * 1.2 * mult;
        sat1.position.x = Math.cos(orbitSpeed1) * 2.35 * Math.cos(Math.PI / 6);
        sat1.position.y = Math.sin(orbitSpeed1) * 2.35 * Math.sin(Math.PI / 3);
        sat1.position.z = Math.sin(orbitSpeed1) * 2.35 * Math.cos(Math.PI / 3);

        const orbitSpeed2 = -elapsedTime * 0.9 * mult;
        sat2.position.x = Math.cos(orbitSpeed2) * 2.65 * Math.cos(Math.PI / 5);
        sat2.position.y = Math.sin(orbitSpeed2) * 2.65 * Math.sin(-Math.PI / 4);
        sat2.position.z = Math.sin(orbitSpeed2) * 2.65 * Math.cos(-Math.PI / 4);

        // Giro lento de la nube de partículas
        particleCloud.rotation.y -= 0.15 * delta * mult;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Observer de Redimensión
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

    // 8. Limpieza en Desmontaje
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      // Liberar geometrías y materiales WebGL
      coreGeo.dispose();
      coreMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      satGeo.dispose();
      satMat.dispose();
      satMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [variant]);

  // Manejador de Arrastre Manual con Puntero / Ratón
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !objectsRef.current.mainGroup) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;

    objectsRef.current.mainGroup.rotation.y += deltaX * 0.008;
    objectsRef.current.mainGroup.rotation.x += deltaY * 0.008;

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Acción: Alternar Alambre (Wireframe)
  const toggleWireframe = useCallback(() => {
    const nextState = !isWireframe;
    setIsWireframe(nextState);
    if (objectsRef.current.coreMat) {
      objectsRef.current.coreMat.wireframe = nextState;
    }
  }, [isWireframe]);

  // Acción: Ciclar Velocidad (1x -> 2.5x -> 0.4x -> 1x)
  const cycleSpeed = useCallback(() => {
    setSpeedMultiplier(prev => {
      if (prev === 1) return 2.5;
      if (prev === 2.5) return 0.4;
      return 1;
    });
  }, []);

  // Acción: Activar Pulso de Telemetría (Disparo de animación 3D)
  const triggerPulse = useCallback(() => {
    if (pulseActive || !objectsRef.current.mainGroup) return;
    setPulseActive(true);

    const { outerMesh, ring1, ring2, mainGroup } = objectsRef.current;
    const origScale = mainGroup.scale.x;

    let progress = 0;
    const pulseInterval = setInterval(() => {
      progress += 0.08;
      const s = 1 + Math.sin(progress * Math.PI) * 0.25;
      if (mainGroup) mainGroup.scale.set(s, s, s);
      if (ring1) ring1.scale.set(s * 1.1, s * 1.1, s * 1.1);
      if (ring2) ring2.scale.set(s * 1.15, s * 1.15, s * 1.15);

      if (progress >= 1) {
        clearInterval(pulseInterval);
        if (mainGroup) mainGroup.scale.set(origScale, origScale, origScale);
        if (ring1) ring1.scale.set(1, 1, 1);
        if (ring2) ring2.scale.set(1, 1, 1);
        setPulseActive(false);
      }
    }, 20);
  }, [pulseActive]);

  // Acción: Reset de Rotación
  const resetOrientation = useCallback(() => {
    if (objectsRef.current.mainGroup) {
      objectsRef.current.mainGroup.rotation.set(0, 0, 0);
      objectsRef.current.mainGroup.position.set(0, 0, 0);
    }
  }, []);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      
      {/* Etiqueta Monospace de Identificación 3D */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 text-[10px] font-mono text-[#4d4947] border-b border-[#3d3a39]/20">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
          <span className="uppercase tracking-wider font-medium text-[#101010]">NODO 3D // TELEMETRÍA REACTIVA</span>
        </div>
        <span className="text-[#8c8682]">THREE.JS WEBGL</span>
      </div>

      {/* Contenedor del Canvas Interactivo con Arrastre */}
      <div 
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-44 sm:h-52 cursor-grab active:cursor-grabbing relative flex items-center justify-center overflow-hidden"
        title="Arrastra con el ratón para rotar el núcleo 3D"
      >
        {/* Overlay informativo sutil */}
        <div className="absolute bottom-1.5 left-2 pointer-events-none text-[9px] font-mono text-[#4d4947]/70">
          Arrastrar para rotar · 360°
        </div>
      </div>

      {/* Barra de Controles Interactivos estilo Factory */}
      <div className="w-full flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-[#3d3a39]/20">
        
        <div className="flex items-center gap-1">
          {/* Botón: Pausar / Reanudar */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2 py-1 bg-[#101010] hover:bg-[#1d1a18] text-[#fafafa] rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors border border-[#3d3a39]"
            title={isPaused ? "Reanudar animación" : "Pausar rotación"}
          >
            {isPaused ? <Play size={10} className="text-[#a0ca92]" /> : <Pause size={10} className="text-[#ee6018]" />}
            <span>{isPaused ? 'PLAY' : 'PAUSE'}</span>
          </button>

          {/* Botón: Velocidad */}
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 bg-[#ffffff]/60 hover:bg-[#ffffff] text-[#101010] rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors border border-[#3d3a39]/30"
            title="Alternar velocidad de rotación"
          >
            <RotateCw size={10} />
            <span>{speedMultiplier}x</span>
          </button>

          {/* Botón: Modo Alambre */}
          <button
            onClick={toggleWireframe}
            className={`px-2 py-1 rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors border ${
              isWireframe 
                ? 'bg-[#ee6018] text-white border-[#ee6018]' 
                : 'bg-[#ffffff]/60 hover:bg-[#ffffff] text-[#101010] border-[#3d3a39]/30'
            }`}
            title="Alternar modo alambre"
          >
            <Eye size={10} />
            <span>{isWireframe ? 'ALAMBRE' : 'SÓLIDO'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Botón: Pulso de Telemetría */}
          <button
            onClick={triggerPulse}
            disabled={pulseActive}
            className="px-2 py-1 bg-[#ee6018] hover:bg-[#d85513] text-white rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors disabled:opacity-50"
            title="Disparar pulso de telemetría"
          >
            <Zap size={10} className="fill-current" />
            <span>PULSO</span>
          </button>

          {/* Botón: Reset */}
          <button
            onClick={resetOrientation}
            className="px-1.5 py-1 bg-transparent hover:bg-[#101010]/10 text-[#4d4947] rounded-[3px] text-[10px] font-mono transition-colors"
            title="Restablecer posición inicial"
          >
            <RefreshCw size={10} />
          </button>
        </div>

      </div>

    </div>
  );
}
