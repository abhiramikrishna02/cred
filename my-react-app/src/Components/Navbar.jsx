import React, { Suspense, useState, useMemo, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

// --- THREE.JS COMPONENT ---
function ActiveLight({ activeIndex }) {
  const meshRef = useRef();
  
  // Maps the index to an X position for the 3D orb
  // These values might need slight tweaking based on your padding
  const xPos = (activeIndex - (navItems.length - 1) / 2) * 1.6;

  useFrame((state) => {
    if (meshRef.current) {
      // Smoothly interpolate the orb position
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        xPos,
        0.1
      );
    }
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <MeshDistortMaterial
          color="#ffffff"
          speed={3}
          distort={0.4}
          radius={1}
          emissive="#ffffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
}

// --- MAIN NAVBAR ---
export default function Navbar() {
  const [hoveredPath, setHoveredPath] = useState(null);
  const location = useLocation();
  
  const activeIndex = navItems.findIndex(item => item.to === location.pathname);

  return (
    <header className="fixed top-8 left-0 right-0 z-50 flex justify-center px-6">
      <div className="relative flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-2 shadow-2xl backdrop-blur-2xl">
        
        {/* Three.js Canvas Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-full pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5], fov: 30 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Suspense fallback={null}>
              <ActiveLight activeIndex={activeIndex} />
            </Suspense>
          </Canvas>
        </div>

        {navItems.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            onMouseEnter={() => setHoveredPath(item.to)}
            onMouseLeave={() => setHoveredPath(null)}
            className={() =>
              `relative z-10 rounded-full px-5 py-2.5 text-[0.68rem] font-bold uppercase tracking-[0.25em] transition-all duration-700 ${
                location.pathname === item.to 
                  ? "text-white scale-105" 
                  : "text-white/40 hover:text-white/80"
              }`
            }
          >
            {/* Framer Motion Active Background (CSS Backup/Enhancement) */}
            {location.pathname === item.to && (
              <motion.div
                layoutId="active-glow"
                className="absolute inset-0 z-[-1] rounded-full bg-white/10 blur-[2px]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
              />
            )}

            {/* Hover State */}
            <AnimatePresence>
              {hoveredPath === item.to && location.pathname !== item.to && (
                <motion.div
                  layoutId="hover-pill"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-[-1] rounded-full bg-white/5"
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                />
              )}
            </AnimatePresence>

            <span className="relative">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </header>
  );
}