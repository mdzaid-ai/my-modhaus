import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PerformanceConfig } from '../utils/performance';

interface ArchitecturalCanvasProps {
  progress: number; // 0 to 1 scroll progress of Act 1
  phaseIndex: number;
  perfConfig: PerformanceConfig;
}

export const ArchitecturalCanvas: React.FC<ArchitecturalCanvasProps> = ({ progress, perfConfig }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // 3D Objects references
  const wireframeHouseRef = useRef<THREE.Group | null>(null);
  const columnsGroupRef = useRef<THREE.Group | null>(null);
  const slabsGroupRef = useRef<THREE.Group | null>(null);
  const cityGroupRef = useRef<THREE.Group | null>(null);
  const dustParticlesRef = useRef<THREE.Points | null>(null);
  const terrainGridRef = useRef<THREE.GridHelper | null>(null);
  const plotBoundaryRef = useRef<THREE.LineLoop | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b0b, 0.032);
    sceneRef.current = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Mobile portrait camera framing adjustment
    const fov = perfConfig.isMobile ? 54 : 42;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);
    camera.position.set(0, 7.5, perfConfig.isMobile ? 20 : 17);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // Renderer setup with strictly capped DPR and power preference
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !perfConfig.isMobile && perfConfig.tier !== 'lightweight',
      powerPreference: 'high-performance',
      precision: perfConfig.isMobile ? 'mediump' : 'highp',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(perfConfig.dpr);
    renderer.shadowMap.enabled = perfConfig.enableShadows;
    if (perfConfig.enableShadows) {
      renderer.shadowMap.type = THREE.BasicShadowMap; // lighter than PCFSoft
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // Context loss handler
    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xf1eee7, perfConfig.isMobile ? 0.8 : 0.55);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xe89d42, 1.5);
    sunLight.position.set(12, 18, 10);
    scene.add(sunLight);

    if (!perfConfig.isMobile) {
      const warmFill = new THREE.PointLight(0xd4af37, 1.6, 20);
      warmFill.position.set(0, 3, 2);
      scene.add(warmFill);
    }

    // --- 1. Terrain Grid & Plot Boundary ---
    const gridDivisions = perfConfig.isMobile ? 16 : 28;
    const grid = new THREE.GridHelper(30, gridDivisions, 0x48cae4, 0x1f1f1f);
    grid.position.y = -0.01;
    scene.add(grid);
    terrainGridRef.current = grid;

    // Plot Boundary (60ft x 40ft scaled)
    const boundaryGeo = new THREE.BufferGeometry();
    const halfW = 4.5;
    const halfD = 3.2;
    const boundaryPts = [
      new THREE.Vector3(-halfW, 0.02, -halfD),
      new THREE.Vector3(halfW, 0.02, -halfD),
      new THREE.Vector3(halfW, 0.02, halfD),
      new THREE.Vector3(-halfW, 0.02, halfD),
    ];
    boundaryGeo.setFromPoints(boundaryPts);
    const boundaryMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, linewidth: 1.5 });
    const boundaryLine = new THREE.LineLoop(boundaryGeo, boundaryMat);
    scene.add(boundaryLine);
    plotBoundaryRef.current = boundaryLine;

    // --- 2. Miniature City (Optimized count for mobile) ---
    const cityGroup = new THREE.Group();
    const cityMat = new THREE.MeshStandardMaterial({
      color: 0x161616,
      roughness: 0.9,
    });
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xe89d42 });

    const step = perfConfig.isMobile ? 2.8 : 1.8;
    for (let x = -7; x <= 7; x += step) {
      for (let z = -7; z <= 7; z += step) {
        if (Math.abs(x) < 2 && Math.abs(z) < 2) continue;
        const bHeight = 0.5 + Math.random() * 2.2;
        const bGeo = new THREE.BoxGeometry(1.2, bHeight, 1.2);
        const building = new THREE.Mesh(bGeo, cityMat);
        building.position.set(x + (Math.random() - 0.5) * 0.3, bHeight / 2, z + (Math.random() - 0.5) * 0.3);
        cityGroup.add(building);

        if (Math.random() > 0.7) {
          const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), beaconMat);
          beacon.position.set(building.position.x, bHeight + 0.1, building.position.z);
          cityGroup.add(beacon);
        }
      }
    }
    cityGroup.position.set(0, -10, 0);
    scene.add(cityGroup);
    cityGroupRef.current = cityGroup;

    // --- 3. Ghost Wireframe Villa ---
    const wireframeGroup = new THREE.Group();
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x48cae4,
      transparent: true,
      opacity: 0.85,
    });

    const createBoxWireframe = (w: number, h: number, d: number, px: number, py: number, pz: number) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const wireGeo = new THREE.WireframeGeometry(geo);
      const line = new THREE.LineSegments(wireGeo, wireMat);
      line.position.set(px, py + h / 2, pz);
      return line;
    };

    wireframeGroup.add(createBoxWireframe(6, 2, 4.5, 0, 0, 0));
    wireframeGroup.add(createBoxWireframe(5.2, 2, 3.8, 0.4, 2, -0.3));
    wireframeGroup.add(createBoxWireframe(3.5, 1.6, 2.5, -0.8, 4, 0.2));

    wireframeGroup.position.set(0, 0, 0);
    wireframeGroup.visible = false;
    scene.add(wireframeGroup);
    wireframeHouseRef.current = wireframeGroup;

    // --- 4. Structural Columns & Slabs ---
    const columnsGroup = new THREE.Group();
    const colMat = new THREE.MeshStandardMaterial({
      color: 0x888580,
      roughness: 0.85,
    });

    const colPositions = [
      [-2.8, -2], [0, -2], [2.8, -2],
      [-2.8, 0],  [0, 0],  [2.8, 0],
      [-2.8, 2],  [0, 2],  [2.8, 2],
    ];

    const radialSegments = perfConfig.isMobile ? 6 : 8;
    colPositions.forEach(([cx, cz]) => {
      const colGeo = new THREE.CylinderGeometry(0.18, 0.18, 5.6, radialSegments);
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(cx, 2.8, cz);
      columnsGroup.add(col);
    });

    columnsGroup.visible = false;
    scene.add(columnsGroup);
    columnsGroupRef.current = columnsGroup;

    // Structural floor slabs
    const slabsGroup = new THREE.Group();
    const slabMat = new THREE.MeshStandardMaterial({
      color: 0x77746f,
      roughness: 0.9,
    });

    const gSlab = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.25, 4.8), slabMat);
    gSlab.position.set(0, 0.125, 0);
    slabsGroup.add(gSlab);

    const l1Slab = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.25, 4.6), slabMat);
    l1Slab.position.set(0, 2.1, 0);
    slabsGroup.add(l1Slab);

    const l2Slab = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.25, 4.2), slabMat);
    l2Slab.position.set(0, 4.2, 0);
    slabsGroup.add(l2Slab);

    slabsGroup.visible = false;
    scene.add(slabsGroup);
    slabsGroupRef.current = slabsGroup;

    // --- 5. Dust Particle System (Adaptive count) ---
    const dustCount = perfConfig.particleCount;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 12;
      dustPositions[i + 1] = Math.random() * 6;
      dustPositions[i + 2] = (Math.random() - 0.5) * 12;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xe89d42,
      size: perfConfig.isMobile ? 0.08 : 0.05,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);
    dustParticlesRef.current = dustParticles;

    // --- Animation loop ---
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!perfConfig.prefersReducedMotion) {
        if (dustParticlesRef.current && dustParticlesRef.current.visible) {
          dustParticlesRef.current.rotation.y += 0.0006;
        }
        if (wireframeHouseRef.current && wireframeHouseRef.current.visible) {
          wireframeHouseRef.current.rotation.y = Math.sin(Date.now() * 0.0002) * 0.012;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.fov = window.innerWidth < 768 ? 54 : 42;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Dispose materials & geometries
      boundaryGeo.dispose();
      boundaryMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      colMat.dispose();
      slabMat.dispose();
      cityMat.dispose();
      beaconMat.dispose();
    };
  }, [perfConfig.tier, perfConfig.dpr, perfConfig.isMobile]);

  // --- Dynamic Deterministic Scroll Scrubbing ---
  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    const zOffset = perfConfig.isMobile ? 3.0 : 0.0;

    // 0.00 - 0.18: HERO LAND
    if (progress < 0.18) {
      const p = progress / 0.18;
      camera.position.set(0, 7.5 - p * 0.8, 17 + zOffset - p * 1.2);
      camera.lookAt(0, 0.5, 0);

      if (terrainGridRef.current) terrainGridRef.current.visible = true;
      if (plotBoundaryRef.current) {
        plotBoundaryRef.current.visible = true;
        plotBoundaryRef.current.scale.set(Math.min(p * 0.8, 1), 1, Math.min(p * 0.8, 1));
      }
      if (cityGroupRef.current) cityGroupRef.current.visible = false;
      if (wireframeHouseRef.current) wireframeHouseRef.current.visible = false;
      if (columnsGroupRef.current) columnsGroupRef.current.visible = false;
      if (slabsGroupRef.current) slabsGroupRef.current.visible = false;
    }
    // 0.18 - 0.34: LAND ANALYSIS & DECISION
    else if (progress < 0.34) {
      const p = (progress - 0.18) / 0.16;
      camera.position.set(0, 6.7 - p * 1.8, 15.8 + zOffset - p * 2.8);
      camera.lookAt(0, 0.4, 0);

      if (terrainGridRef.current) terrainGridRef.current.visible = true;
      if (plotBoundaryRef.current) {
        plotBoundaryRef.current.visible = true;
        plotBoundaryRef.current.scale.set(1, 1, 1);
      }
      if (cityGroupRef.current) cityGroupRef.current.visible = false;
      if (wireframeHouseRef.current) wireframeHouseRef.current.visible = false;
    }
    // 0.34 - 0.46: CLIENT BRIEF & DISCOVERY CITY
    else if (progress < 0.46) {
      const p = (progress - 0.34) / 0.12;
      if (cityGroupRef.current) {
        cityGroupRef.current.visible = true;
        cityGroupRef.current.position.y = -10 + p * 10;
        cityGroupRef.current.rotation.y = p * 0.45;
      }
      camera.position.set(Math.sin(p * 0.8) * 8, 9 - p * 1.5, Math.cos(p * 0.8) * 12 + zOffset);
      camera.lookAt(0, 1, 0);

      if (terrainGridRef.current) terrainGridRef.current.visible = false;
      if (plotBoundaryRef.current) plotBoundaryRef.current.visible = false;
      if (wireframeHouseRef.current) wireframeHouseRef.current.visible = false;
    }
    // 0.46 - 0.58: SITE VISIT & GHOST MODEL
    else if (progress < 0.58) {
      const p = (progress - 0.46) / 0.12;
      if (cityGroupRef.current) cityGroupRef.current.visible = false;
      if (terrainGridRef.current) terrainGridRef.current.visible = true;
      if (plotBoundaryRef.current) plotBoundaryRef.current.visible = true;

      if (wireframeHouseRef.current) {
        wireframeHouseRef.current.visible = true;
        wireframeHouseRef.current.scale.set(1, Math.min(p * 1.2, 1), 1);
      }

      camera.position.set(5.5 - p * 2.5, 5 + p * 1.5, 12.5 + zOffset - p * 1.5);
      camera.lookAt(0, 1.4, 0);
    }
    // 0.58 - 0.74: BLUEPRINT & 3D EXTRUSION
    else if (progress < 0.74) {
      const p = (progress - 0.58) / 0.16;
      if (wireframeHouseRef.current) wireframeHouseRef.current.visible = p < 0.35;

      if (columnsGroupRef.current) {
        columnsGroupRef.current.visible = true;
        const colScaleY = Math.min(p * 1.5, 1);
        columnsGroupRef.current.scale.set(1, colScaleY, 1);
        columnsGroupRef.current.position.y = (colScaleY - 1) * 2.8;
      }

      if (slabsGroupRef.current) {
        slabsGroupRef.current.visible = true;
        slabsGroupRef.current.children.forEach((slab, idx) => {
          slab.visible = p > idx * 0.3;
        });
      }

      camera.position.set(Math.cos(p * Math.PI) * 11, 6 + p * 2.5, Math.sin(p * Math.PI) * 11 + zOffset);
      camera.lookAt(0, 2.3, 0);
    }
    // 0.74 - 0.81: EXCAVATION & FOUNDATION
    else if (progress < 0.81) {
      const p = (progress - 0.74) / 0.07;
      if (columnsGroupRef.current) columnsGroupRef.current.visible = true;
      if (slabsGroupRef.current) slabsGroupRef.current.visible = true;
      camera.position.set(8.5 - p * 3, 5.5, 10.5 + zOffset - p * 2);
      camera.lookAt(0, 1.8, 0);
    }
    // 0.81 - 0.87: SUPERSTRUCTURE STANDS
    else if (progress < 0.87) {
      const p = (progress - 0.81) / 0.06;
      if (columnsGroupRef.current) columnsGroupRef.current.visible = true;
      if (slabsGroupRef.current) {
        slabsGroupRef.current.visible = true;
        slabsGroupRef.current.children.forEach((slab) => (slab.visible = true));
      }
      camera.position.set(9 - p * 4, 5 - p * 1.5, 9.5 + zOffset - p * 3);
      camera.lookAt(0, 2, 0);
    }
    // 0.87 - 0.94: INTERIOR & DUST STORM
    else if (progress < 0.94) {
      const p = (progress - 0.87) / 0.07;
      camera.position.set(0, 1.6, 2.8 - p * 1.8);
      camera.lookAt(0, 1.6, -6);

      if (dustParticlesRef.current) {
        dustParticlesRef.current.visible = true;
        const dustOpacity = Math.sin(p * Math.PI) * 0.85;
        (dustParticlesRef.current.material as THREE.PointsMaterial).opacity = dustOpacity;
      }
    }
    // 0.94 - 1.00: FINAL REVEAL & GOLDEN HOUR
    else {
      const p = (progress - 0.94) / 0.06;
      if (dustParticlesRef.current) dustParticlesRef.current.visible = false;
      camera.position.set(8 + p * 3, 4 + p * 2, 13 + zOffset + p * 3);
      camera.lookAt(0, 2, 0);
    }
  }, [progress, perfConfig.isMobile]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={perfConfig.isMobile ? undefined : { mixBlendMode: 'screen' }}
    />
  );
};
