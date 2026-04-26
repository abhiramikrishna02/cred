import { useEffect, useRef, Suspense, useState, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import {
  Float, Environment, Stars, MeshDistortMaterial,
  Sphere, Trail, PerspectiveCamera,
  MeshReflectorMaterial, Torus, Box, Plane,
  Html, Sparkles, Text3D, Center, useTexture
} from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

// ═══════════════════════════════════════════════════════
// SCROLL-DRIVEN 3D CAMERA
// ═══════════════════════════════════════════════════════
function ScrollCamera({ scrollProgress }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 8));
  const currentPos = useRef(new THREE.Vector3(0, 0, 8));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const p = scrollProgress.current;
    if (p < 0.2) {
      const t = p / 0.2;
      targetPos.current.set(0, 0, 8 - t * 4);
      targetLook.current.set(0, 0, 0);
    } else if (p < 0.45) {
      const t = (p - 0.2) / 0.25;
      targetPos.current.set(Math.sin(t * Math.PI * 2) * 5, Math.cos(t * Math.PI) * 2, 4 - t * 2);
      targetLook.current.set(0, 0, 0);
    } else if (p < 0.7) {
      const t = (p - 0.45) / 0.25;
      targetPos.current.set(0, 4 - t * 8, 2 + t * 3);
      targetLook.current.set(0, t * -2, 0);
    } else {
      const t = (p - 0.7) / 0.3;
      targetPos.current.set(Math.sin(t * Math.PI) * 3, -4 + t * 4, 5);
      targetLook.current.set(0, 0, 0);
    }
    currentPos.current.lerp(targetPos.current, delta * 1.8);
    camera.position.copy(currentPos.current);
    camera.lookAt(targetLook.current);
  });
  return null;
}

// ═══════════════════════════════════════════════════════
// SCROLL-REACTIVE GALAXY
// ═══════════════════════════════════════════════════════
function ScrollGalaxy({ scrollProgress }) {
  const ref = useRef();
  const count = 1400;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0.133, 0.773, 0.369], // green
      [0.024, 0.714, 0.831], // cyan
      [0.655, 0.545, 0.980], // purple
      [1, 1, 1],
    ];
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 12 + 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.3;
      const arm = Math.floor(Math.random() * 3);
      const armAngle = (arm / 3) * Math.PI * 2;
      const spiralAngle = armAngle + r * 0.25 + Math.random() * 0.5;
      pos[i * 3] = Math.cos(spiralAngle) * r + (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 1] = Math.sin(phi) * r * 0.15 + (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = Math.sin(spiralAngle) * r + (Math.random() - 0.5) * 1.5;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const p = scrollProgress.current;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04 + p * Math.PI;
    ref.current.rotation.x = p * 0.5;
    ref.current.material.size = 0.025 + p * 0.04;
    ref.current.material.opacity = 0.6 + p * 0.4;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ═══════════════════════════════════════════════════════
// SCROLL-REACTIVE MORPHING SPHERE
// ═══════════════════════════════════════════════════════
function MorphSphere({ scrollProgress }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    const p = scrollProgress.current;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15 + p * 2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.22 + p * 3;
    meshRef.current.material.distort = 0.3 + p * 0.7;
    meshRef.current.material.speed = 1 + p * 4;
    const scale = 1 + Math.sin(p * Math.PI) * 0.5;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <MeshDistortMaterial
        color="#22c55e"
        distort={0.3}
        speed={2}
        metalness={1}
        roughness={0}
        transparent
        opacity={0.85}
        envMapIntensity={3}
      />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════
// SCROLL-REACTIVE RING SYSTEM
// ═══════════════════════════════════════════════════════
function ScrollRings({ scrollProgress }) {
  const rings = useRef([]);
  const configs = useMemo(() => [
    { r: 2.5, tube: 0.015, color: '#22c55e', speed: 0.5, tilt: 0 },
    { r: 3.2, tube: 0.010, color: '#06b6d4', speed: -0.3, tilt: Math.PI / 3 },
    { r: 4.0, tube: 0.008, color: '#a78bfa', speed: 0.7, tilt: Math.PI / 6 },
    { r: 1.8, tube: 0.012, color: '#f59e0b', speed: -0.9, tilt: Math.PI / 2 },
    { r: 4.8, tube: 0.006, color: '#f43f5e', speed: 0.4, tilt: Math.PI / 4 },
  ], []);

  useFrame((state) => {
    const p = scrollProgress.current;
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const c = configs[i];
      ring.rotation.z = state.clock.elapsedTime * c.speed;
      ring.rotation.x = c.tilt + p * Math.PI * 0.5;
      ring.rotation.y = p * Math.PI;
      ring.material.opacity = 0.2 + p * 0.6;
      ring.material.emissiveIntensity = 1 + p * 4;
    });
  });

  return (
    <group>
      {configs.map((c, i) => (
        <mesh key={i} ref={el => rings.current[i] = el} rotation={[c.tilt, 0, 0]}>
      <torusGeometry args={[c.r, c.tube, 6, 128]} />
          <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={1} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════
// FLOATING PARTICLES
// ═══════════════════════════════════════════════════════
function FloatingParticles({ count = 200 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#22c55e" transparent opacity={0.36} sizeAttenuation />
    </points>
  );
}

// ═══════════════════════════════════════════════════════
// DNA HELIX (enhanced)
// ═══════════════════════════════════════════════════════
function DNAHelix({ scrollProgress }) {
  const group = useRef();
  const count = 60;
  const pts = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 10;
      const y = (i / count) * 14 - 7;
      arr.push({
        a: [Math.cos(t) * 1.6, y, Math.sin(t) * 1.6],
        b: [Math.cos(t + Math.PI) * 1.6, y, Math.sin(t + Math.PI) * 1.6],
        connector: i % 4 === 0,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const p = scrollProgress ? scrollProgress.current : 0;
    group.current.rotation.y = state.clock.elapsedTime * 0.3 + p * Math.PI;
    group.current.position.y = -p * 3;
  });

  return (
    <group ref={group}>
      {pts.map((p, i) => (
        <group key={i}>
          <mesh position={p.a}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={3} />
          </mesh>
          <mesh position={p.b}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={3} />
          </mesh>
          {p.connector && (
            <mesh position={[(p.a[0] + p.b[0]) / 2, p.a[1], (p.a[2] + p.b[2]) / 2]}>
              <boxGeometry args={[3.2, 0.025, 0.025]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// Warp tunnel
function WarpTunnel({ scrollProgress }) {
  const group = useRef();
  const rings = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    z: -i * 1.8,
    r: 2.5 + Math.sin(i * 0.7) * 0.5,
    color: i % 3 === 0 ? '#22c55e' : i % 3 === 1 ? '#06b6d4' : '#a78bfa',
    opacity: Math.max(0.04, 0.35 - i * 0.01),
  })), []);

  useFrame((state) => {
    if (!group.current) return;
    const p = scrollProgress ? scrollProgress.current : 0;
    group.current.position.z = (state.clock.elapsedTime * 1.5) % 1.8;
    group.current.rotation.z = state.clock.elapsedTime * 0.06 + p * 2;
    group.current.scale.setScalar(1 + p * 0.3);
  });

  return (
    <group ref={group}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[0, 0, i * 0.15]}>
          <torusGeometry args={[ring.r, 0.018, 8, 140]} />
          <meshBasicMaterial color={ring.color} transparent opacity={ring.opacity} />
        </mesh>
      ))}
    </group>
  );
}

// Warp grid
function WarpGrid({ scrollProgress }) {
  const ref = useRef();
  const count = 32;
  useFrame((state) => {
    if (!ref.current) return;
    const p = scrollProgress ? scrollProgress.current : 0;
    ref.current.rotation.x = -Math.PI / 2.5 + p * 0.3;
    ref.current.position.z = ((state.clock.elapsedTime * 0.7) % 1) * 2;
    ref.current.position.y = -3 + p * 1.5;
    ref.current.children.forEach((child) => {
      if (child.material) child.material.opacity = 0.08 + p * 0.25;
    });
  });

  const lines = useMemo(() => {
    const l = [];
    for (let i = 0; i <= count; i++) {
      const x = (i / count) * 40 - 20;
      l.push(<mesh key={`v${i}`} position={[x, 0, 0]}><boxGeometry args={[0.008, 0, 40]} /><meshBasicMaterial color="#22c55e" transparent opacity={0.08} /></mesh>);
    }
    for (let i = 0; i <= count; i++) {
      const z = (i / count) * 40 - 20;
      l.push(<mesh key={`h${i}`} position={[0, 0, z]}><boxGeometry args={[40, 0, 0.008]} /><meshBasicMaterial color="#22c55e" transparent opacity={0.08} /></mesh>);
    }
    return l;
  }, []);

  return <group ref={ref} position={[0, -3, 0]}>{lines}</group>;
}

// Comets
function Comets({ count = 14, scrollProgress }) {
  const group = useRef();
  const comets = useMemo(() => Array.from({ length: count }, (_, i) => ({
    start: new THREE.Vector3((Math.random() - 0.5) * 24, (Math.random() - 0.5) * 14, -5),
    dir: new THREE.Vector3((Math.random() - 0.5) * 0.04, -(0.025 + Math.random() * 0.05), 0),
    color: ['#22c55e', '#06b6d4', '#a78bfa'][i % 3],
    speed: 0.4 + Math.random() * 0.9,
    delay: Math.random() * 8,
    length: 0.6 + Math.random() * 1.4,
  })), [count]);

  useFrame((state) => {
    if (!group.current) return;
    const p = scrollProgress ? scrollProgress.current : 0;
    group.current.children.forEach((child, i) => {
      const c = comets[i];
      const t = ((state.clock.elapsedTime * c.speed + c.delay) % 10);
      child.position.set(c.start.x + c.dir.x * t * 80, c.start.y + c.dir.y * t * 80, c.start.z);
      child.material.opacity = 0.4 + p * 0.5;
    });
  });

  return (
    <group ref={group}>
      {comets.map((c, i) => (
        <mesh key={i} position={c.start.toArray()}>
          <boxGeometry args={[c.length, 0.005, 0.005]} />
          <meshBasicMaterial color={c.color} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Floating orbs
function OrbCluster({ count = 16, scrollProgress }) {
  const group = useRef();
  const orbs = useMemo(() => Array.from({ length: count }, (_, i) => ({
    pos: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6],
    scale: 0.05 + Math.random() * 0.16,
    color: ['#22c55e', '#06b6d4', '#a78bfa', '#f59e0b', '#f43f5e'][Math.floor(Math.random() * 5)],
    speed: 0.25 + Math.random() * 0.9,
    offset: Math.random() * Math.PI * 2,
  })), [count]);

  useFrame((state) => {
    if (!group.current) return;
    const p = scrollProgress ? scrollProgress.current : 0;
    group.current.children.forEach((child, i) => {
      const orb = orbs[i];
      child.position.y = orb.pos[1] + Math.sin(state.clock.elapsedTime * orb.speed + orb.offset) * 0.6;
      child.position.x = orb.pos[0] + Math.cos(state.clock.elapsedTime * orb.speed * 0.5 + orb.offset) * 0.35;
      child.material.emissiveIntensity = 1.5 + p * 3 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.5;
    });
  });

  return (
    <group ref={group}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.pos} scale={orb.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={orb.color} emissive={orb.color} emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════
// HERO 3D SCENE (main scroll-reactive canvas)
// ═══════════════════════════════════════════════════════
function CrystalModel() {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, '/abstract_crystal.glb');

  const crystal = useMemo(() => {
    const root = gltf.scene.clone(true);

    root.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      child.castShadow = true;
      child.receiveShadow = true;

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material && 'metalness' in material) material.metalness = 0.9;
        if (material && 'roughness' in material) material.roughness = 0.08;
        if (material && 'envMapIntensity' in material) material.envMapIntensity = 2.4;
        if (material) material.needsUpdate = true;
      });
    });

    const box = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    root.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    root.scale.setScalar(2.8 / maxDim);

    return root;
  }, [gltf]);

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.35;
    group.current.rotation.x = Math.sin(t * 0.6) * 0.08;
    group.current.rotation.z = Math.sin(t * 0.35) * 0.03;
  });

  return (
    <group ref={group} position={[2.35, -0.45, 0.35]}>
      <primitive object={crystal} dispose={null} />
    </group>
  );
}

function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 7], fov: 50 }}
    >
      <color attach="background" args={['#040404']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[6, 8, 10]} color="#ffffff" intensity={2.8} />
      <directionalLight position={[-6, -3, 6]} color="#22c55e" intensity={1.1} />
      <pointLight position={[0, 2, 5]} color="#06b6d4" intensity={1.4} />
      <pointLight position={[0, -2, 4]} color="#a78bfa" intensity={0.7} />
      <Suspense fallback={null}>
        <CrystalModel />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

