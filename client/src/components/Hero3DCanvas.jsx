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

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 340;
    const height = currentMount.clientHeight || 240;

    // 1. Escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Cámara con encuadre suave
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.2);
    camera.lookAt(0, -0.05, 0);

    // 3. Renderizador WebGL de alta precisión cromática
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Ajuste de color y tono ACESFilmic para estética 3D clay / soft icon
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    if (renderer.outputColorSpace !== undefined) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Sistema de Iluminación de Estudio Suave (Soft Studio Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Luz principal cenital con sombra suave
    const keyLight = new THREE.DirectionalLight(0xfffdfa, 1.4);
    keyLight.position.set(4, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Luz de relleno cálida frontal
    const fillLight = new THREE.DirectionalLight(0xffe8dc, 0.75);
    fillLight.position.set(-5, 3, 4);
    scene.add(fillLight);

    // Rim light trasero suave para destacar los contornos redondeados
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.95);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);

    // Luz focal sutil sobre las páginas abiertas
    const spotLight = new THREE.PointLight(0xfff6ea, 0.6, 10);
    spotLight.position.set(0, 2.5, 3);
    scene.add(spotLight);

    // 5. Grupo Raíz del Libro 3D
    const rootGroup = new THREE.Group();
    // Inclinación inicial en X (~28°) para apreciar el interior abierto y las líneas 3D
    const defaultTiltX = 0.48;
    rootGroup.rotation.x = defaultTiltX;
    scene.add(rootGroup);

    const bookGroup = new THREE.Group();
    rootGroup.add(bookGroup);

    // --- MATERIALES ESTILO "SOFT 3D / CLAY RENDER" ---
    // Tapa roja coral / naranja vibrante satinada
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: 0xee3b2b,
      roughness: 0.32,
      metalness: 0.04,
      side: THREE.DoubleSide
    });

    // Páginas crema/marfil cálido suaves
    const pageMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f1e6,
      roughness: 0.38,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    // Líneas de texto 3D en relieve (carbón suave)
    const textBarMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.35,
      metalness: 0.05
    });

    const registeredMaterials = [coverMaterial, pageMaterial, textBarMaterial];

    // --- FUNCIONES MATEMÁTICAS PARA EL ARCO ORGÁNICO EN "M" ---
    // Curva convexa de la página derecha: x desde 0 hasta w
    const getPageY = (x, w, hArch) => {
      const u = Math.max(0, Math.min(1, x / w));
      // Forma de arco suave: nace en el pliegue central (x=0), sube y desciende suavemente hacia el borde
      return Math.sin(u * Math.PI * 0.88 + 0.12) * hArch - Math.sin(0.12) * hArch;
    };

    // --- 1. TAPA EXTERIOR GRUESA Y REDONDEADA (ROJO CORAL #EE3B2B) ---
    const coverHalfW = 1.62;
    const coverDepth = 2.45;
    const coverArchH = 0.52;
    const coverThickness = 0.14;

    // Crear silueta 2D de la cubierta con suave forma en "M" abierta
    const coverShape = new THREE.Shape();
    const steps = 30;

    // Borde superior interior de la cubierta
    // Lado derecho (de 0 a coverHalfW)
    coverShape.moveTo(0, 0.02);
    for (let i = 1; i <= steps; i++) {
      const x = (i / steps) * coverHalfW;
      const y = getPageY(x, coverHalfW, coverArchH);
      coverShape.lineTo(x, y);
    }
    // Cierre del borde exterior derecho redondeado hacia abajo
    const rightEdgeY = getPageY(coverHalfW, coverHalfW, coverArchH);
    coverShape.lineTo(coverHalfW, rightEdgeY - coverThickness);

    // Borde inferior exterior de la cubierta (de coverHalfW a -coverHalfW)
    for (let i = steps; i >= 0; i--) {
      const x = (i / steps) * coverHalfW;
      const y = getPageY(x, coverHalfW, coverArchH) - coverThickness;
      coverShape.lineTo(x, y);
    }
    for (let i = 1; i <= steps; i++) {
      const x = -(i / steps) * coverHalfW;
      const y = getPageY(Math.abs(x), coverHalfW, coverArchH) - coverThickness;
      coverShape.lineTo(x, y);
    }
    // Lado izquierdo exterior hacia arriba
    const leftEdgeY = getPageY(coverHalfW, coverHalfW, coverArchH);
    coverShape.lineTo(-coverHalfW, leftEdgeY);

    // Borde superior interior lado izquierdo (de -coverHalfW a 0)
    for (let i = steps - 1; i >= 0; i--) {
      const x = -(i / steps) * coverHalfW;
      const y = getPageY(Math.abs(x), coverHalfW, coverArchH);
      coverShape.lineTo(x, y);
    }

    const coverExtrudeSettings = {
      steps: 1,
      depth: coverDepth,
      bevelEnabled: true,
      bevelThickness: 0.065,
      bevelSize: 0.065,
      bevelSegments: 8
    };

    const coverGeo = new THREE.ExtrudeGeometry(coverShape, coverExtrudeSettings);
    coverGeo.center(); // Centrar en el origen
    const coverMesh = new THREE.Mesh(coverGeo, coverMaterial);
    coverMesh.castShadow = true;
    coverMesh.receiveShadow = true;
    bookGroup.add(coverMesh);

    // --- 2. BLOQUE DE PÁGINAS CURVAS ESCALONADAS EN 3 CAPAS (#F5F1E6) ---
    // Creamos 3 niveles escalonados de páginas (inferior, media y superior)
    const pageLayersConfig = [
      { halfW: 1.50, depth: 2.32, archH: 0.50, baseThick: 0.11, yOffset: 0.01 },
      { halfW: 1.45, depth: 2.22, archH: 0.50, baseThick: 0.13, yOffset: 0.05 },
      { halfW: 1.40, depth: 2.12, archH: 0.50, baseThick: 0.15, yOffset: 0.09 }
    ];

    const pageMeshes = [];

    pageLayersConfig.forEach((cfg) => {
      const pageShape = new THREE.Shape();
      const pSteps = 28;

      // Superficie superior arqueada (lado derecho)
      pageShape.moveTo(0, cfg.yOffset);
      for (let i = 1; i <= pSteps; i++) {
        const x = (i / pSteps) * cfg.halfW;
        const y = getPageY(x, cfg.halfW, cfg.archH) + cfg.yOffset;
        pageShape.lineTo(x, y);
      }

      // Borde lateral derecho
      const rY = getPageY(cfg.halfW, cfg.halfW, cfg.archH) + cfg.yOffset;
      pageShape.lineTo(cfg.halfW, rY - cfg.baseThick);

      // Base inferior (lado derecho)
      for (let i = pSteps; i >= 0; i--) {
        const x = (i / pSteps) * cfg.halfW;
        const y = getPageY(x, cfg.halfW, cfg.archH) + cfg.yOffset - cfg.baseThick;
        pageShape.lineTo(x, y);
      }

      // Base inferior (lado izquierdo)
      for (let i = 1; i <= pSteps; i++) {
        const x = -(i / pSteps) * cfg.halfW;
        const y = getPageY(Math.abs(x), cfg.halfW, cfg.archH) + cfg.yOffset - cfg.baseThick;
        pageShape.lineTo(x, y);
      }

      // Borde lateral izquierdo
      const lY = getPageY(cfg.halfW, cfg.halfW, cfg.archH) + cfg.yOffset;
      pageShape.lineTo(-cfg.halfW, lY);

      // Superficie superior arqueada (lado izquierdo)
      for (let i = pSteps - 1; i >= 0; i--) {
        const x = -(i / pSteps) * cfg.halfW;
        const y = getPageY(Math.abs(x), cfg.halfW, cfg.archH) + cfg.yOffset;
        pageShape.lineTo(x, y);
      }

      const pageExtrudeSettings = {
        steps: 1,
        depth: cfg.depth,
        bevelEnabled: true,
        bevelThickness: 0.045,
        bevelSize: 0.045,
        bevelSegments: 6
      };

      const pageGeo = new THREE.ExtrudeGeometry(pageShape, pageExtrudeSettings);
      pageGeo.center();
      const pageMesh = new THREE.Mesh(pageGeo, pageMaterial);
      pageMesh.position.y = cfg.yOffset * 0.5;
      pageMesh.castShadow = true;
      pageMesh.receiveShadow = true;
      bookGroup.add(pageMesh);
      pageMeshes.push(pageMesh);
    });

    // --- 3. LÍNEAS DE TEXTO 3D EN RELIEVE (CÁPSULAS CURVAS #333333) ---
    // 6 líneas curvadas en cada cara abierta que siguen el arco de la página superior
    const topConfig = pageLayersConfig[2];
    const numLines = 6;
    const textGroup = new THREE.Group();
    bookGroup.add(textGroup);

    const startZ = -topConfig.depth * 0.38;
    const endZ = topConfig.depth * 0.38;
    const zStep = (endZ - startZ) / (numLines - 1);

    for (let side = -1; side <= 1; side += 2) {
      for (let row = 0; row < numLines; row++) {
        const lineZ = startZ + row * zStep;
        
        // Coordenadas X de inicio y fin de la línea en la página
        const startX = side === 1 ? 0.30 : -1.22;
        const endX = side === 1 ? 1.22 : -0.30;
        const linePoints = [];
        const samples = 14;

        for (let s = 0; s <= samples; s++) {
          const t = s / samples;
          const px = startX + t * (endX - startX);
          const py = getPageY(Math.abs(px), topConfig.halfW, topConfig.archH) + topConfig.yOffset + 0.045;
          linePoints.push(new THREE.Vector3(px, py, lineZ));
        }

        const curve = new THREE.CatmullRomCurve3(linePoints);
        // Barra tubular con extremos redondeados (cápsula 3D)
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.026, 10, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, textBarMaterial);
        tubeMesh.castShadow = true;
        textGroup.add(tubeMesh);

        // Tapas redondeadas en los extremos de cada línea
        const sphereCapGeo = new THREE.SphereGeometry(0.026, 10, 10);
        const capStart = new THREE.Mesh(sphereCapGeo, textBarMaterial);
        capStart.position.copy(linePoints[0]);
        textGroup.add(capStart);

        const capEnd = new THREE.Mesh(sphereCapGeo, textBarMaterial);
        capEnd.position.copy(linePoints[samples]);
        textGroup.add(capEnd);
      }
    }

    // --- 4. MICRO-PARTÍCULAS FLOTANTES TENUES DE AMBIENTE ---
    const particleCount = 65;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cWhite = new THREE.Color(0xfcfbf9);
    const cOrange = new THREE.Color(0xee6018);
    const cGreen = new THREE.Color(0xa0ca92);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const r = 2.2 + Math.random() * 2.2;
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

    // Guardar referencias
    objectsRef.current = {
      rootGroup,
      bookGroup,
      coverMesh,
      pageMeshes,
      textGroup,
      particleCloud,
      registeredMaterials,
      camera,
      renderer,
      targetTilt: { x: 0, y: 0 },
      baseRotationY: 0,
      defaultTiltX
    };

    // 6. Bucle de Animación Continuo
    let clock = new THREE.Clock();
    let currentAnimSpeed = 1;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      currentAnimSpeed += (speedMultiplier - currentAnimSpeed) * 0.1;

      if (!isPaused && bookGroup) {
        // Giro continuo suave en el eje vertical Y
        objectsRef.current.baseRotationY += 0.55 * delta * currentAnimSpeed;
        bookGroup.rotation.y = objectsRef.current.baseRotationY;

        // Levitación senoidal suave
        bookGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.08;

        // Parallax hacia el cursor
        const { targetTilt } = objectsRef.current;
        rootGroup.rotation.x += (defaultTiltX + targetTilt.x - rootGroup.rotation.x) * 0.05;
        rootGroup.rotation.z += (targetTilt.y * 0.4 - rootGroup.rotation.z) * 0.05;

        // Giro de micro-partículas
        particleCloud.rotation.y += 0.06 * delta * currentAnimSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Redimensionamiento Responsive
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

    // 8. Limpieza en desmontaje
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

  // Manejo de Interacción con Arrastre 360° y Hover Parallax
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!objectsRef.current.bookGroup) return;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      objectsRef.current.baseRotationY += deltaX * 0.01;
      objectsRef.current.bookGroup.rotation.y = objectsRef.current.baseRotationY;

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
    isDraggingRef.current = false;
  };

  const handlePointerLeave = () => {
    isDraggingRef.current = false;
    if (objectsRef.current.targetTilt) {
      objectsRef.current.targetTilt.x = 0;
      objectsRef.current.targetTilt.y = 0;
    }
  };

  // Control 1: Alternar Modo Sólido / Alambre
  const toggleWireframe = useCallback(() => {
    const nextState = !isWireframe;
    setIsWireframe(nextState);
    if (objectsRef.current.registeredMaterials) {
      objectsRef.current.registeredMaterials.forEach(mat => {
        mat.wireframe = nextState;
      });
    }
  }, [isWireframe]);

  // Control 2: Ciclar Velocidad (1x -> 2x -> 0.5x -> 1x)
  const cycleSpeed = useCallback(() => {
    setSpeedMultiplier(prev => {
      if (prev === 1) return 2;
      if (prev === 2) return 0.5;
      return 1;
    });
  }, []);

  // Control 3: Disparo de PULSO (Giro rápido 360° con rebote elástico de escala)
  const triggerPulse = useCallback(() => {
    if (pulseActive || !objectsRef.current.bookGroup) return;
    setPulseActive(true);

    const { bookGroup } = objectsRef.current;
    let progress = 0;
    const initialRotY = objectsRef.current.baseRotationY;

    const pulseInterval = setInterval(() => {
      progress += 0.05;
      const peak = Math.sin(progress * Math.PI);

      // Rebote elástico de escala
      const s = 1 + peak * 0.2;
      if (bookGroup) {
        bookGroup.scale.set(s, s, s);
      }

      // Impulso de giro completo dinámico
      objectsRef.current.baseRotationY = initialRotY + progress * Math.PI * 2;
      if (bookGroup) {
        bookGroup.rotation.y = objectsRef.current.baseRotationY;
      }

      if (progress >= 1) {
        clearInterval(pulseInterval);
        if (bookGroup) {
          bookGroup.scale.set(1, 1, 1);
        }
        objectsRef.current.baseRotationY = initialRotY;
        setPulseActive(false);
      }
    }, 20);
  }, [pulseActive]);

  // Control 4: Reiniciar Orientación al Ángulo Inicial Frontal-Inclinado
  const resetOrientation = useCallback(() => {
    if (objectsRef.current.rootGroup && objectsRef.current.bookGroup) {
      const { defaultTiltX, rootGroup, bookGroup } = objectsRef.current;
      objectsRef.current.baseRotationY = 0;
      objectsRef.current.targetTilt = { x: 0, y: 0 };
      rootGroup.rotation.set(defaultTiltX, 0, 0);
      bookGroup.rotation.set(0, 0, 0);
      bookGroup.scale.set(1, 1, 1);
      bookGroup.position.set(0, 0, 0);
    }
  }, []);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      
      {/* Encabezado Superior Limpio */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 text-[10px] font-mono text-[#4d4947] border-b border-[#3d3a39]/20">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
          <span className="uppercase tracking-wider font-medium text-[#101010]">
            BIBLIOTECA VIRTUAL // LIBRO 3D INTERACTIVO
          </span>
        </div>
        <span className="text-[#8c8682] tracking-wider font-medium">THREE.JS WEBGL</span>
      </div>

      {/* Contenedor del Canvas Interactivo con Arrastre 360° */}
      <div 
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className="w-full h-48 sm:h-56 cursor-grab active:cursor-grabbing relative flex items-center justify-center overflow-hidden"
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

          {/* Botón: Reiniciar Orientación */}
          <button
            onClick={resetOrientation}
            className="px-1.5 py-1 bg-transparent hover:bg-[#101010]/10 text-[#4d4947] rounded-[3px] text-[10px] font-mono transition-colors"
            title="Restablecer posición inicial frontal-inclinada"
          >
            <RefreshCw size={10} />
          </button>
        </div>

      </div>

    </div>
  );
}
