import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ArchitecturalCanvasProps {
  progress: number; // 0 to 1 scroll progress of Act 1
  phaseIndex: number;
}

export const ArchitecturalCanvas: React.FC<ArchitecturalCanvasProps> = ({ progress }) => {
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
    scene.fog = new THREE.FogExp2(0x0b0b0b, 0.035);
    sceneRef.current = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 8, 18);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xf1eee7, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xe89d42, 1.8);
    sunLight.position.set(12, 18, 10);
    scene.add(sunLight);

    const warmFill = new THREE.PointLight(0xd4af37, 2, 25);
    warmFill.position.set(0, 3, 2);
    scene.add(warmFill);

    // --- 1. Terrain Grid & Plot Boundary (Stages 01 - 03) ---
    const grid = new THREE.GridHelper(30, 30, 0x48cae4, 0x222222);
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
    const boundaryMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, linewidth: 2 });
    const boundaryLine = new THREE.LineLoop(boundaryGeo, boundaryMat);
    scene.add(boundaryLine);
    plotBoundaryRef.current = boundaryLine;

    // --- 2. Miniature City (Stage 05 Property Discovery) ---
    const cityGroup = new THREE.Group();
    const cityMat = new THREE.MeshStandardMaterial({
      color: 0x161616,
      roughness: 0.9,
      metalness: 0.1,
    });
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xe89d42 });

    for (let x = -8; x <= 8; x += 1.8) {
      for (let z = -8; z <= 8; z += 1.8) {
        if (Math.abs(x) < 2 && Math.abs(z) < 2) continue; // center opening
        const bHeight = 0.5 + Math.random() * 2.5;
        const bGeo = new THREE.BoxGeometry(1.2, bHeight, 1.2);
        const building = new THREE.Mesh(bGeo, cityMat);
        building.position.set(x + (Math.random() - 0.5) * 0.4, bHeight / 2, z + (Math.random() - 0.5) * 0.4);
        cityGroup.add(building);

        // Occasional warm beacon light
        if (Math.random() > 0.75) {
          const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), beaconMat);
          beacon.position.set(building.position.x, bHeight + 0.1, building.position.z);
          cityGroup.add(beacon);
        }
      }
    }
    cityGroup.position.set(0, -10, 0); // hidden initially
    scene.add(cityGroup);
    cityGroupRef.current = cityGroup;

    // --- 3. Ghost Wireframe Villa (Stage 06 & Blueprint 3D 09) ---
    const wireframeGroup = new THREE.Group();
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x48cae4,
      transparent: true,
      opacity: 0.8,
    });

    const createBoxWireframe = (w: number, h: number, d: number, px: number, py: number, pz: number) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const wireGeo = new THREE.WireframeGeometry(geo);
      const line = new THREE.LineSegments(wireGeo, wireMat);
      line.position.set(px, py + h / 2, pz);
      return line;
    };

    // Ground floor volume
    wireframeGroup.add(createBoxWireframe(6, 2, 4.5, 0, 0, 0));
    // First floor cantilevered volume
    wireframeGroup.add(createBoxWireframe(5.2, 2, 3.8, 0.4, 2, -0.3));
    // Terrace / upper roof
    wireframeGroup.add(createBoxWireframe(3.5, 1.6, 2.5, -0.8, 4, 0.2));

    wireframeGroup.position.set(0, 0, 0);
    wireframeGroup.visible = false;
    scene.add(wireframeGroup);
    wireframeHouseRef.current = wireframeGroup;

    // --- 4. Structural Columns & Slabs (Stages 11 - 14) ---
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

    colPositions.forEach(([cx, cz]) => {
      // Column mesh with height = 5.6m
      const colGeo = new THREE.CylinderGeometry(0.18, 0.18, 5.6, 8);
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(cx, 2.8, cz);
      col.castShadow = true;
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

    // Ground slab
    const gSlab = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.25, 4.8), slabMat);
    gSlab.position.set(0, 0.125, 0);
    slabsGroup.add(gSlab);

    // L1 slab
    const l1Slab = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.25, 4.6), slabMat);
    l1Slab.position.set(0, 2.1, 0);
    slabsGroup.add(l1Slab);

    // L2 roof slab
    const l2Slab = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.25, 4.2), slabMat);
    l2Slab.position.set(0, 4.2, 0);
    slabsGroup.add(l2Slab);

    slabsGroup.visible = false;
    scene.add(slabsGroup);
    slabsGroupRef.current = slabsGroup;

    // --- 5. Dust Particle System (Stage 17) ---
    const dustCount = 1200;
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
      size: 0.06,
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

      // Gentle ambient drift
      if (dustParticlesRef.current && dustParticlesRef.current.visible) {
        dustParticlesRef.current.rotation.y += 0.001;
      }
      if (wireframeHouseRef.current && wireframeHouseRef.current.visible) {
        wireframeHouseRef.current.rotation.y = Math.sin(Date.now() * 0.0005) * 0.03;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // --- Dynamic Deterministic Scroll Scrubbing ---
  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    // 0.0 - 0.14: Land & Land Analysis
    if (progress < 0.14) {
      const p = progress / 0.14;
      camera.position.set(0, 8 - p * 3, 18 - p * 4);
      camera.lookAt(0, 0.5, 0);

      if (terrainGridRef.current) terrainGridRef.current.visible = true;
      if (plotBoundaryRef.current) {
        plotBoundaryRef.current.visible = true;
        plotBoundaryRef.current.scale.set(Math.min(p * 1.5, 1), 1, Math.min(p * 1.5, 1));
      }
      if (cityGroupRef.current) cityGroupRef.current.visible = false;
      if (wireframeHouseRef.current) wireframeHouseRef.current.visible = false;
      if (columnsGroupRef.current) columnsGroupRef.current.visible = false;
      if (slabsGroupRef.current) slabsGroupRef.current.visible = false;
    }
    // 0.14 - 0.28: Brief & Discovery City
    else if (progress < 0.28) {
      const p = (progress - 0.14) / 0.14;
      if (cityGroupRef.current) {
        cityGroupRef.current.visible = true;
        cityGroupRef.current.position.y = -10 + p * 10;
        cityGroupRef.current.rotation.y = p * 0.6;
      }
      camera.position.set(Math.sin(p * 1.5) * 10, 10 - p * 2, Math.cos(p * 1.5) * 12);
      camera.lookAt(0, 1, 0);

      if (terrainGridRef.current) terrainGridRef.current.visible = false;
      if (plotBoundaryRef.current) plotBoundaryRef.current.visible = false;
      if (wireframeHouseRef.current) wireframeHouseRef.current.visible = false;
    }
    // 0.28 - 0.42: Site Visit & Ghost Model
    else if (progress < 0.42) {
      const p = (progress - 0.28) / 0.14;
      if (cityGroupRef.current) cityGroupRef.current.visible = false;
      if (terrainGridRef.current) terrainGridRef.current.visible = true;
      if (plotBoundaryRef.current) plotBoundaryRef.current.visible = true;

      if (wireframeHouseRef.current) {
        wireframeHouseRef.current.visible = true;
        wireframeHouseRef.current.scale.set(1, Math.min(p * 1.2, 1), 1);
      }

      camera.position.set(6 - p * 4, 5 + p * 2, 12 - p * 2);
      camera.lookAt(0, 1.5, 0);
    }
    // 0.42 - 0.58: Blueprint to Structure Rise
    else if (progress < 0.58) {
      const p = (progress - 0.42) / 0.16;
      if (wireframeHouseRef.current) wireframeHouseRef.current.visible = p < 0.4;

      if (columnsGroupRef.current) {
        columnsGroupRef.current.visible = true;
        // Columns grow in height with scroll
        const colScaleY = Math.min(p * 1.6, 1);
        columnsGroupRef.current.scale.set(1, colScaleY, 1);
        columnsGroupRef.current.position.y = (colScaleY - 1) * 2.8;
      }

      if (slabsGroupRef.current) {
        slabsGroupRef.current.visible = true;
        slabsGroupRef.current.children.forEach((slab, idx) => {
          slab.visible = p > idx * 0.3;
        });
      }

      // Camera rotates around rising structure
      camera.position.set(Math.cos(p * Math.PI) * 12, 6 + p * 3, Math.sin(p * Math.PI) * 12);
      camera.lookAt(0, 2.5, 0);
    }
    // 0.58 - 0.72: Structure Complete & Exterior
    else if (progress < 0.72) {
      const p = (progress - 0.58) / 0.14;
      if (columnsGroupRef.current) columnsGroupRef.current.visible = true;
      if (slabsGroupRef.current) {
        slabsGroupRef.current.visible = true;
        slabsGroupRef.current.children.forEach((slab) => (slab.visible = true));
      }
      camera.position.set(10 - p * 6, 5 - p * 2, 10 - p * 6);
      camera.lookAt(0, 2, 0);
    }
    // 0.72 - 0.88: Interior & Dust Storm Transition
    else if (progress < 0.88) {
      const p = (progress - 0.72) / 0.16;
      // Camera is inside the room
      camera.position.set(0, 1.6, 3 - p * 2);
      camera.lookAt(0, 1.6, -6);

      if (dustParticlesRef.current) {
        dustParticlesRef.current.visible = true;
        // Bell-curve opacity for dust storm: peaks at p = 0.5
        const dustOpacity = Math.sin(p * Math.PI) * 0.85;
        (dustParticlesRef.current.material as THREE.PointsMaterial).opacity = dustOpacity;
      }
    }
    // 0.88 - 1.00: Final Reveal & Golden Hour
    else {
      const p = (progress - 0.88) / 0.12;
      if (dustParticlesRef.current) dustParticlesRef.current.visible = false;
      camera.position.set(8 + p * 4, 4 + p * 3, 14 + p * 4);
      camera.lookAt(0, 2, 0);
    }
  }, [progress]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
