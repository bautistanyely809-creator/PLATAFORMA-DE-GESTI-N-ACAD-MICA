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

  // Estados de control interactivo
  const [isWireframe, setIsWireframe] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);

  // Generador procedural de textura editorial para cubiertas (Tapa Terracota / Cuero con grano lino)
  const createCoverTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Fondo degradado terracota noble / vino cálido
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#752a1e');
    grad.addColorStop(0.5, '#612117');
    grad.addColorStop(1, '#481710');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Micro-textura procedural de grano táctil / tejido lino fino
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let x = 0; x < 512; x += 3) {
      for (let y = 0; y < 512; y += 3) {
        if ((x + y) % 6 === 0) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    for (let i = 0; i < 3000; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctx.fillRect(rx, ry, 1, 1);
    }

    // Marco fileteado en hot foil dorado/naranja cálido
    ctx.strokeStyle = 'rgba(238, 96, 24, 0.45)';
    ctx.lineWidth = 4;
    ctx.strokeRect(28, 28, 456, 456);

    ctx.strokeStyle = 'rgba(240, 185, 120, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, 440, 440);

    // Detalle emblemático central sutil (Sello editorial EDUNOVA)
    ctx.strokeStyle = 'rgba(240, 185, 120, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(256, 256, 52, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(238, 96, 24, 0.7)';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('EDUNOVA', 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  };

  // Generador procedural de textura para páginas interiores (Papel Marfil cálido con líneas y encabezado)
  const createPageTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    // Papel marfil/crema con gradiente suave de sombra cerca del lomo
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, '#e4dece');
    grad.addColorStop(0.12, '#faf7f0');
    grad.addColorStop(0.92, '#fcfbf8');
    grad.addColorStop(1, '#eee9de');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 720);

    // Encabezado editorial superior
    ctx.fillStyle = '#ee6018';
    ctx.fillRect(45, 60, 422, 3);

    ctx.fillStyle = '#8c8682';
    ctx.font = '600 13px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('EDUNOVA // GESTIÓN ACADÉMICA', 48, 50);

    ctx.fillStyle = '#a0ca92';
    ctx.beginPath();
    ctx.arc(460, 47, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Líneas finas simulando renglones de lectura editorial
    ctx.fillStyle = 'rgba(120, 110, 100, 0.22)';
    const startY = 95;
    const lineHeight = 26;
    for (let i = 0; i < 21; i++) {
      const y = startY + i * lineHeight;
      // Ancho irregular para simular párrafos naturales
      let w = 422;
      if (i === 6 || i === 13 || i === 20) w = 240 + (i * 17) % 120;
      ctx.fillRect(45, y, w, 1.4);
    }

    // Pie de página con folio
    ctx.fillStyle = 'rgba(140, 134, 130, 0.6)';
    ctx.font = '12px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('— ADSO 3413988 —', 256, 680);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  };

  // Generador procedural de cantos de hojas apiladas (Bloque de papel con estriaciones finas)
  const createPageEdgeTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f2ece0';
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = 'rgba(150, 135, 120, 0.2)';
    for (let y = 0; y < 256; y += 2) {
      if (y % 4 === 0) {
        ctx.fillRect(0, y, 256, 1);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 12);
    return texture;
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 340;
    const height = currentMount.clientHeight || 240;

    // 1. Escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Cámara de perspectiva encuadrada para apreciar volumen 3D
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 6.2);
    camera.lookAt(0, 0, 0);

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

    // Configuración de ToneMapping y ColorSpace ACESFilmic para nitidez y colores limpios
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    if (renderer.outputColorSpace !== undefined) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Sistema de Iluminación de Estudio Editorial Multifuente
    // Luz ambiental equilibrada
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
    scene.add(ambientLight);

    // Luz principal cenital con tono marfil cálido
    const keyLight = new THREE.DirectionalLight(0xfffaee, 1.45);
    keyLight.position.set(4.5, 7.5, 5.5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Luz de relleno cálida institucional (Naranja suave EDUNOVA)
    const fillLight = new THREE.DirectionalLight(0xee6018, 0.65);
    fillLight.position.set(-5, -1.5, -2.5);
    scene.add(fillLight);

    // Luz de contorno (Rim light) trasera que perfila el volumen del lomo y cubiertas
    const rimLight = new THREE.DirectionalLight(0xe8f5e9, 1.1);
    rimLight.position.set(0, 4.5, -5.5);
    scene.add(rimLight);

    // Luz focal suave sobre el área de lectura
    const pageSpot = new THREE.PointLight(0xfff6e6, 0.7, 9);
    pageSpot.position.set(0, 2.5, 2.5);
    scene.add(pageSpot);

    // 5. Grupo Raíz del Libro y su Ensamble Articulado
    const rootGroup = new THREE.Group();
    // Inclinación inicial isométrica en 3/4 (aprecia profundidad, tapas, lomo y hojas sin verse plano)
    const baseRotation = { x: 0.44, y: -0.52, z: 0.1 };
    rootGroup.rotation.set(baseRotation.x, baseRotation.y, baseRotation.z);
    scene.add(rootGroup);

    const bookAssembly = new THREE.Group();
    rootGroup.add(bookAssembly);

    // Texturas procedurales
    const coverTex = createCoverTexture();
    const pageTex = createPageTexture();
    const pageEdgeTex = createPageEdgeTexture();

    // Dimensiones proporcionales armónicas
    const bookWidth = 1.75;
    const bookHeight = 2.45;
    const spineRadius = 0.22;
    const coverThickness = 0.055;
    const pageBlockThickness = 0.22;

    // --- MATERIALES PBR REFINADOS ---
    // Tapa en terracota texturizada
    const coverMaterial = new THREE.MeshStandardMaterial({
      map: coverTex,
      roughness: 0.42,
      metalness: 0.12,
      side: THREE.DoubleSide
    });

    // Lomo del libro con acabado a juego
    const spineMaterial = new THREE.MeshStandardMaterial({
      color: 0x582017,
      roughness: 0.45,
      metalness: 0.15
    });

    // Anillos dorados y costura del lomo
    const goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xee6018,
      roughness: 0.25,
      metalness: 0.8
    });

    // Bloque fijo de cantos de hojas
    const pageBlockMaterial = new THREE.MeshStandardMaterial({
      map: pageEdgeTex,
      roughness: 0.88,
      metalness: 0.02
    });

    // Hojas articuladas de lectura con textura editorial marfil
    const dynamicPageMaterial = new THREE.MeshStandardMaterial({
      map: pageTex,
      roughness: 0.65,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    // Cinta marcapáginas satinada naranja
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: 0xee6018,
      roughness: 0.28,
      metalness: 0.45,
      side: THREE.DoubleSide
    });

    // Dije verde métrico institucional
    const charmMaterial = new THREE.MeshStandardMaterial({
      color: 0xa0ca92,
      roughness: 0.18,
      metalness: 0.85
    });

    const registeredMaterials = [
      coverMaterial,
      spineMaterial,
      goldAccentMaterial,
      pageBlockMaterial,
      dynamicPageMaterial,
      ribbonMaterial,
      charmMaterial
    ];

    // --- CONSTRUCCIÓN GEOMÉTRICA PROLIJA SIN ESPACIOS NI ATRAVESAMIENTOS ---
    
    // A. Lomo cilíndrico arqueado continuo
    const spineGeo = new THREE.CylinderGeometry(
      spineRadius,
      spineRadius,
      bookHeight + 0.06,
      32,
      1,
      false,
      Math.PI / 2,
      Math.PI
    );
    const spineMesh = new THREE.Mesh(spineGeo, spineMaterial);
    spineMesh.rotation.y = Math.PI / 2;
    spineMesh.position.set(0, 0, -spineRadius * 0.45);
    bookAssembly.add(spineMesh);

    // Filetes acentuados dorados/naranja en el lomo
    const bandGeo = new THREE.TorusGeometry(spineRadius * 1.015, 0.015, 16, 32, Math.PI);
    const bandTop = new THREE.Mesh(bandGeo, goldAccentMaterial);
    bandTop.rotation.y = Math.PI / 2;
    bandTop.position.set(0, 0.8, -spineRadius * 0.45);
    bookAssembly.add(bandTop);

    const bandBottom = new THREE.Mesh(bandGeo, goldAccentMaterial);
    bandBottom.rotation.y = Math.PI / 2;
    bandBottom.position.set(0, -0.8, -spineRadius * 0.45);
    bookAssembly.add(bandBottom);

    // B. Bisagra y Tapa Trasera (Izquierda)
    const leftHinge = new THREE.Group();
    leftHinge.position.set(-spineRadius * 0.85, 0, -spineRadius * 0.45);
    bookAssembly.add(leftHinge);

    // Tapa rígida izquierda
    const leftCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight + 0.06, coverThickness);
    leftCoverGeo.translate(-bookWidth / 2, 0, 0);
    const leftCover = new THREE.Mesh(leftCoverGeo, coverMaterial);
    leftHinge.add(leftCover);

    // Bloque fijo de páginas izquierdas (con volumen y cantos estriados)
    const leftBlockGeo = new THREE.BoxGeometry(bookWidth - 0.06, bookHeight - 0.08, pageBlockThickness);
    leftBlockGeo.translate(-(bookWidth - 0.06) / 2, 0, pageBlockThickness / 2 + coverThickness / 2);
    const leftPageBlock = new THREE.Mesh(leftBlockGeo, pageBlockMaterial);
    leftHinge.add(leftPageBlock);

    // C. Bisagra y Tapa Delantera (Derecha)
    const rightHinge = new THREE.Group();
    rightHinge.position.set(spineRadius * 0.85, 0, -spineRadius * 0.45);
    bookAssembly.add(rightHinge);

    // Tapa rígida derecha
    const rightCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight + 0.06, coverThickness);
    rightCoverGeo.translate(bookWidth / 2, 0, 0);
    const rightCover = new THREE.Mesh(rightCoverGeo, coverMaterial);
    rightHinge.add(rightCover);

    // Bloque fijo de páginas derechas
    const rightBlockGeo = new THREE.BoxGeometry(bookWidth - 0.06, bookHeight - 0.08, pageBlockThickness);
    rightBlockGeo.translate((bookWidth - 0.06) / 2, 0, -(pageBlockThickness / 2 + coverThickness / 2));
    const rightPageBlock = new THREE.Mesh(rightBlockGeo, pageBlockMaterial);
    rightHinge.add(rightPageBlock);

    // Ángulos de apertura de reposo editorial natural
    leftHinge.rotation.y = -0.38; // ~22° inclinada a la izquierda
    rightHinge.rotation.y = Math.PI - 0.38; // ~158° abierta hacia la derecha

    // D. Páginas Articuladas y Curvadas Dinámicas (3 Hojas con deformación senoidal)
    const numPages = 3;
    const pageWings = [];
    const pageWidth = bookWidth - 0.08;
    const pageHeight = bookHeight - 0.1;

    for (let i = 0; i < numPages; i++) {
      const pageHinge = new THREE.Group();
      // Ancladas exactamente al canal interior del lomo sin flotar
      pageHinge.position.set(0, 0, -spineRadius * 0.35 + 0.02 * (i - 1));
      bookAssembly.add(pageHinge);

      // Malla segmentada para permitir flexión en arco continuo
      const segmentsX = 22;
      const segmentsY = 6;
      const pagePlaneGeo = new THREE.PlaneGeometry(pageWidth, pageHeight, segmentsX, segmentsY);
      pagePlaneGeo.translate(pageWidth / 2, 0, 0);

      const originalPositions = pagePlaneGeo.attributes.position.array.slice();
      const pageMesh = new THREE.Mesh(pagePlaneGeo, dynamicPageMaterial);
      pageHinge.add(pageMesh);

      pageWings.push({
        hinge: pageHinge,
        mesh: pageMesh,
        geo: pagePlaneGeo,
        originalPositions,
        phaseOffset: (i * Math.PI * 2) / numPages,
        segmentsX
      });
    }

    // E. Cinta Marcapáginas integrada al lomo con caída fluida
    const ribbonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, bookHeight / 2 + 0.04, -spineRadius * 0.4),
      new THREE.Vector3(0.06, bookHeight / 2 + 0.1, -spineRadius * 0.1),
      new THREE.Vector3(0.12, 0.4, 0.12),
      new THREE.Vector3(0.18, -0.5, 0.18),
      new THREE.Vector3(0.24, -bookHeight / 2 - 0.28, 0.24),
      new THREE.Vector3(0.28, -bookHeight / 2 - 0.52, 0.28)
    ]);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 36, 0.022, 8, false);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMaterial);
    bookAssembly.add(ribbonMesh);

    // Dije geométrico en el extremo del marcapáginas (octaedro verde métrico)
    const charmGeo = new THREE.OctahedronGeometry(0.065, 0);
    const charmMesh = new THREE.Mesh(charmGeo, charmMaterial);
    charmMesh.position.copy(ribbonCurve.getPoint(1));
    bookAssembly.add(charmMesh);

    // F. Nube de Micro-partículas Flotantes Tenues
    const particleCount = 70;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cWhite = new THREE.Color(0xfcfbf9);
    const cOrange = new THREE.Color(0xee6018);
    const cGreen = new THREE.Color(0xa0ca92);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const r = 2.0 + Math.random() * 2.2;
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
      baseRotation
    };

    // 6. Bucle de Render y Animación Orgánica
    let clock = new THREE.Clock();
    let currentAnimSpeed = 1;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      currentAnimSpeed += (speedMultiplier - currentAnimSpeed) * 0.1;

      if (!isPaused && rootGroup) {
        const t = elapsedTime * currentAnimSpeed;

        // 1. Flotación senoidal distinguida
        bookAssembly.position.y = Math.sin(t * 1.4) * 0.06;

        // 2. Inclinación Parallax suave hacia la posición del cursor
        const { targetTilt } = objectsRef.current;
        rootGroup.rotation.x += (baseRotation.x + targetTilt.x - rootGroup.rotation.x) * 0.05;
        rootGroup.rotation.y += (baseRotation.y + targetTilt.y - rootGroup.rotation.y) * 0.05;

        // 3. Pasado de Páginas en Arco Natural con Flexión Dinámica
        pageWings.forEach((wing) => {
          const cycle = ((t * 0.55 + wing.phaseOffset) % (Math.PI * 2)) / (Math.PI * 2);
          // Curva de aceleración sinusoidal con desaceleración al aterrizar
          const eased = Math.sin(cycle * Math.PI - Math.PI / 2) * 0.5 + 0.5;

          // Recorrido angular de apertura de derecha a izquierda
          const minAngle = 0.16;
          const maxAngle = Math.PI - 0.28;
          const angle = minAngle + eased * (maxAngle - minAngle);
          wing.hinge.rotation.y = angle;

          // Flexión del papel: curvatura máxima en el cenit del arco
          const bendFactor = Math.sin(eased * Math.PI) * 0.38;
          const posAttr = wing.geo.attributes.position;
          const orig = wing.originalPositions;

          for (let p = 0; p < posAttr.count; p++) {
            const px = orig[p * 3];
            const u = px / pageWidth; // Normalizado de 0 (lomo) a 1 (borde)
            // Forma de arco suave: 0 en el lomo y flexión progresiva con descenso en la punta
            const zOffset = Math.sin(u * Math.PI * 0.95) * bendFactor;
            posAttr.setZ(p, zOffset);
          }
          posAttr.needsUpdate = true;
          wing.geo.computeVertexNormals();
        });

        // 4. Oscilación armónica del dije marcapáginas
        charmMesh.position.x = ribbonCurve.getPoint(1).x + Math.sin(t * 1.8) * 0.025;
        charmMesh.position.z = ribbonCurve.getPoint(1).z + Math.cos(t * 1.6) * 0.025;

        // 5. Giro suave de la nube de micro-partículas
        particleCloud.rotation.y += 0.07 * delta * currentAnimSpeed;
        particleCloud.rotation.x += 0.025 * delta * currentAnimSpeed;
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

    // 8. Limpieza de memoria WebGL
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      // Dispose de recursos
      spineGeo.dispose();
      bandGeo.dispose();
      leftCoverGeo.dispose();
      leftBlockGeo.dispose();
      rightCoverGeo.dispose();
      rightBlockGeo.dispose();
      ribbonGeo.dispose();
      charmGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      coverTex.dispose();
      pageTex.dispose();
      pageEdgeTex.dispose();
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
        objectsRef.current.targetTilt.x = ny * 0.18;
        objectsRef.current.targetTilt.y = nx * 0.28;
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

  // Control 3: Disparo de Pulso / Impulso Expresivo Elegante
  const triggerPulse = useCallback(() => {
    if (pulseActive || !objectsRef.current.rootGroup) return;
    setPulseActive(true);

    const { rootGroup, bookAssembly } = objectsRef.current;
    let progress = 0;
    const initialRotY = objectsRef.current.baseRotation.y;

    const pulseInterval = setInterval(() => {
      progress += 0.045;
      const peak = Math.sin(progress * Math.PI);

      // Elevación elástica suave
      const s = 1 + peak * 0.16;
      if (bookAssembly) {
        bookAssembly.scale.set(s, s, s);
        bookAssembly.position.y = peak * 0.28;
      }

      // Impulso armónico de giro completo
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

  // Control 4: Restablecer Vista Inicial Isométrica en 3/4
  const resetOrientation = useCallback(() => {
    if (objectsRef.current.rootGroup) {
      const defaultRot = { x: 0.44, y: -0.52, z: 0.1 };
      objectsRef.current.baseRotation = { ...defaultRot };
      objectsRef.current.targetTilt = { x: 0, y: 0 };
      objectsRef.current.rootGroup.rotation.set(defaultRot.x, defaultRot.y, defaultRot.z);
      if (objectsRef.current.bookAssembly) {
        objectsRef.current.bookAssembly.scale.set(1, 1, 1);
        objectsRef.current.bookAssembly.position.set(0, 0, 0);
      }
    }
  }, []);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      
      {/* Encabezado Superior Limpio */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 text-[10px] font-mono text-[#4d4947] border-b border-[#3d3a39]/20">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ee6018] animate-pulse"></span>
          <span className="uppercase tracking-wider font-medium text-[#101010]">
            BIBLIOTECA VIRTUAL // LIBRO 3D EDITORIAL
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
            title="Alternar entre vista sólida editorial y estructura técnica alámbrica"
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
            title="Restablecer posición y encuadre inicial en 3/4"
          >
            <RefreshCw size={10} />
          </button>
        </div>

      </div>

    </div>
  );
}
