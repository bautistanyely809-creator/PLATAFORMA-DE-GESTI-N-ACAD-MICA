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

  // Estados interactivos vinculados a los controles
  const [isWireframe, setIsWireframe] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);

  // Inicialización de la escena Three.js
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 320;
    const height = currentMount.clientHeight || 240;

    // 1. Escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Cámara de perspectiva
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 6.4);
    camera.lookAt(0, 0, 0);

    // 3. Renderizador WebGL con transparencia y antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Sistema de Iluminación de Estudio Editorial
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Luz principal cenital suave
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
    mainLight.position.set(4, 7, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Luz de relleno cálida institucional (Naranja EDUNOVA)
    const orangeFillLight = new THREE.DirectionalLight(0xee6018, 0.85);
    orangeFillLight.position.set(-5, -2, -3);
    scene.add(orangeFillLight);

    // Luz de acento sutil verde métrico (SENA/EDUNOVA)
    const greenAccentLight = new THREE.PointLight(0xa0ca92, 1.2, 8);
    greenAccentLight.position.set(0, -3.5, 2.5);
    scene.add(greenAccentLight);

    // 5. Grupo Raíz del Libro 3D y su entorno
    const rootGroup = new THREE.Group();
    // Inclinación inicial isométrica elegante para exhibición editorial
    rootGroup.rotation.set(0.38, -0.42, 0.08);
    scene.add(rootGroup);

    // Dimensiones del Libro
    const bookWidth = 1.7;
    const bookHeight = 2.4;
    const spineRadius = 0.16;
    const coverThickness = 0.055;
    const pageBlockThickness = 0.18;

    // --- MATERIALES ---
    // Cubierta: Tono editorial grafito refinado con acabado táctil mate
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c1a19,
      roughness: 0.38,
      metalness: 0.15,
      side: THREE.DoubleSide
    });

    // Lomo del libro con acento institucional
    const spineMaterial = new THREE.MeshStandardMaterial({
      color: 0x24201e,
      roughness: 0.45,
      metalness: 0.2
    });

    // Bordes y detalles dorados / naranja cálido en la cubierta
    const goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xee6018,
      roughness: 0.25,
      metalness: 0.75
    });

    // Páginas base fijas (bloque de papel marfil)
    const paperBlockMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f2eb,
      roughness: 0.85,
      metalness: 0.02
    });

    // Páginas articuladas dinámicas (parchment claro con textura translúcida)
    const dynamicPageMaterial = new THREE.MeshStandardMaterial({
      color: 0xfcfbfa,
      roughness: 0.7,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    // Cinta marcapáginas satinada naranja
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: 0xee6018,
      roughness: 0.3,
      metalness: 0.4,
      side: THREE.DoubleSide
    });

    // Dije / colgante del marcapáginas en verde métrico
    const charmMaterial = new THREE.MeshStandardMaterial({
      color: 0xa0ca92,
      roughness: 0.2,
      metalness: 0.8
    });

    const registeredMaterials = [
      coverMaterial,
      spineMaterial,
      goldAccentMaterial,
      paperBlockMaterial,
      dynamicPageMaterial,
      ribbonMaterial,
      charmMaterial
    ];

    // --- CONSTRUCCIÓN DE LA ESTRUCTURA DEL LIBRO ---
    const bookAssembly = new THREE.Group();
    rootGroup.add(bookAssembly);

    // A. Lomo cilíndrico curvo
    const spineGeo = new THREE.CylinderGeometry(spineRadius, spineRadius, bookHeight + 0.08, 24, 1, false, Math.PI / 2, Math.PI);
    const spineMesh = new THREE.Mesh(spineGeo, spineMaterial);
    spineMesh.rotation.y = Math.PI / 2;
    bookAssembly.add(spineMesh);

    // Detalle decorativo en el lomo (anillos acentuados naranja)
    const bandGeo = new THREE.TorusGeometry(spineRadius * 1.02, 0.012, 12, 24, Math.PI);
    const bandTop = new THREE.Mesh(bandGeo, goldAccentMaterial);
    bandTop.rotation.y = Math.PI / 2;
    bandTop.position.y = 0.75;
    bookAssembly.add(bandTop);

    const bandBottom = new THREE.Mesh(bandGeo, goldAccentMaterial);
    bandBottom.rotation.y = Math.PI / 2;
    bandBottom.position.y = -0.75;
    bookAssembly.add(bandBottom);

    // B. Bisagras y Tapas Rígidas (Izquierda/Trasera y Derecha/Delantera)
    // 1. Tapa Trasera (Izquierda) - Articulada en el lomo
    const leftHinge = new THREE.Group();
    leftHinge.position.set(-spineRadius, 0, 0);
    bookAssembly.add(leftHinge);

    const leftCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight + 0.08, coverThickness);
    leftCoverGeo.translate(-bookWidth / 2, 0, 0);
    const leftCover = new THREE.Mesh(leftCoverGeo, coverMaterial);
    leftHinge.add(leftCover);

    // Bloque fijo de páginas izquierdas
    const leftBlockGeo = new THREE.BoxGeometry(bookWidth - 0.08, bookHeight - 0.06, pageBlockThickness);
    leftBlockGeo.translate(-(bookWidth - 0.08) / 2, 0, pageBlockThickness / 2 + coverThickness / 2);
    const leftPageBlock = new THREE.Mesh(leftBlockGeo, paperBlockMaterial);
    leftHinge.add(leftPageBlock);

    // 2. Tapa Delantera (Derecha) - Articulada en el lomo
    const rightHinge = new THREE.Group();
    rightHinge.position.set(spineRadius, 0, 0);
    bookAssembly.add(rightHinge);

    const rightCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight + 0.08, coverThickness);
    rightCoverGeo.translate(bookWidth / 2, 0, 0);
    const rightCover = new THREE.Mesh(rightCoverGeo, coverMaterial);
    rightHinge.add(rightCover);

    // Placa emblemática frontal con acento institucional en la portada
    const emblemGeo = new THREE.PlaneGeometry(0.8, 1.1);
    emblemGeo.translate(bookWidth / 2, 0, coverThickness / 2 + 0.002);
    const emblemMesh = new THREE.Mesh(emblemGeo, goldAccentMaterial);
    rightHinge.add(emblemMesh);

    // Bloque fijo de páginas derechas
    const rightBlockGeo = new THREE.BoxGeometry(bookWidth - 0.08, bookHeight - 0.06, pageBlockThickness);
    rightBlockGeo.translate((bookWidth - 0.08) / 2, 0, -(pageBlockThickness / 2 + coverThickness / 2));
    const rightPageBlock = new THREE.Mesh(rightBlockGeo, paperBlockMaterial);
    rightHinge.add(rightPageBlock);

    // Ángulos de apertura del libro abierto
    const leftOpenAngle = -0.32; // ~18 grados abierta a la izquierda
    const rightOpenAngle = Math.PI - 0.32; // ~162 grados abierta hacia la derecha
    leftHinge.rotation.y = leftOpenAngle;
    rightHinge.rotation.y = rightOpenAngle;

    // C. Hojas Dinámicas Articuladas que Pasan (3 Páginas Flexibles)
    const numPages = 3;
    const pageWings = [];
    const pageWidth = bookWidth - 0.1;
    const pageHeight = bookHeight - 0.08;

    for (let i = 0; i < numPages; i++) {
      const pageHinge = new THREE.Group();
      pageHinge.position.set(0, 0, 0.01 * (i - 1));
      bookAssembly.add(pageHinge);

      // Malla segmentada para permitir curvatura/flexión física realista al girar
      const segmentsX = 18;
      const segmentsY = 4;
      const pagePlaneGeo = new THREE.PlaneGeometry(pageWidth, pageHeight, segmentsX, segmentsY);
      pagePlaneGeo.translate(pageWidth / 2, 0, 0);

      // Guardar posiciones originales para deformación continua
      const originalPositions = pagePlaneGeo.attributes.position.array.slice();

      const pageMesh = new THREE.Mesh(pagePlaneGeo, dynamicPageMaterial);
      pageHinge.add(pageMesh);

      pageWings.push({
        hinge: pageHinge,
        mesh: pageMesh,
        geo: pagePlaneGeo,
        originalPositions,
        phaseOffset: (i * Math.PI * 2) / numPages,
        segmentsX,
        segmentsY
      });
    }

    // D. Cinta Marcapáginas Fluida (Ribbon)
    const ribbonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, bookHeight / 2 + 0.05, 0),
      new THREE.Vector3(0.08, 0.5, 0.15),
      new THREE.Vector3(0.18, -0.6, 0.22),
      new THREE.Vector3(0.24, -bookHeight / 2 - 0.35, 0.32),
      new THREE.Vector3(0.28, -bookHeight / 2 - 0.6, 0.38)
    ]);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 32, 0.022, 8, false);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMaterial);
    bookAssembly.add(ribbonMesh);

    // Dije geométrico en el extremo del marcapáginas (prisma verde métrico)
    const charmGeo = new THREE.OctahedronGeometry(0.07, 0);
    const charmMesh = new THREE.Mesh(charmGeo, charmMaterial);
    charmMesh.position.copy(ribbonCurve.getPoint(1));
    bookAssembly.add(charmMesh);

    // E. Nube de Micro-partículas Flotantes Tenues (Polvo de conocimiento / Telemetría)
    const particleCount = 75;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cWhite = new THREE.Color(0xf5f3ee);
    const cOrange = new THREE.Color(0xee6018);
    const cGreen = new THREE.Color(0xa0ca92);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const r = 1.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[idx + 2] = r * Math.cos(phi);

      const randChoice = Math.random();
      const col = randChoice < 0.6 ? cWhite : randChoice < 0.85 ? cOrange : cGreen;
      particleColors[idx] = col.r;
      particleColors[idx + 1] = col.g;
      particleColors[idx + 2] = col.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.042,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleCloud);

    // Referencias para control interactivo
    objectsRef.current = {
      rootGroup,
      bookAssembly,
      leftHinge,
      rightHinge,
      pageWings,
      ribbonMesh,
      charmMesh,
      particleCloud,
      registeredMaterials,
      camera,
      renderer,
      targetTilt: { x: 0, y: 0 },
      baseRotation: { x: 0.38, y: -0.42, z: 0.08 }
    };

    // 6. Ciclo de Animación Render
    let clock = new THREE.Clock();
    let currentAnimSpeed = 1;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      currentAnimSpeed += (speedMultiplier - currentAnimSpeed) * 0.1;

      if (!isPaused && rootGroup) {
        const t = elapsedTime * currentAnimSpeed;

        // 1. Levitación senoidal suave
        bookAssembly.position.y = Math.sin(t * 1.5) * 0.07;

        // 2. Parallax de inclinación hacia el cursor
        const { targetTilt } = objectsRef.current;
        rootGroup.rotation.x += (objectsRef.current.baseRotation.x + targetTilt.x - rootGroup.rotation.x) * 0.05;
        rootGroup.rotation.y += (objectsRef.current.baseRotation.y + targetTilt.y - rootGroup.rotation.y) * 0.05;

        // 3. Animación de Pasado de Páginas Articuladas y Curvadas
        pageWings.forEach((wing) => {
          const cycle = ((t * 0.65 + wing.phaseOffset) % (Math.PI * 2)) / (Math.PI * 2);
          const eased = Math.sin(cycle * Math.PI - Math.PI / 2) * 0.5 + 0.5;

          const minAngle = 0.12;
          const maxAngle = Math.PI - 0.22;
          const angle = minAngle + eased * (maxAngle - minAngle);
          wing.hinge.rotation.y = angle;

          const bendFactor = Math.sin(eased * Math.PI) * 0.35;
          const posAttr = wing.geo.attributes.position;
          const orig = wing.originalPositions;

          for (let p = 0; p < posAttr.count; p++) {
            const px = orig[p * 3];
            const u = px / pageWidth;
            const zOffset = Math.sin(u * Math.PI) * bendFactor;
            posAttr.setZ(p, zOffset);
          }
          posAttr.needsUpdate = true;
          wing.geo.computeVertexNormals();
        });

        // 4. Oscilación sutil de la cinta marcapáginas
        charmMesh.position.x = ribbonCurve.getPoint(1).x + Math.sin(t * 2) * 0.03;
        charmMesh.position.z = ribbonCurve.getPoint(1).z + Math.cos(t * 1.8) * 0.03;

        // 5. Giro lento de la nube de micro-partículas
        particleCloud.rotation.y += 0.08 * delta * currentAnimSpeed;
        particleCloud.rotation.x += 0.03 * delta * currentAnimSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Observador de Redimensión Responsive
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

    // 8. Limpieza completa al desmontar
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      spineGeo.dispose();
      bandGeo.dispose();
      leftCoverGeo.dispose();
      leftBlockGeo.dispose();
      rightCoverGeo.dispose();
      rightBlockGeo.dispose();
      emblemGeo.dispose();
      ribbonGeo.dispose();
      charmGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      pageWings.forEach(w => w.geo.dispose());
      registeredMaterials.forEach(m => m.dispose());
      renderer.dispose();
    };
  }, [variant]);

  // Manejo de Interacción de Arrastre 360° con Puntero / Touch
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!objectsRef.current.rootGroup) return;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      objectsRef.current.baseRotation.y += deltaX * 0.009;
      objectsRef.current.baseRotation.x += deltaY * 0.009;

      objectsRef.current.rootGroup.rotation.y = objectsRef.current.baseRotation.y;
      objectsRef.current.rootGroup.rotation.x = objectsRef.current.baseRotation.x;

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (objectsRef.current.targetTilt) {
        objectsRef.current.targetTilt.x = ny * 0.22;
        objectsRef.current.targetTilt.y = nx * 0.35;
      }
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handlePointerLeave = () => {
    isDraggingRef.current = false;
    if (objectsRef.current.targetTilt) {
      objectsRef.current.targetTilt.x = 0;
      objectsRef.current.targetTilt.y = 0;
    }
  };

  // Control 1: Alternar Modo Sólido vs Alambre / Estructura Técnica
  const toggleWireframe = useCallback(() => {
    const nextState = !isWireframe;
    setIsWireframe(nextState);
    if (objectsRef.current.registeredMaterials) {
      objectsRef.current.registeredMaterials.forEach(mat => {
        mat.wireframe = nextState;
      });
    }
  }, [isWireframe]);

  // Control 2: Ciclar Velocidad de Animación (1x -> 2x -> 0.5x -> 1x)
  const cycleSpeed = useCallback(() => {
    setSpeedMultiplier(prev => {
      if (prev === 1) return 2;
      if (prev === 2) return 0.5;
      return 1;
    });
  }, []);

  // Control 3: Disparo de Pulso / Impulso de Animación Expresivo
  const triggerPulse = useCallback(() => {
    if (pulseActive || !objectsRef.current.rootGroup) return;
    setPulseActive(true);

    const { rootGroup, bookAssembly } = objectsRef.current;
    let progress = 0;
    const initialRotY = objectsRef.current.baseRotation.y;

    const pulseInterval = setInterval(() => {
      progress += 0.05;
      const peak = Math.sin(progress * Math.PI);

      const s = 1 + peak * 0.18;
      if (bookAssembly) {
        bookAssembly.scale.set(s, s, s);
        bookAssembly.position.y = peak * 0.35;
      }

      if (rootGroup) {
        objectsRef.current.baseRotation.y = initialRotY + progress * Math.PI * 2;
        rootGroup.rotation.y = objectsRef.current.baseRotation.y;
      }

      if (progress >= 1) {
        clearInterval(pulseInterval);
        if (bookAssembly) {
          bookAssembly.scale.set(1, 1, 1);
          bookAssembly.position.y = 0;
        }
        objectsRef.current.baseRotation.y = initialRotY;
        setPulseActive(false);
      }
    }, 20);
  }, [pulseActive]);

  // Control 4: Restablecer Vista, Orientación y Cámara
  const resetOrientation = useCallback(() => {
    if (objectsRef.current.rootGroup) {
      objectsRef.current.baseRotation = { x: 0.38, y: -0.42, z: 0.08 };
      objectsRef.current.targetTilt = { x: 0, y: 0 };
      objectsRef.current.rootGroup.rotation.set(0.38, -0.42, 0.08);
      if (objectsRef.current.bookAssembly) {
        objectsRef.current.bookAssembly.scale.set(1, 1, 1);
        objectsRef.current.bookAssembly.position.set(0, 0, 0);
      }
    }
  }, []);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      
      {/* Encabezado Superior Limpio con Identificación en Mayúsculas */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 text-[10px] font-mono text-[#4d4947] border-b border-[#3d3a39]/20">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
          <span className="uppercase tracking-wider font-medium text-[#101010]">
            BIBLIOTECA VIRTUAL // LIBRO 3D INTERACTIVO
          </span>
        </div>
        <span className="text-[#8c8682] tracking-wider">THREE.JS WEBGL</span>
      </div>

      {/* Contenedor del Canvas Interactivo con Arrastre 360° */}
      <div 
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className="w-full h-44 sm:h-52 cursor-grab active:cursor-grabbing relative flex items-center justify-center overflow-hidden"
        title="Arrastra con el ratón para rotar el libro 360°"
      >
        {/* Leyenda Inferior Sutil */}
        <div className="absolute bottom-1.5 left-2 pointer-events-none text-[9px] font-mono text-[#4d4947]/70">
          Arrastrar para rotar · 360°
        </div>
      </div>

      {/* Barra de Controles Inferiores */}
      <div className="w-full flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-[#3d3a39]/20">
        
        <div className="flex items-center gap-1">
          {/* Botón: PAUSE / PLAY */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2 py-1 bg-[#101010] hover:bg-[#1d1a18] text-[#fafafa] rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors border border-[#3d3a39]"
            title={isPaused ? "Reanudar animación del libro" : "Pausar animación del libro"}
          >
            {isPaused ? <Play size={10} className="text-[#a0ca92]" /> : <Pause size={10} className="text-[#ee6018]" />}
            <span>{isPaused ? 'PLAY' : 'PAUSE'}</span>
          </button>

          {/* Botón: Selector de Velocidad */}
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 bg-[#ffffff]/60 hover:bg-[#ffffff] text-[#101010] rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors border border-[#3d3a39]/30"
            title="Ajustar velocidad de paso de páginas"
          >
            <RotateCw size={10} />
            <span>{speedMultiplier}x</span>
          </button>

          {/* Botón: Modo de Vista SÓLIDO / ALAMBRE */}
          <button
            onClick={toggleWireframe}
            className={`px-2 py-1 rounded-[3px] text-[10px] font-mono flex items-center gap-1 transition-colors border ${
              isWireframe 
                ? 'bg-[#ee6018] text-white border-[#ee6018]' 
                : 'bg-[#ffffff]/60 hover:bg-[#ffffff] text-[#101010] border-[#3d3a39]/30'
            }`}
            title="Alternar entre vista sólida editorial y líneas de estructura técnica"
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
            title="Disparar impulso de animación expresivo"
          >
            <Zap size={10} className="fill-current" />
            <span>PULSO</span>
          </button>

          {/* Botón: Reiniciar Orientación */}
          <button
            onClick={resetOrientation}
            className="px-1.5 py-1 bg-transparent hover:bg-[#101010]/10 text-[#4d4947] rounded-[3px] text-[10px] font-mono transition-colors"
            title="Restablecer posición y cámara inicial del libro"
          >
            <RefreshCw size={10} />
          </button>
        </div>

      </div>

    </div>
  );
}