// ═══════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════
const Ticker = ({ items, speed = 18, reverse = false }) => (
  <div className="w-full overflow-hidden border-y border-white/5 py-3 bg-black/80 backdrop-blur-sm">
    <div style={{ display: 'flex', animation: `ticker${reverse ? 'R' : ''} ${speed}s linear infinite`, whiteSpace: 'nowrap' }}>
      {[...items, ...items, ...items].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-6 px-6 text-[0.6rem] font-bold uppercase tracking-[0.45em] text-white/22">
          {item}<span className="w-1 h-1 rounded-full bg-[#22c55e] inline-block opacity-60" />
        </span>
      ))}
    </div>
  </div>
);

const StatCard = ({ num, label }) => (
  <div className="stat-card flex flex-col border-l border-white/10 pl-6">
    <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{num}</span>
    <span className="text-[0.6rem] uppercase tracking-[0.38em] text-white/30 mt-1 font-medium">{label}</span>
  </div>
);

const TeamCard = ({ name, role, idx, color }) => (
  <div className="team-card relative overflow-hidden rounded-2xl flex-shrink-0 group cursor-pointer"
    style={{ width: 280, height: 380, border: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="absolute inset-0 transition-all duration-700 group-hover:scale-105"
      style={{ background: `linear-gradient(145deg, ${color}18 0%, #000 70%)` }} />
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: `radial-gradient(ellipse at center top, ${color}10, transparent 60%)` }} />
    <div className="absolute bottom-0 left-0 right-0 h-px transition-all duration-500"
      style={{ background: `linear-gradient(to right, transparent, ${color}50, transparent)` }} />
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700"
      style={{ boxShadow: `inset 0 0 60px ${color}08` }} />
    <div className="absolute top-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
      style={{ border: `1px solid ${color}30`, background: `${color}08` }}>
      <span className="font-bebas text-xl" style={{ color }}>{`0${idx + 1}`}</span>
    </div>
    <div className="absolute bottom-8 left-8 right-8">
      <p className="font-bebas text-[2.4rem] text-white leading-none">{name}</p>
      <p className="text-[0.58rem] uppercase tracking-[0.4em] mt-2 font-bold" style={{ color }}>{role}</p>
      <div className="h-px w-8 mt-3 transition-all duration-500 group-hover:w-full" style={{ background: color }} />
    </div>
  </div>
);

const ValueItem = ({ number, title, desc, accent }) => (
  <div className="value-item relative py-14 border-b border-white/5 grid grid-cols-12 gap-8 items-start group cursor-default">
    <div className="col-span-1">
      <span className="font-bebas text-6xl leading-none transition-all duration-500 group-hover:opacity-60" style={{ color: `${accent}20` }}>{number}</span>
    </div>
    <div className="col-span-4">
      <h3 className="font-bebas text-[clamp(2rem,3.5vw,4rem)] leading-none text-white group-hover:text-[#22c55e] transition-colors duration-500">{title}</h3>
    </div>
    <div className="col-span-6 col-start-7 pt-2">
      <p className="text-white/35 leading-relaxed text-sm font-light group-hover:text-white/55 transition-colors duration-500">{desc}</p>
    </div>
    <div className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-1000"
      style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
    <div className="absolute top-0 left-0 w-0 h-px group-hover:w-full transition-all duration-700"
      style={{ background: `linear-gradient(to right, ${accent}30, transparent)` }} />
  </div>
);

const ClosingCard = ({ title, desc, accent, index }) => (
  <div className="closing-card min-w-[380px] md:min-w-[520px] h-[560px] rounded-2xl p-10 flex flex-col justify-between mx-6 relative overflow-hidden group cursor-pointer"
    style={{
      background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)',
      border: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(16px)',
    }}>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      style={{ background: `radial-gradient(ellipse at top right, ${accent}10, transparent 55%)` }} />
    <div className="absolute bottom-0 left-0 right-0 h-px"
      style={{ background: `linear-gradient(to right, transparent, ${accent}40, transparent)` }} />
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
      style={{ boxShadow: `inset 0 0 80px ${accent}06` }} />
    <div className="relative z-10">
      <span className="text-[0.58rem] uppercase tracking-[0.55em] font-bold" style={{ color: accent }}>0{index + 1}</span>
      <div className="h-px w-10 mt-3 mb-8 transition-all duration-500 group-hover:w-20" style={{ background: accent }} />
      <h3 className="text-3xl font-black tracking-tight leading-tight">{title}</h3>
    </div>
    <p className="relative z-10 text-white/40 font-light leading-relaxed text-[0.92rem] group-hover:text-white/60 transition-colors duration-500">{desc}</p>
  </div>
);

// ═══════════════════════════════════════════════════════
// SPLIT TEXT COMPONENT
// ═══════════════════════════════════════════════════════
function SplitText({ text, className, style, charClassName }) {
  return (
    <span className={className} style={{ ...style, display: 'inline-block' }}>
      {text.split('').map((char, i) => (
        <span key={i} className={`split-char inline-block ${charClassName || ''}`} style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>{char}</span>
      ))}
    </span>
  );
}

// ═══════════════════════════════════════════════════════
// COUNTER
// ═══════════════════════════════════════════════════════
function AnimatedCounter({ target, suffix = '', prefix = '', started }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / 90;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 14);
    return () => clearInterval(timer);
  }, [started, target]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
