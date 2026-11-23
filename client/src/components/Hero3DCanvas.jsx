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

  // Lista de velocidades requeridas: [0.5, 1, 1.5, 2] con inicio en 1x (índice 1)
  const speeds = [0.5, 1, 1.5, 2];
  const [speedIndex, setSpeedIndex] = useState(1);
  const speedIndexRef = useRef(1);

  // Estados de control interactivo con Refs para evitar closures obsoletos en requestAnimationFrame
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  const [isWireframe, setIsWireframe] = useState(false);
  const isWireframeRef = useRef(false);

  const [pulseActive, setPulseActive] = useState(false);
  const pulseActiveRef = useRef(false);

  const floatingTimeRef = useRef(0);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 340;
    const height = currentMount.clientHeight || 240;

    // 1. Escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Cámara con encuadre suave
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 1.3, 6.8);
    camera.lookAt(0, 0, 0);

    // 3. Renderizador WebGL con antialiasing y renderizado suave
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

    // 4. Sistema de Iluminación de Estudio Suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.88);
    scene.add(ambientLight);

    // Luz principal cenital con sombra suave
    const keyLight = new THREE.DirectionalLight(0xfffaf0, 1.5);
    keyLight.position.set(4, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Luz de relleno cálida frontal-lateral
    const fillLight = new THREE.DirectionalLight(0xffe2d0, 0.75);
    fillLight.position.set(-5, 2.5, 4);
    scene.add(fillLight);

    // Rim light trasero suave
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);

    // Luz focal cenital sobre las páginas
    const spotLight = new THREE.PointLight(0xfff5e6, 0.65, 10);
    spotLight.position.set(0, 3, 2.5);
    scene.add(spotLight);

    // 5. Grupo Raíz del Libro con inclinación frontal para ver páginas desde arriba/frente
    const rootGroup = new THREE.Group();
    // Inclinación en X (0.45 rad = ~26°)
    const defaultTiltX = 0.45;
    rootGroup.rotation.x = defaultTiltX;
    scene.add(rootGroup);

    // Grupo de rotación continua 360° en Y
    const bookGroup = new THREE.Group();
    rootGroup.add(bookGroup);

    // --- MATERIALES DEL LIBRO ---
    // Tapa roja/coral satinada con sombreado suave
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: 0xee3b2b,
      roughness: 0.35,
      metalness: 0.05,
      flatShading: false,
      side: THREE.DoubleSide
    });

    // Páginas crema/marfil suave
    const pageMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4efe4,
      roughness: 0.38,
      metalness: 0.02,
      flatShading: false,
      side: THREE.DoubleSide
    });

    // Renglones de texto oscuro en relieve (#3A3A3A)
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3a,
      roughness: 0.32,
      metalness: 0.06,
      flatShading: false
    });

    const registeredMaterials = [coverMaterial, pageMaterial, textMaterial];

    // --- FUNCIÓN MATEMÁTICA DE LA CURVA CONVEXA DE CADA PÁGINA ---
    // Sube suavemente en arco desde el centro x=0 hacia afuera y desciende en el borde exterior
    const getPageHeight = (x, maxW, peakH) => {
      const u = Math.max(0, Math.min(1, Math.abs(x) / maxW));
      return Math.sin(u * Math.PI * 0.82 + 0.14) * peakH - Math.sin(0.14) * peakH;
    };

    // Parámetros de escala del libro
    const pageHalfW = 1.35;
    const pageDepth = 2.05;
    const archH = 0.38;

    // --- 1. BASE: TAPA ROJA/CORAL GRUESA Y REDONDEADA (#EE3B2B) ---
    // Forma en "V" muy abierta (casi plana ~150°) que envuelve por debajo a las hojas
    const coverHalfW = pageHalfW + 0.12; // 1.47
    const coverDepth = pageDepth + 0.18; // 2.23
    const coverThick = 0.12;
    const coverBaseY = -0.16;

    const coverShape = new THREE.Shape();
    const cSteps = 32;

    // Contorno superior de la tapa (de -coverHalfW a +coverHalfW)
    coverShape.moveTo(-coverHalfW, coverBaseY + getPageHeight(-coverHalfW, coverHalfW, archH));
    for (let i = 0; i <= cSteps; i++) {
      const x = -coverHalfW + (i / cSteps) * (2 * coverHalfW);
      const y = coverBaseY + getPageHeight(x, coverHalfW, archH);
      coverShape.lineTo(x, y);
    }
    // Lado derecho hacia abajo
    const cRightY = coverBaseY + getPageHeight(coverHalfW, coverHalfW, archH);
    coverShape.lineTo(coverHalfW, cRightY - coverThick);

    // Contorno inferior de la tapa (de +coverHalfW a -coverHalfW)
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
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 6
    });
    coverGeo.center();
    coverGeo.computeVertexNormals();

    const coverMesh = new THREE.Mesh(coverGeo, coverMaterial);
    coverMesh.castShadow = true;
    coverMesh.receiveShadow = true;
    bookGroup.add(coverMesh);

    // --- 2. MEDIO: DOS BLOQUES DE HOJAS COLOR CREMA EN 2 CAPAS ESCALONADAS (#F4EFE4) ---
    // Capa 1: Capa inferior de hojas crema
    // Capa 2: Capa superior visible de hojas crema
    const layers = [
      { w: pageHalfW + 0.03, d: pageDepth + 0.05, thick: 0.075, yOffset: -0.06 },
      { w: pageHalfW,        d: pageDepth,        thick: 0.080, yOffset: 0.00 }
    ];

    layers.forEach((layer) => {
      const layerShape = new THREE.Shape();
      const pSteps = 28;

      // Superficie superior curvada de la capa
      layerShape.moveTo(-layer.w, layer.yOffset + getPageHeight(-layer.w, layer.w, archH));
      for (let i = 0; i <= pSteps; i++) {
        const x = -layer.w + (i / pSteps) * (2 * layer.w);
        const y = layer.yOffset + getPageHeight(x, layer.w, archH);
        layerShape.lineTo(x, y);
      }

      // Lateral derecho
      const rY = layer.yOffset + getPageHeight(layer.w, layer.w, archH);
      layerShape.lineTo(layer.w, rY - layer.thick);

      // Base inferior de la capa
      for (let i = pSteps; i >= 0; i--) {
        const x = -layer.w + (i / pSteps) * (2 * layer.w);
        const y = layer.yOffset + getPageHeight(x, layer.w, archH) - layer.thick;
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
      layerGeo.center();
      layerGeo.computeVertexNormals();

      const layerMesh = new THREE.Mesh(layerGeo, pageMaterial);
      layerMesh.position.y = layer.yOffset * 0.5;
      layerMesh.castShadow = true;
      layerMesh.receiveShadow = true;
      bookGroup.add(layerMesh);
    });

    // --- 3. ARRIBA: 5 BARRAS/LÍNEAS DE TEXTO OSCURAS POR PÁGINA (ESTRICTAMENTE CONTENIDAS) ---
    // 5 líneas en la página izquierda, 5 líneas en la derecha (10 líneas en total)
    // Apoyadas exactamente sobre la superficie superior de la capa crema + offset mínimo de 0.012
    const textGroup = new THREE.Group();
    bookGroup.add(textGroup);

    const topLayer = layers[1];
    const numLines = 5;
    const zStart = -topLayer.d * 0.34;
    const zEnd = topLayer.d * 0.34;
    const zStep = (zEnd - zStart) / (numLines - 1);

    // Márgenes estrictos dentro de cada página:
    // Página izquierda: x de -1.14 a -0.26
    // Página derecha: x de 0.26 a 1.14
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < numLines; i++) {
        const lineZ = zStart + i * zStep;
        
        // La última línea de cada bloque es un poco más corta para simular un párrafo editorial natural
        const lengthFactor = (i === numLines - 1) ? 0.72 : 1.0;
        
        const innerX = 0.26;
        const outerX = 0.26 + (1.14 - 0.26) * lengthFactor;
        
        const startX = side === 1 ? innerX : -outerX;
        const endX = side === 1 ? outerX : -innerX;

        const linePoints = [];
        const samples = 14;

        for (let s = 0; s <= samples; s++) {
          const t = s / samples;
          const px = startX + t * (endX - startX);
          // Altura calculada con la misma función matemática de la superficie + offset mínimo 0.012
          const py = topLayer.yOffset + getPageHeight(px, topLayer.w, archH) + 0.012;
          linePoints.push(new THREE.Vector3(px, py, lineZ));
        }

        const curve = new THREE.CatmullRomCurve3(linePoints);
        const tubeRadius = 0.022;
        const tubeGeo = new THREE.TubeGeometry(curve, 14, tubeRadius, 8, false);
        tubeGeo.computeVertexNormals();

        const tubeMesh = new THREE.Mesh(tubeGeo, textMaterial);
        tubeMesh.castShadow = true;
        textGroup.add(tubeMesh);

        // Tapas redondeadas en los extremos de cada línea
        const sphereGeo = new THREE.SphereGeometry(tubeRadius, 8, 8);
        const startCap = new THREE.Mesh(sphereGeo, textMaterial);
        startCap.position.copy(linePoints[0]);
        textGroup.add(startCap);

        const endCap = new THREE.Mesh(sphereGeo, textMaterial);
        endCap.position.copy(linePoints[samples]);
        textGroup.add(endCap);
      }
    }

    // --- 4. MICRO-PARTÍCULAS FLOTANTES DE FONDO ---
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

    // Guardar referencias
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

    // 6. Bucle de Animación con soporte estricto de isPaused y velocidad
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const currentSpeed = speeds[speedIndexRef.current];

      // Verificación directa en ref: si está en pausa, se detiene completamente el giro y la flotación
      if (!isPausedRef.current && bookGroup) {
        // Giro continuo de 360° en el eje vertical Y
        bookGroup.rotation.y += 0.015 * currentSpeed;

        // Levitación flotante suave
        floatingTimeRef.current += delta * currentSpeed;
        bookGroup.position.y = Math.sin(floatingTimeRef.current * 1.8) * 0.06;

        // Parallax hacia el cursor
        const { targetTilt } = objectsRef.current;
        rootGroup.rotation.x += (defaultTiltX + targetTilt.x - rootGroup.rotation.x) * 0.05;
        rootGroup.rotation.z += (targetTilt.y * 0.4 - rootGroup.rotation.z) * 0.05;

        // Giro lento de las partículas
        particleCloud.rotation.y += 0.04 * delta * currentSpeed;
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
    isDraggingRef.current = false;
  };

  const handlePointerLeave = () => {
    isDraggingRef.current = false;
    if (objectsRef.current.targetTilt) {
      objectsRef.current.targetTilt.x = 0;
      objectsRef.current.targetTilt.y = 0;
    }
  };

  // CONTROL 1: PAUSE / PLAY
  const togglePlayPause = useCallback(() => {
    const nextState = !isPausedRef.current;
    isPausedRef.current = nextState;
    setIsPaused(nextState);
  }, []);

  // CONTROL 2: Selector de Velocidad Circular ([0.5, 1, 1.5, 2])
  const cycleSpeed = useCallback(() => {
    const nextIndex = (speedIndexRef.current + 1) % speeds.length;
    speedIndexRef.current = nextIndex;
    setSpeedIndex(nextIndex);
  }, [speeds.length]);

  // CONTROL 3: Alternar Modo Sólido / Alambre
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

  // CONTROL 4: Disparo de PULSO (Giro rápido 360° con rebote elástico de escala)
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

      // Rebote elástico de escala
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

  // CONTROL 5: Reiniciar Orientación al Ángulo Inicial Frontal-Inclinado
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
