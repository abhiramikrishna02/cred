import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera } from '@react-three/drei';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function MobileModel({ index, scrollTriggerRef }) {
  const { scene } = useGLTF('/private/phone-model.glb'); 
  const groupRef = useRef();
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useLayoutEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTriggerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    const xOffset = (index - 2) * 3.5;
    const rotationOffset = (index - 2) * 0.25;

    tl.to(groupRef.current.position, { x: xOffset, y: 0, z: 0 }, 0);
    
    // FIXED: Removed Math.PI * 2 to stop the full 360-degree spin
    tl.to(groupRef.current.rotation, { 
      y: rotationOffset, 
      z: rotationOffset * 0.5 
    }, 0);
    
  }, [index, scrollTriggerRef]);

  return (
    <primitive 
      ref={groupRef} 
      object={clonedScene} 
      position={[0, -10, 0]} 
      scale={2.5} 
    />
  );
}

export default function PhoneScene({ containerRef }) {
  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <Suspense fallback={null}>
          {[0, 1, 2, 3, 4].map((i) => (
            <MobileModel 
              key={i} 
              index={i} 
              scrollTriggerRef={containerRef} 
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}