const techStack = [
  { name: 'React', icon: '⚛' }, { name: 'Three.js', icon: '◈' },
  { name: 'GSAP', icon: '▶' }, { name: 'WebGL', icon: '◉' },
  { name: 'TypeScript', icon: '𝗧' }, { name: 'Rust', icon: '🦀' },
  { name: 'WASM', icon: '▦' }, { name: 'WebGPU', icon: '◈' },
  { name: 'Vulkan', icon: '◬' }, { name: 'Edge', icon: '⬡' },
  { name: 'GLSL', icon: '⋮' }, { name: 'AI/ML', icon: '◎' },
];

export default function About() {
  const comp = useRef();
  const heroRef = useRef();
  const whoSectionRef = useRef();
  const manifestoRef = useRef();
  const counterRef = useRef();
  const valuesSectionRef = useRef();
  const teamSectionRef = useRef();
  const techSectionRef = useRef();
  const bookSectionRef = useRef();
  const bookCoverRef = useRef();
  const expSectionRef = useRef();
  const closingSectionRef = useRef();
  const horizontalWrapperRef = useRef();
  const portalRef = useRef();
  const portalTrackRef = useRef();
  const tunnelRef = useRef();
  const scrollProgress = useRef(0);
  const [countersStarted, setCountersStarted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Track global scroll progress for 3D scene
    const updateProgress = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollProgress.current = Math.min(window.scrollY / maxScroll, 1);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });

    const ctx = gsap.context(() => {
      const scope = comp.current;
      if (!scope) return;
      const selectAll = (sel) => Array.from(scope.querySelectorAll(sel));
      const sel = (sel) => scope.querySelector(sel);

      // ═══════════════════════════════════════════════════════
      // HERO ANIMATIONS
      // ═══════════════════════════════════════════════════════
      gsap.set('.hero-word', { y: '110%', opacity: 0 });
      gsap.set('.hero-sub', { y: 40, opacity: 0 });
      gsap.set('.hero-badge', { y: 20, opacity: 0 });
      gsap.set('.hero-stat-item', { y: 30, opacity: 0 });

      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .to('.hero-badge', { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out' })
        .to('.hero-word', { y: '0%', opacity: 1, duration: 1.2, stagger: 0.08, ease: 'expo.out' }, '-=0.5')
        .to('.hero-sub', { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'expo.out' }, '-=0.6')
        .to('.hero-stat-item', { y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: 'expo.out' }, '-=0.5');

      // Hero parallax layers
      if (heroRef.current) {
        gsap.to('.hero-bg-grid', {
          y: 300, scale: 1.15,
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 0.5 }
        });
        gsap.to('.hero-headline', {
          y: -280, opacity: 0.2,
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '80% top', scrub: 0.6 }
        });
        gsap.to('.hero-stats', {
          y: -180, opacity: 0,
          scrollTrigger: { trigger: heroRef.current, start: '10% top', end: '70% top', scrub: 0.5 }
        });
        gsap.to('.hero-badge', {
          y: -100, opacity: 0,
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '50% top', scrub: 0.4 }
        });
        gsap.to('.scroll-indicator', {
          opacity: 0, y: -20,
          scrollTrigger: { trigger: heroRef.current, start: '5% top', end: '20% top', scrub: true }
        });
        // Horizontal shake on scroll
        gsap.to('.hero-word-1', {
          x: -80,
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '60% top', scrub: 0.8 }
        });
        gsap.to('.hero-word-2', {
          x: 80,
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '60% top', scrub: 0.8 }
        });
        gsap.to('.hero-word-3', {
          x: -60, scale: 0.95,
          scrollTrigger: { trigger: heroRef.current, start: '10% top', end: '60% top', scrub: 0.8 }
        });
      }

      // ═══════════════════════════════════════════════════════
      // WHO WE ARE — character-by-character reveal
      // ═══════════════════════════════════════════════════════
      if (whoSectionRef.current) {
        const whoChars = selectAll('.who-char');
        gsap.set(whoChars, { opacity: 0.05, y: 20 });
        gsap.to(whoChars, {
          opacity: 1, y: 0,
          duration: 0.5,
          stagger: { each: 0.025, from: 'random' },
          scrollTrigger: {
            trigger: whoSectionRef.current,
            start: 'top 75%',
            end: 'center 40%',
            toggleActions: 'play none none reverse',
          }
        });

        // parallax text layers
        gsap.to('.who-line-1', {
          x: -120,
          scrollTrigger: { trigger: whoSectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
        });
        gsap.to('.who-line-2', {
          x: 100,
          scrollTrigger: { trigger: whoSectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
        });
        gsap.to('.who-line-3', {
          x: -80,
          scrollTrigger: { trigger: whoSectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.9 }
        });

        // canvas parallax
        gsap.to('.who-canvas', {
          y: -100, scale: 1.05,
          scrollTrigger: { trigger: whoSectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
        });
      }

      // ═══════════════════════════════════════════════════════
      // MANIFESTO — word-by-word sticky scrub
      // ═══════════════════════════════════════════════════════
      if (manifestoRef.current) {
        const manifestoWords = selectAll('.manifesto-word');
        gsap.set(manifestoWords, { opacity: 0.05 });
        ScrollTrigger.create({
          trigger: manifestoRef.current,
          start: 'top top',
          end: `+=${manifestoWords.length * 80}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.3,
          animation: gsap.to(manifestoWords, {
            opacity: 1,
            stagger: { each: 0.3 },
            ease: 'none',
          }),
        });

        // big text parallax beneath
        gsap.to('.manifesto-big', {
          y: -150, scale: 0.95,
          scrollTrigger: { trigger: manifestoRef.current, start: 'top top', end: 'bottom top', scrub: 1 }
        });
      }

      // ═══════════════════════════════════════════════════════
      // PORTAL SECTION — horizontal pinned scroll
      // ═══════════════════════════════════════════════════════
      if (portalRef.current && portalTrackRef.current) {
        const track = portalTrackRef.current;
        const getDist = () => Math.max(0, track.scrollWidth - portalRef.current.clientWidth);
        gsap.set(track, { x: 0 });
        ScrollTrigger.create({
          trigger: portalRef.current,
          start: 'top top',
          end: () => `+=${getDist() + window.innerWidth * 0.4}`,
          pin: true, pinSpacing: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
          animation: gsap.to(track, { x: () => -getDist(), ease: 'none' }),
        });

        // Portal panel scale on scroll
        selectAll('.portal-panel').forEach((panel, i) => {
          gsap.fromTo(panel, { scale: 0.88, opacity: 0.4 }, {
            scale: 1, opacity: 1,
            scrollTrigger: {
              trigger: panel, containerAnimation: ScrollTrigger.getById('portal-track'),
              start: 'left 80%', end: 'left 30%', scrub: true,
            }
          });
        });
      }

      // ═══════════════════════════════════════════════════════
      // VALUES — staggered slide-in with line reveal
      // ═══════════════════════════════════════════════════════
      selectAll('.value-item').forEach((item, i) => {
        gsap.fromTo(item,
          { y: 80, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          {
            y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'expo.out',
            scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none reverse' }
          }
        );
        gsap.fromTo(item.querySelector('.value-number-bg'),
          { scale: 2, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 1.5, ease: 'expo.out',
            scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' }
          }
        );
      });

      // ═══════════════════════════════════════════════════════
      // COUNTERS
      // ═══════════════════════════════════════════════════════
      if (counterRef.current) {
        ScrollTrigger.create({
          trigger: counterRef.current, start: 'top 75%', once: true,
          onEnter: () => setCountersStarted(true),
        });
        // Counter cards stagger
        gsap.fromTo('.counter-card',
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: counterRef.current, start: 'top 80%' }
          }
        );
      }

      // ═══════════════════════════════════════════════════════
      // TEAM — cascade with rotation
      // ═══════════════════════════════════════════════════════
      if (teamSectionRef.current) {
        gsap.fromTo('.team-card',
          { y: 100, opacity: 0, rotateX: 20 },
          {
            y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: teamSectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' }
          }
        );
        gsap.fromTo('.team-headline',
          { x: -80, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1.3, ease: 'expo.out',
            scrollTrigger: { trigger: teamSectionRef.current, start: 'top 80%' }
          }
        );
      }

      // ═══════════════════════════════════════════════════════
      // TECH SECTION
      // ═══════════════════════════════════════════════════════
      if (techSectionRef.current) {
        gsap.fromTo('.tech-header',
          { y: 80, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2, ease: 'expo.out',
            scrollTrigger: { trigger: techSectionRef.current, start: 'top 80%' }
          }
        );
        gsap.fromTo('.tech-pill',
          { y: 40, opacity: 0, scale: 0.8 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.05, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: techSectionRef.current, start: 'top 70%' }
          }
        );
      }

      // ═══════════════════════════════════════════════════════
      // BOOK SECTION — page flip
      // ═══════════════════════════════════════════════════════
      if (bookSectionRef.current && bookCoverRef.current) {
        const bookTl = gsap.timeline({
          scrollTrigger: { trigger: bookSectionRef.current, start: 'top top', end: '+=40%', scrub: 0.7, pin: true, anticipatePin: 1 }
        });
        bookTl.to(bookCoverRef.current, { rotateY: -180, ease: 'none' }, 0);
        bookTl.from('.book-line', { y: 50, opacity: 0, stagger: 0.1, duration: 0.5 }, 0.3);
      }

      // ═══════════════════════════════════════════════════════
      // PRODUCT EXPERIENCE — pinned sequential reveal
      // ═══════════════════════════════════════════════════════
      const expLines = selectAll('.exp-drag-line');
      if (expLines.length && expSectionRef.current) {
        gsap.set(expLines, { y: '120vh', opacity: 0 });
        const expTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        expLines.forEach((line, i) => { expTl.to(line, { y: 0, opacity: 1, duration: 1 }, i * 1.3); });
        ScrollTrigger.create({
          trigger: expSectionRef.current,
          start: 'top top', end: `+=${expLines.length * 55}vh`,
          pin: true, anticipatePin: 1, scrub: 0.2, fastScrollEnd: true,
          animation: expTl, invalidateOnRefresh: true,
        });
        gsap.to('.exp-canvas-wrapper', {
          scale: 1.08, ease: 'none',
          scrollTrigger: { trigger: expSectionRef.current, start: 'top top', end: `+=${expLines.length * 55}vh`, scrub: 1.3 }
        });
      }

      // ═══════════════════════════════════════════════════════
      // CLOSING HORIZONTAL
      // ═══════════════════════════════════════════════════════
      const hTrack = horizontalWrapperRef.current;
      if (hTrack && closingSectionRef.current) {
        gsap.fromTo('.closing-big-text',
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
            scrollTrigger: { trigger: closingSectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
          }
        );
        const getDist = () => hTrack.scrollWidth - closingSectionRef.current.offsetWidth;
        ScrollTrigger.create({
          trigger: closingSectionRef.current,
          start: 'top top', end: () => `+=${getDist()}`,
          pin: true, anticipatePin: 1, scrub: 0.9, invalidateOnRefresh: true,
          animation: gsap.to(hTrack, { x: () => -getDist(), ease: 'none' }),
        });
      }

      // ═══════════════════════════════════════════════════════
      // TUNNEL SECTION
      // ═══════════════════════════════════════════════════════
      if (tunnelRef.current) {
        gsap.fromTo('.tunnel-text',
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 1.1, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: tunnelRef.current, start: 'top 75%', toggleActions: 'play none none reverse' }
          }
        );
        // Letters scatter on approach
        gsap.fromTo('.tunnel-scatter-char',
          { opacity: 0, x: () => (Math.random() - 0.5) * 200, y: () => (Math.random() - 0.5) * 100 },
          {
            opacity: 1, x: 0, y: 0, duration: 1.2, stagger: { each: 0.03, from: 'random' }, ease: 'expo.out',
            scrollTrigger: { trigger: tunnelRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
          }
        );
      }

      // ═══════════════════════════════════════════════════════
      // SCROLL-LINKED SECTION BACKGROUNDS
      // ═══════════════════════════════════════════════════════
      // Ambient color shift on scroll
      selectAll('.section-glow-blob').forEach((blob, i) => {
        gsap.fromTo(blob,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1, scale: 1, duration: 1.5,
            scrollTrigger: { trigger: blob.parentElement, start: 'top 75%', end: 'bottom 25%', scrub: true }
          }
        );
      });

      // ═══════════════════════════════════════════════════════
      // MARQUEE SPEED BOOST ON SCROLL
      // ═══════════════════════════════════════════════════════
      // (handled via CSS animation-duration changes)

      // ═══════════════════════════════════════════════════════
      // CRYSTAL SECTION
      // ═══════════════════════════════════════════════════════
      const crystalSection = scope.querySelector('.crystal-section');
      if (crystalSection) {
        gsap.fromTo('.crystal-text-block > *',
          { x: 80, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: crystalSection, start: 'top 70%', toggleActions: 'play none none reverse' }
          }
        );
        gsap.to('.crystal-canvas', {
          y: -60, rotate: 5,
          scrollTrigger: { trigger: crystalSection, start: 'top bottom', end: 'bottom top', scrub: 1.3 }
        });
      }

      // ═══════════════════════════════════════════════════════
      // PHILOSOPHY SECTION
      // ═══════════════════════════════════════════════════════
      const philSection = scope.querySelector('.philosophy-section');
      if (philSection) {
        gsap.fromTo('.phil-text > *',
          { x: -80, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: philSection, start: 'top 70%', toggleActions: 'play none none reverse' }
          }
        );
        gsap.to('.phil-canvas', {
          y: -80, rotate: -5,
          scrollTrigger: { trigger: philSection, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
        });
      }

      // ═══════════════════════════════════════════════════════
      // DATA LAYER SECTION
      // ═══════════════════════════════════════════════════════
      const dataSection = scope.querySelector('.data-section');
      if (dataSection) {
        gsap.fromTo('.data-text > *',
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: 'expo.out',
            scrollTrigger: { trigger: dataSection, start: 'top 75%', toggleActions: 'play none none reverse' }
          }
        );
      }

    }, comp);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      ctx.revert();
    };
  }, []);

  // Data
  const values = [
    { number: '01', title: 'Radical Transparency', accent: '#22c55e', desc: 'We ship in the open. Every decision, every tradeoff, every failure — documented and shared. Trust is built in the light, not the dark.' },
    { number: '02', title: 'Obsessive Craft', accent: '#06b6d4', desc: 'We care about corners nobody sees. A 0.5px border, the exact easing curve, the silence between interactions — these are the materials we sculpt with.' },
    { number: '03', title: 'Speed is a Feature', accent: '#a78bfa', desc: "Every millisecond stolen back from latency is a gift to the user. Performance isn't an optimization — it's the product." },
    { number: '04', title: 'Empathy at Scale', accent: '#f59e0b', desc: 'A billion users means a billion contexts. We design for the person, not the persona. Real accessibility, real inclusion.' },
    { number: '05', title: 'Systems Over Features', accent: '#f43f5e', desc: 'Features decay. Systems compound. We build infrastructure that outlasts trends — every component a node in something larger.' },
  ];

  const team = [
    { name: 'Aria Nova', role: 'Founder & Vision', color: '#22c55e' },
    { name: 'Kenji Mori', role: 'Head of Engineering', color: '#06b6d4' },
    { name: 'Lena Cruz', role: 'Design Director', color: '#a78bfa' },
    { name: 'Dami Osei', role: 'Product Lead', color: '#f59e0b' },
    { name: 'Yuki Tanaka', role: '3D & Motion', color: '#f43f5e' },
    { name: 'Sage Park', role: 'AI Research', color: '#06b6d4' },
  ];

  const manifestoWords = 'We build for humans not metrics . Every decision starts with empathy . Always has . Always will .'.split(' ');

  return (
    <div ref={comp} className="relative bg-black text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,700;0,900;1,400;1,900&family=Bebas+Neue&display=swap');

        .font-bebas { font-family: 'Bebas Neue', cursive; }
        .text-stroke { -webkit-text-stroke: 1.8px rgba(255,255,255,0.25); color: transparent; }
        .text-stroke-green { -webkit-text-stroke: 1.8px rgba(34,197,94,0.5); color: transparent; }
        .green-glow { text-shadow: 0 0 60px rgba(34,197,94,0.5), 0 0 120px rgba(34,197,94,0.2); }
        .cyan-glow { text-shadow: 0 0 60px rgba(6,182,212,0.5), 0 0 120px rgba(6,182,212,0.2); }
        .purple-glow { text-shadow: 0 0 60px rgba(167,139,250,0.5), 0 0 120px rgba(167,139,250,0.2); }
        .red-glow { text-shadow: 0 0 60px rgba(244,63,94,0.5); }

        .hero-grid-line {
          position: absolute;
          background: linear-gradient(to bottom, transparent, rgba(34,197,94,0.04) 30%, rgba(34,197,94,0.04) 70%, transparent);
          width: 1px; top: 0; bottom: 0;
        }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.04; pointer-events: none;
        }
        .glass-pill { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(12px); }
        .glow-line { height: 1px; background: linear-gradient(to right, transparent, rgba(34,197,94,0.5), transparent); }
        .scanlines::after {
          content: ''; position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
          pointer-events: none;
        }
        .corner-bracket::before, .corner-bracket::after {
          content: ''; position: absolute; width: 18px; height: 18px; border-color: rgba(34,197,94,0.35); border-style: solid;
        }
        .corner-bracket::before { top: 10px; left: 10px; border-width: 1px 0 0 1px; }
        .corner-bracket::after { bottom: 10px; right: 10px; border-width: 0 1px 1px 0; }
        .book-page-shadow { box-shadow: 0 0 120px rgba(0,0,0,0.95), inset -28px 0 56px rgba(0,0,0,0.5); }
        .manifesto-section-wrap { min-height: 100vh; }
        ::selection { background: rgba(34,197,94,0.18); }

        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-33.33%)} }
        @keyframes tickerR { 0%{transform:translateX(-33.33%)} 100%{transform:translateX(0)} }
        @keyframes pulse-ring { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.12)} }
        @keyframes float-y { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes breathe { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.08);opacity:1} }
        @keyframes scanH { 0%{top:-2px} 100%{top:100%} }

        .scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(to right, transparent, rgba(34,197,94,0.4), transparent);
          animation: scanH 4s linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════
          GLOBAL 3D HERO SCENE (fixed, scroll-reactive)
      ══════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.7 }}>
        <HeroScene />
      </div>
      <div className="noise-overlay fixed inset-0 z-[1] pointer-events-none" />

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative overflow-hidden min-h-[130vh] z-10">
        {/* Grid lines */}
        <div className="hero-bg-grid absolute inset-0 z-0 opacity-30">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="hero-grid-line" style={{ left: `${(i + 1) * 5.88}%` }} />
          ))}
        </div>

        {/* Scan line effect */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          <div className="scan-line" />
        </div>

        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(34,197,94,0.05), transparent 70%)', filter: 'blur(60px)', animation: 'breathe 6s ease-in-out infinite' }} />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.04), transparent 70%)', filter: 'blur(40px)', animation: 'breathe 8s ease-in-out infinite 2s' }} />

        <div className="relative z-10 pt-44 pb-48 px-6 md:px-20 lg:px-32">
          {/* Badge */}
          <div className="hero-badge flex items-center gap-3 mb-14">
            <div className="w-2 h-2 rounded-full bg-[#22c55e]" style={{ animation: 'pulse-ring 1.5s ease-in-out infinite' }} />
            <span className="text-[#22c55e] text-[0.58rem] font-bold uppercase tracking-[0.65em]">Est. MMXXIV</span>
            <div className="h-px w-24 bg-gradient-to-r from-[#22c55e]/50 to-transparent" />
            <span className="text-white/18 text-[0.58rem] font-bold uppercase tracking-[0.4em]">Future-first design</span>
          </div>

          {/* Main headline — split word parallax */}
          <div className="hero-headline max-w-7xl" style={{ overflow: 'hidden' }}>
            <div style={{ overflow: 'hidden' }}>
              <h1 className="hero-word hero-word-1 font-bebas text-[clamp(5rem,14vw,14rem)] leading-[0.86] tracking-wide text-white inline-block">We don't</h1>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h1 className="hero-word hero-word-2 font-bebas text-[clamp(5rem,14vw,14rem)] leading-[0.86] tracking-wide text-stroke inline-block">follow</h1>
            </div>
            <div style={{ overflow: 'hidden', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap' }}>
              <h1 className="hero-word hero-word-3 font-bebas text-[clamp(5rem,14vw,14rem)] leading-[0.86] tracking-wide text-[#22c55e] green-glow inline-block">standards.</h1>
              <p className="hero-sub text-white/25 text-sm font-light max-w-xs mb-6 leading-[1.9]">
                We dismantle them, rebuild them, then make something the world has never seen.
              </p>
            </div>
          </div>

          <div className="glow-line w-full my-14 hero-sub" />

          {/* Stats */}
          <div className="hero-stats flex flex-wrap items-center gap-10 mt-4">
            {[
              { num: '4.9★', label: 'User Rating' },
              { num: '2M+', label: 'Active Users' },
              { num: '< 2ms', label: 'Response Time' },
              { num: '100%', label: 'Open Source' },
              { num: '18×', label: 'Award Winner' },
            ].map((s, i) => (
              <div key={i} className="hero-stat-item stat-card flex flex-col border-l border-white/10 pl-6">
                <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{s.num}</span>
                <span className="text-[0.6rem] uppercase tracking-[0.38em] text-white/28 mt-1 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-[0.58rem] uppercase tracking-[0.55em] text-white/18">Scroll to explore</span>
          <div className="relative w-5 h-8 border border-white/15 rounded-full flex justify-center">
            <div className="w-1 h-2 rounded-full bg-[#22c55e] mt-1.5" style={{ animation: 'float-y 1.5s ease-in-out infinite' }} />
          </div>
        </div>

        {/* HUD elements */}
        <div className="absolute top-8 right-8 z-20 flex flex-col items-end gap-1.5">
          <span className="text-[0.48rem] uppercase tracking-[0.55em] text-white/15">SYS::ONLINE</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" style={{ animation: 'pulse-ring 1.5s ease-in-out infinite' }} />
            <span className="text-[0.48rem] text-[#22c55e]/65 uppercase tracking-widest font-bold">LIVE</span>
          </div>
          <span className="text-[0.42rem] text-white/10 tracking-wider">v4.2.1-PROD</span>
        </div>

        <div className="absolute top-8 left-8 z-20 flex flex-col gap-1">
          <span className="text-[0.48rem] uppercase tracking-[0.45em] text-white/12">AURA/ABOUT</span>
          <span className="text-[0.42rem] text-white/8 tracking-wider">ENG-DISPLAY</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          TICKER 1
      ══════════════════════════════════════════════════ */}
      <div className="relative z-20">
        <Ticker items={['REDEFINE FLOW', 'AURA EDGE', 'ZERO LATENCY', 'CRAFT PRECISION', 'BEYOND LIMITS', 'OBSESS DETAILS', 'BUILD SYSTEMS']} />
      </div>

      {/* ══════════════════════════════════════════════════
          WHO WE ARE — parallax text layers
      ══════════════════════════════════════════════════ */}
      <section ref={whoSectionRef}
        className="relative min-h-screen w-full flex flex-col items-center justify-center py-48 px-6 overflow-hidden z-20"
        style={{ backgroundColor: 'rgba(8,8,16,0.92)', backdropFilter: 'blur(2px)' }}>

        <div className="who-canvas absolute inset-0 z-0 opacity-50">
          <Canvas dpr={[1, 1]} gl={{ antialias: false, alpha: true }} camera={{ position: [0, 0, 8], fov: 60 }}>
            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} color="#22c55e" intensity={1.5} />
            <Suspense fallback={null}>
              <FloatingParticles count={140} />
              <OrbCluster count={8} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        <div className="section-glow-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(34,197,94,0.05), transparent 70%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-6xl text-center space-y-2">
          {/* Parallax-shifted lines */}
          <p className="who-line-1 font-bebas text-[clamp(3rem,9vw,9.5rem)] leading-[0.9] text-white tracking-wide will-change-transform">
            {'We\'re not just a platform.'.split('').map((c, i) => (
              <span key={i} className="who-char inline-block" style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}>{c}</span>
            ))}
          </p>
          <p className="who-line-2 font-bebas text-[clamp(3rem,9vw,9.5rem)] leading-[0.9] tracking-wide text-stroke will-change-transform">
            {'We\'re a movement.'.split('').map((c, i) => (
              <span key={i} className="who-char inline-block" style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}>{c}</span>
            ))}
          </p>
          <p className="who-line-3 font-bebas text-[clamp(3rem,9vw,9.5rem)] leading-[0.9] text-[#22c55e] green-glow tracking-wide will-change-transform">
            {'We\'re the future.'.split('').map((c, i) => (
              <span key={i} className="who-char inline-block" style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}>{c}</span>
            ))}
          </p>

          <p className="text-white/30 text-base font-light max-w-lg mx-auto leading-[2] mt-8">
            Built by obsessives who believe the interface between human and machine should feel like breathing — effortless, invisible, essential.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
            {['Design-first', 'Performance-obsessed', 'Zero compromise', 'Craft over speed', 'Human-centered'].map((tag) => (
              <span key={tag} className="px-5 py-2 rounded-full text-[0.62rem] uppercase tracking-[0.3em] font-bold border border-white/8 text-white/30 hover:border-[#22c55e]/30 hover:text-[#22c55e]/70 transition-all duration-500">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MANIFESTO (pinned word-reveal)
      ══════════════════════════════════════════════════ */}
      <section ref={manifestoRef}
        className="manifesto-section-wrap relative w-full flex items-center justify-center px-6 md:px-16 lg:px-24 overflow-hidden z-20 scanlines"
        style={{ minHeight: '100vh', backgroundColor: 'rgba(4,4,6,0.95)', backdropFilter: 'blur(4px)' }}>

        <div className="absolute inset-0 z-0"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(167,139,250,0.03), transparent)' }} />

        <div className="relative z-10 w-full max-w-6xl">
          <p className="text-[0.58rem] uppercase tracking-[0.65em] text-[#a78bfa]/55 font-bold mb-16">— Our Manifesto</p>

          {/* Big parallax background text */}
          <div className="manifesto-big absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <p className="font-bebas text-[20vw] leading-none text-white/[0.015] tracking-widest select-none">TRUTH</p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-x-6 gap-y-2 items-baseline">
            {manifestoWords.map((word, i) => {
              const colors = { 'humans': '#22c55e', 'metrics': '#f43f5e', 'empathy': '#06b6d4', 'Always': '#a78bfa' };
              const isBig = ['We', 'humans', 'not', 'empathy', 'Always'].includes(word);
              const color = colors[word];
              return (
                <span key={i} className={`manifesto-word font-bebas tracking-wide leading-none transition-all duration-300 ${
                  isBig ? 'text-[clamp(3.5rem,7vw,7.5rem)]' : 'text-[clamp(2rem,4vw,4.5rem)]'
                } ${word === '.' ? 'text-[#22c55e]' : ''}`}
                  style={{ color: color || (word === '.' ? '#22c55e' : 'white') }}>
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PORTAL — horizontal pinned
      ══════════════════════════════════════════════════ */}
      <section ref={portalRef} className="relative w-full h-screen overflow-hidden z-20"
        style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(4px)' }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(34,197,94,0.06), transparent 65%)' }} />

        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-center">
          <p className="text-[0.58rem] uppercase tracking-[0.65em] text-[#22c55e]/45 font-bold">Gateway to excellence</p>
        </div>

        <div ref={portalTrackRef} className="relative z-10 flex h-full w-max items-center gap-16 px-[8vw] will-change-transform">
          {[
            { title: 'Step through.', desc: 'Move into a cleaner, calmer interface designed for focus.', accent: '#22c55e' },
            { title: 'The portal.', desc: 'Let the scroll carry the story forward into clarity.', accent: '#06b6d4' },
            { title: 'Move beyond.', desc: 'Simple motion, strong hierarchy, premium feel.', accent: '#a78bfa' },
          ].map((item, index) => (
            <div key={index} className="portal-panel flex-shrink-0 group"
              style={{
                width: '72vw', maxWidth: 1000, minWidth: 740, height: '62vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '32px',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(0,0,0,0.02) 100%)',
                backdropFilter: 'blur(16px)', position: 'relative', overflow: 'hidden',
              }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 30%, ${item.accent}12 0%, transparent 50%)`, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, transparent, ${item.accent}50, transparent)` }} />

              {/* Corner elements */}
              <div style={{ position: 'absolute', top: 20, left: 20, width: 20, height: 20, borderTop: `1px solid ${item.accent}40`, borderLeft: `1px solid ${item.accent}40` }} />
              <div style={{ position: 'absolute', bottom: 20, right: 20, width: 20, height: 20, borderBottom: `1px solid ${item.accent}40`, borderRight: `1px solid ${item.accent}40` }} />

              <div className="relative z-10 text-center px-8">
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.6em', textTransform: 'uppercase', color: item.accent, marginBottom: '1.4rem', fontWeight: 700 }}>
                  Portal {index + 1}
                </div>
                <h2 className="font-bebas" style={{ fontSize: 'clamp(4.5rem,10vw,10.5rem)', lineHeight: 0.88, color: '#fff', textShadow: `0 0 40px ${item.accent}20` }}>
                  {item.title}
                </h2>
                <div style={{ width: 90, height: 1, background: item.accent, margin: '1.8rem auto 1.6rem', boxShadow: `0 0 24px ${item.accent}70` }} />
                <p style={{ maxWidth: 540, margin: '0 auto', color: 'rgba(255,255,255,0.4)', lineHeight: 1.85, fontSize: '1rem', fontWeight: 300 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LIVE COUNTERS
      ══════════════════════════════════════════════════ */}
      <section ref={counterRef} className="relative w-full py-40 px-6 md:px-16 overflow-hidden z-20"
        style={{ background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(4px)' }}>

        <div className="section-glow-blob absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(34,197,94,0.04), transparent)' }} />

        <div className="glow-line max-w-6xl mx-auto mb-20" />
        <p className="text-[0.58rem] uppercase tracking-[0.65em] text-white/20 font-bold text-center mb-16">By the numbers</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {[
            { target: 2400000, suffix: '+', label: 'Active Users', color: '#22c55e' },
            { target: 99, suffix: '.9%', label: 'Uptime SLA', color: '#06b6d4' },
            { target: 1200000, suffix: '+', label: 'Lines of Code', color: '#a78bfa' },
            { target: 18, suffix: ' awards', label: 'Design Awards', color: '#f59e0b' },
          ].map((c, i) => (
            <div key={i} className="counter-card rounded-2xl p-8 text-center corner-bracket relative overflow-hidden group"
              style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0))', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at top, ${c.color}08, transparent)` }} />
              <div className="font-bebas text-[clamp(2.5rem,5vw,5.5rem)] leading-none relative z-10"
                style={{ color: c.color, textShadow: `0 0 40px ${c.color}40` }}>
                <AnimatedCounter target={c.target} suffix={c.suffix} started={countersStarted} />
              </div>
              <p className="text-[0.58rem] uppercase tracking-[0.4em] text-white/22 mt-3 font-bold">{c.label}</p>
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${c.color}30, transparent)` }} />
            </div>
          ))}
        </div>
        <div className="glow-line max-w-6xl mx-auto mt-20" />
      </section>

      {/* ══════════════════════════════════════════════════
          TICKER 2
      ══════════════════════════════════════════════════ */}
      <div className="relative z-20">
        <Ticker items={['ATOMIC DESIGN', 'SUB-MS RESPONSE', 'GPU ACCELERATED', 'WEBGL POWERED', 'EDGE DEPLOYED', 'RUST CORE', 'AI-NATIVE']} speed={22} reverse />
      </div>

      {/* ══════════════════════════════════════════════════
          TUNNEL — velocity section
      ══════════════════════════════════════════════════ */}
      <section ref={tunnelRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden z-20"
        style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(2px)' }}>

        <div className="absolute inset-0">
          <Canvas dpr={[1, 1]} gl={{ antialias: false, alpha: true }} camera={{ position: [0, 0, 0.5], fov: 85 }}>
            <ambientLight intensity={0.05} />
            <Suspense fallback={null}>
              <WarpTunnel />
              <Comets count={8} />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 40% 60% at 50% 50%, transparent 5%, rgba(0,0,0,0.92) 100%)' }} />

        <div className="relative z-10 text-center px-6">
          <p className="tunnel-text text-[0.58rem] uppercase tracking-[0.65em] text-[#06b6d4]/55 font-bold mb-5">Velocity</p>
          <h2 className="tunnel-text font-bebas text-[clamp(3.5rem,10vw,10.5rem)] leading-none text-white tracking-wide">
            {'Faster than'.split('').map((c, i) => (
              <span key={i} className="tunnel-scatter-char inline-block" style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}>{c}</span>
            ))}
          </h2>
          <h2 className="tunnel-text font-bebas text-[clamp(3.5rem,10vw,10.5rem)] leading-none text-[#06b6d4] cyan-glow tracking-wide">
            {'thought.'.split('').map((c, i) => (
              <span key={i} className="tunnel-scatter-char inline-block">{c}</span>
            ))}
          </h2>
          <p className="tunnel-text text-white/22 text-sm font-light max-w-xs mx-auto mt-10 leading-[2]">
            When latency disappears, interfaces stop being tools. They become extensions of intent.
          </p>
          <div className="tunnel-text flex justify-center gap-4 mt-10">
            {['< 2ms', '99.9%', '∞ scale'].map((tag) => (
              <span key={tag} className="px-5 py-2 rounded-full text-[0.62rem] uppercase tracking-widest font-bold border border-[#06b6d4]/20 text-[#06b6d4]/55">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BOOK — page flip
      ══════════════════════════════════════════════════ */}
      <section ref={bookSectionRef}
        className="min-h-screen w-full flex items-center justify-center relative z-20 px-6"
        style={{ background: 'rgba(4,4,6,0.97)', perspective: '2400px', backdropFilter: 'blur(4px)' }}>

        <div className="relative w-[min(92vw,920px)] h-[min(62vw,500px)] book-page-shadow" style={{ borderRadius: '4px 14px 14px 4px' }}>
          {/* Back page */}
          <div className="absolute inset-0 rounded-r-xl z-0 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #080810 0%, #0a0a12 100%)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="absolute inset-0"
              style={{ background: 'radial-gradient(circle at 8% 20%, rgba(34,197,94,0.08), transparent 35%), radial-gradient(circle at 90% 75%, rgba(6,182,212,0.05), transparent 30%)' }} />
            <div className="relative h-full flex flex-col justify-center px-12 md:px-16 gap-8 text-white font-light">
              <div className="book-line space-y-2">
                <span className="text-[0.58rem] font-bold uppercase tracking-[0.55em] text-[#22c55e]/65">Inside the Blueprint</span>
                <div className="h-px w-24 bg-gradient-to-r from-[#22c55e]/55 to-transparent mt-2" />
              </div>
              <div className="book-line max-w-[38rem] space-y-2">
                <p className="font-bebas text-[clamp(2.2rem,4.5vw,4.5rem)] leading-[1.0] tracking-wide text-white">Good design is invisible.</p>
                <p className="font-bebas text-[clamp(2.2rem,4.5vw,4.5rem)] leading-[1.0] tracking-wide text-white/30">Great design is unforgettable.</p>
                <p className="font-bebas text-[clamp(2.2rem,4.5vw,4.5rem)] leading-[1.0] tracking-wide text-[#22c55e] green-glow">Ours is both.</p>
              </div>
              <div className="book-line max-w-[32rem]">
                <p className="text-sm leading-[1.85] text-white/35">We obsess over details. Because details build trust. Because trust builds everything that matters.</p>
              </div>
              <div className="book-line flex items-center gap-3">
                <span className="h-px w-12 bg-white/10" />
                <span className="text-[0.58rem] font-bold uppercase tracking-[0.45em] text-white/20">crafted with precision</span>
              </div>
            </div>
          </div>
          {/* Cover */}
          <div ref={bookCoverRef} className="absolute inset-0 z-10 rounded-lg overflow-hidden"
            style={{ transformOrigin: 'left center', backfaceVisibility: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(145deg, #0f1a0f, #000)' }}>
              <div className="text-center">
                <p className="font-bebas text-9xl text-[#22c55e]/18 leading-none tracking-widest">BLUEPRINT</p>
                <div className="glow-line mt-4 w-48 mx-auto" />
                <p className="text-[0.58rem] uppercase tracking-[0.5em] text-white/12 mt-4">Aura Design System</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-4 rounded-l z-20"
            style={{ background: 'linear-gradient(to right, rgba(34,197,94,0.15), transparent)' }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          VALUES
      ══════════════════════════════════════════════════ */}
      <section ref={valuesSectionRef}
        className="relative w-full py-48 px-6 md:px-16 lg:px-24 z-20"
        style={{ background: 'rgba(6,6,8,0.96)', backdropFilter: 'blur(4px)' }}>

        {/* Floating orb */}
        <div className="section-glow-blob absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.04), transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-24">
            <div className="h-px flex-1 bg-white/5" />
            <p className="text-[0.58rem] uppercase tracking-[0.65em] text-white/20 font-bold">What we stand for</p>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          {values.map((v) => (
            <div key={v.number} className="value-item relative py-14 border-b border-white/5 grid grid-cols-12 gap-8 items-start group cursor-default" style={{ clipPath: 'inset(0 0 0 0)' }}>
              <div className="col-span-1 relative">
                <span className="value-number-bg font-bebas text-[8rem] leading-none absolute -top-8 -left-4 pointer-events-none select-none" style={{ color: `${v.accent}08` }}>{v.number}</span>
                <span className="font-bebas text-2xl leading-none relative z-10 text-white/25">{v.number}</span>
              </div>
              <div className="col-span-4">
                <h3 className="font-bebas text-[clamp(2rem,3.5vw,4.2rem)] leading-none text-white group-hover:text-[#22c55e] transition-colors duration-500">{v.title}</h3>
              </div>
              <div className="col-span-6 col-start-7 pt-2">
                <p className="text-white/30 leading-relaxed text-sm font-light group-hover:text-white/55 transition-colors duration-500">{v.desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-1000"
                style={{ background: `linear-gradient(to right, ${v.accent}, transparent)` }} />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DNA / ARCHITECTURE
      ══════════════════════════════════════════════════ */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden z-20"
        style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(2px)' }}>
        <div className="absolute inset-0">
          <Canvas dpr={[1, 1]} gl={{ antialias: false, alpha: true }} camera={{ position: [0, 0, 8], fov: 55 }}>
            <ambientLight intensity={0.15} />
            <pointLight position={[4, 4, 4]} color="#22c55e" intensity={3} />
            <pointLight position={[-4, -4, 3]} color="#a78bfa" intensity={2} />
            <Suspense fallback={null}>
              <DNAHelix />
              <FloatingParticles count={90} />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 45% 75% at 50% 50%, transparent 20%, rgba(0,0,0,0.9) 100%)' }} />
        <div className="relative z-10 text-center px-6">
          <p className="text-[0.58rem] uppercase tracking-[0.65em] text-[#06b6d4]/55 font-bold mb-5">Architecture</p>
          <h2 className="font-bebas text-[clamp(3rem,9vw,9.5rem)] leading-none text-white tracking-wide">Built at the</h2>
          <h2 className="font-bebas text-[clamp(3rem,9vw,9.5rem)] leading-none text-[#06b6d4] cyan-glow tracking-wide">molecular level.</h2>
          <p className="text-white/22 text-sm font-light max-w-sm mx-auto mt-8 leading-[2]">
            Every system designed from first principles. No shortcuts, no inherited tech debt — pure, considered architecture.
          </p>
          <div className="flex justify-center mt-10 gap-4">
            {['First principles', 'Zero debt', 'Pure signal'].map((tag) => (
              <span key={tag} className="px-4 py-2 rounded-full text-[0.62rem] uppercase tracking-widest font-bold border border-[#06b6d4]/20 text-[#06b6d4]/45">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CRYSTAL — MATERIALITY
      ══════════════════════════════════════════════════ */}
      <section className="crystal-section relative w-full min-h-screen flex items-center overflow-hidden z-20 py-40 px-6 md:px-20"
        style={{ background: 'rgba(4,4,6,0.96)', backdropFilter: 'blur(4px)' }}>

        <div className="crystal-canvas absolute left-0 top-0 bottom-0 w-[55vw] opacity-90">
          <Canvas dpr={[1, 1]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 4.5], fov: 65 }}>
            <ambientLight intensity={0.1} />
            <pointLight position={[2, 2, 2]} color="#22c55e" intensity={4} />
            <pointLight position={[-2, -2, 2]} color="#a78bfa" intensity={3} />
            <pointLight position={[0, 3, 1]} color="#06b6d4" intensity={2} />
            <Suspense fallback={null}>
              <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
                <mesh>
                  <octahedronGeometry args={[1.5, 2]} />
                  <MeshDistortMaterial color="#22c55e" distort={0.45} speed={2.2} metalness={1} roughness={0} transparent opacity={0.75} envMapIntensity={3} />
                </mesh>
              </Float>
              <Sparkles count={40} scale={4} size={1.4} speed={0.25} color="#22c55e" />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>

        <div className="crystal-text-block relative z-10 max-w-xl ml-auto">
          <p className="text-[0.58rem] uppercase tracking-[0.65em] text-[#22c55e]/55 font-bold mb-8">Materiality</p>
          <h2 className="font-bebas text-[clamp(2.8rem,7vw,7.5rem)] leading-none text-white tracking-wide mb-2">We shape</h2>
          <h2 className="font-bebas text-[clamp(2.8rem,7vw,7.5rem)] leading-none text-[#22c55e] green-glow tracking-wide mb-12">the future.</h2>
          <p className="text-white/32 leading-[1.9] text-sm font-light mb-5 max-w-md">
            Form follows function — until function becomes so refined that form and function are the same thing. That's where we live: at the intersection of art and engineering.
          </p>
          <p className="text-white/15 leading-[1.9] text-xs font-light max-w-md">
            Every surface, every shadow, every transition has been deliberated over until only the essential remains.
          </p>
          <div className="flex items-center gap-4 mt-14">
            <div className="h-px w-14 bg-[#22c55e]/35" />
            <span className="text-[0.58rem] uppercase tracking-[0.45em] text-white/18 font-bold">Art meets engineering</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TEAM
      ══════════════════════════════════════════════════ */}
      <section ref={teamSectionRef}
        className="relative w-full py-48 overflow-hidden z-20"
        style={{ background: 'rgba(7,7,16,0.97)', backdropFilter: 'blur(4px)' }}>

        <div className="section-glow-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(34,197,94,0.03), transparent 70%)', filter: 'blur(80px)' }} />

        <div className="px-6 md:px-16 lg:px-24 mb-24 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-white/4" />
            <p className="text-[0.58rem] uppercase tracking-[0.65em] text-white/20 font-bold">The Minds</p>
            <div className="h-px flex-1 bg-white/4" />
          </div>
          <h2 className="team-headline font-bebas text-[clamp(3rem,7.5vw,7.5rem)] leading-none text-white tracking-wide">Obsessives,</h2>
          <h2 className="team-headline font-bebas text-[clamp(3rem,7.5vw,7.5rem)] leading-none text-stroke tracking-wide">not employees.</h2>
        </div>

        <div className="flex gap-6 px-[8vw] overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {team.map((member, i) => (<TeamCard key={i} {...member} idx={i} />))}
        </div>

        {/* Ambient orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {['#22c55e', '#06b6d4', '#a78bfa'].map((c, i) => (
            <div key={i} className="absolute w-48 h-48 rounded-full"
              style={{
                background: `radial-gradient(circle, ${c}30, transparent 70%)`,
                filter: 'blur(40px)',
                left: `${15 + i * 33}%`, top: '55%', transform: 'translateY(-50%)',
                animation: `float-y ${3.5 + i * 0.8}s ease-in-out infinite ${i * 0.7}s`,
              }} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TECH STACK
      ══════════════════════════════════════════════════ */}
      <section ref={techSectionRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden z-20"
        style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(2px)' }}>

        <div className="absolute inset-0">
          <Canvas dpr={[1, 1.1]} gl={{ antialias: false, alpha: true }} camera={{ position: [0, 3, 6], fov: 70 }}>
            <Suspense fallback={null}>
              <WarpGrid />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 50%, transparent 10%, rgba(0,0,0,0.94) 80%)' }} />

        <div className="relative z-10 text-center px-6">
          <p className="tech-header text-[0.58rem] uppercase tracking-[0.65em] text-[#a78bfa]/55 font-bold mb-8">The Stack</p>
          <h2 className="tech-header font-bebas text-[clamp(3rem,8.5vw,8.5rem)] leading-none text-white tracking-wide mb-16">Weapons of choice.</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {techStack.map((t) => (
              <div key={t.name} className="tech-pill glass-pill px-5 py-2.5 rounded-full flex items-center gap-2.5 group hover:border-[#22c55e]/30 transition-all duration-400 cursor-default">
                <span className="text-[#22c55e] text-base">{t.icon}</span>
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-white/40 group-hover:text-white/80 transition-colors duration-300">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PHILOSOPHY
      ══════════════════════════════════════════════════ */}
      <section className="philosophy-section relative w-full min-h-screen flex items-center overflow-hidden z-20 py-48 px-6 md:px-16"
        style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(2px)' }}>

        <div className="phil-canvas absolute right-[-5vw] top-0 bottom-0 w-[55vw] opacity-70">
          <Canvas dpr={[1, 1]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 6], fov: 60 }}>
            <ambientLight intensity={0.08} />
            <pointLight position={[2, 2, 2]} color="#a78bfa" intensity={2} />
            <pointLight position={[-2, -2, 2]} color="#22c55e" intensity={1.5} />
            <Suspense fallback={null}>
              <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.5}>
                <mesh>
                  <icosahedronGeometry args={[2, 1]} />
                  <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.2} />
                </mesh>
                <mesh>
                  <torusGeometry args={[3, 0.012, 8, 180]} />
                  <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} transparent opacity={0.35} />
                </mesh>
              </Float>
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>

        <div className="phil-text relative z-10 max-w-2xl">
          <p className="text-[0.58rem] uppercase tracking-[0.65em] text-[#22c55e]/55 font-bold mb-10">Philosophy</p>
          <h2 className="font-bebas text-[clamp(2.8rem,7.5vw,7.5rem)] leading-none text-white tracking-wide mb-2">We think in</h2>
          <h2 className="font-bebas text-[clamp(2.8rem,7.5vw,7.5rem)] leading-none text-[#a78bfa] purple-glow tracking-wide mb-12">systems.</h2>
          <p className="text-white/32 leading-[1.9] text-sm font-light mb-6 max-w-lg">
            Not features, not sprints — systems. When every piece is designed to work in harmony, the whole becomes greater than its parts. That's where the magic lives.
          </p>
          <p className="text-white/15 leading-[1.9] text-xs font-light max-w-lg">
            We've rejected the tyranny of the roadmap. Instead, we pursue clarity: what is the simplest, most elegant version of this idea? Then we build exactly that.
          </p>
          <div className="flex items-center gap-4 mt-14">
            <div className="h-px w-14 bg-[#a78bfa]/35" />
            <span className="text-[0.58rem] uppercase tracking-[0.45em] text-white/18 font-bold">Principle, not process</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TICKER 3
      ══════════════════════════════════════════════════ */}
      <div className="relative z-20">
        <Ticker items={['FIRST PRINCIPLES', 'CINEMATIC UI', 'MOTION DESIGN', 'IMMERSIVE SCROLL', 'HYPERCRAFT', 'ZERO FRICTION', 'BEYOND LIMITS']} speed={19} />
      </div>

      {/* ══════════════════════════════════════════════════
          PRODUCT EXPERIENCE (pinned)
      ══════════════════════════════════════════════════ */}
      <section ref={expSectionRef}
        className="relative w-full flex items-center justify-center z-30"
        style={{ height: '100vh', overflow: 'hidden', background: 'rgba(0,0,0,0.98)' }}>

        <div className="exp-canvas-wrapper absolute inset-0 z-0">
          <Canvas dpr={[1, 1]} gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
            camera={{ position: [0, 0, 5] }}>
            <Suspense fallback={null}>
              <Stars radius={80} depth={45} count={2200} factor={2.8} fade speed={0.45} />
              <Comets count={8} />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 65% 65% at 50% 50%, transparent 20%, rgba(0,0,0,0.82) 100%)' }} />

        <div className="relative z-20 w-full px-[8vw] flex flex-col gap-0 pointer-events-none select-none">
          <div style={{ overflow: 'hidden' }}>
            <p className="exp-drag-line text-[0.62rem] uppercase tracking-[0.55em] text-[#22c55e]/55 font-bold mb-3">Product Experience</p>
          </div>
          {[
            { text: 'Every scroll.', color: 'text-white' },
            { text: 'Every second.', color: 'text-[#22c55e] green-glow' },
            { text: 'Every interaction.', color: 'text-white/16' },
            { text: 'Designed for you.', color: 'text-white/10' },
            { text: 'Felt by all.', color: 'text-[#a78bfa]/12 purple-glow' },
          ].map((item, i) => (
            <div key={i} style={{ overflow: 'hidden', lineHeight: 1 }}>
              <h2 className={`exp-drag-line font-bebas text-[clamp(3rem,9.5vw,10rem)] leading-[0.9] tracking-wide ${item.color}`}>{item.text}</h2>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DATA LAYER
      ══════════════════════════════════════════════════ */}
      <section className="data-section relative w-full h-screen flex items-center justify-center overflow-hidden z-20"
        style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(2px)' }}>
        <div className="absolute inset-0">
          <Canvas dpr={[1, 1]} gl={{ antialias: false, alpha: true }} camera={{ position: [0, 0, 6], fov: 70 }}>
            <ambientLight intensity={0.1} />
            <pointLight position={[0, 2, 3]} color="#22c55e" intensity={2} />
            <Suspense fallback={null}>
              <FloatingParticles count={180} />
              <Sparkles count={60} scale={8} size={1} speed={0.12} color="#a78bfa" />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 65% at 50% 50%, transparent 15%, rgba(0,0,0,0.92) 100%)' }} />
        <div className="data-text relative z-10 text-center px-6">
          <p className="text-[0.58rem] uppercase tracking-[0.65em] text-[#22c55e]/55 font-bold mb-5">Data Layer</p>
          <h2 className="font-bebas text-[clamp(3rem,9vw,9.5rem)] leading-none text-white tracking-wide">Information</h2>
          <h2 className="font-bebas text-[clamp(3rem,9vw,9.5rem)] leading-none text-[#22c55e] green-glow tracking-wide">made beautiful.</h2>
          <p className="text-white/20 text-sm font-light max-w-xs mx-auto mt-8 leading-[2]">
            Raw data transformed into clarity. Every dashboard a work of art. Every chart a narrative.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CLOSING HORIZONTAL SCROLL
      ══════════════════════════════════════════════════ */}
      <section ref={closingSectionRef}
        className="relative h-screen w-full flex flex-col items-center justify-center z-20"
        style={{ overflow: 'hidden', background: 'rgba(0,0,0,0.98)' }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,197,94,0.03), transparent)' }} />

        <div className="closing-big-text text-center mb-14 z-10 px-6 flex-shrink-0" style={{ opacity: 0 }}>
          <p className="text-[0.58rem] uppercase tracking-[0.65em] text-white/20 mb-4 font-bold">The Verdict</p>
          <h2 className="font-bebas text-[clamp(2rem,6vw,6.5rem)] tracking-wide text-white/45 leading-none">This isn't just a product.</h2>
          <h2 className="font-bebas text-[clamp(3.5rem,10vw,10rem)] tracking-wide text-[#22c55e] green-glow leading-none">It's an experience.</h2>
        </div>

        <div className="w-full overflow-hidden flex-shrink-0">
          <div ref={horizontalWrapperRef} className="flex flex-nowrap px-[8vw]" style={{ willChange: 'transform' }}>
            <ClosingCard index={0} title="Redefining Flow"
              desc="Every pixel optimized for the human eye. We craft visual narratives that linger long after the screen goes dark." accent="#22c55e" />
            <ClosingCard index={1} title="The Aura Edge"
              desc="Built on a stack that prioritizes speed above everything. Sub-millisecond renders, uncompromised fidelity." accent="#06b6d4" />
            <ClosingCard index={2} title="Molecular Design"
              desc="We design from atoms up. Every component is a building block for something grander, more deliberate, more alive." accent="#a78bfa" />
            <ClosingCard index={3} title="Getting Started"
              desc="The journey into the future of design has just begun. Stay tuned for what follows — we're only warming up." accent="#f59e0b" />
            <div className="min-w-[360px] flex flex-col items-center justify-center gap-6 mx-8">
              <p className="font-bebas text-[clamp(5rem,12vw,9rem)] text-white/6 tracking-widest leading-none">FIN.</p>
              <div className="glow-line w-24" />
              <p className="text-[0.58rem] uppercase tracking-[0.55em] text-white/16">End of story</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer ambient */}
      <div className="relative z-20 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(34,197,94,0.3), transparent)' }} />
    </div>
  );
}
 
