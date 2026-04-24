import React, { useLayoutEffect, useRef, Suspense, useEffect, useMemo } from "react";
import * as THREE from "three"; 
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, Environment, PresentationControls } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroVideo from "../assets/hero-video.mp4";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
useGLTF.preload("/iphone_17_pro.glb");
useGLTF.preload("/metal_credit_card.glb");

function pseudoRandom(index, salt = 0) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

// --- Scattered Cards Component ---
function ScatteredCards({ sectionRef }) {
  const { scene: cardScene } = useGLTF("/metal_credit_card.glb");
  const meshRef = useRef();
  const rotationStateRef = useRef([]);
  const cardCount = 24; 
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  const cardGeometry = useMemo(() => {
    let geo = null;
    cardScene.traverse((child) => { if (child.isMesh && !geo) geo = child.geometry; });
    return geo;
  }, [cardScene]);

  const cardMaterial = useMemo(() => {
    let mat = null;
    cardScene.traverse((child) => { if (child.isMesh && !mat) mat = child.material; });
    return mat;
  }, [cardScene]);

  const scatterData = useMemo(() => {
    return Array.from({ length: cardCount }).map((_, index) => ({
      x: 0,
      y: -2,
      z: -15, 
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      targetX: (pseudoRandom(index, 1) - 0.5) * 45,
      targetY: (pseudoRandom(index, 2) - 0.5) * 30,
      targetZ: (pseudoRandom(index, 3) - 0.5) * 20 - 5,
      targetRotX: pseudoRandom(index, 4) * Math.PI * 2,
      targetRotY: pseudoRandom(index, 5) * Math.PI * 2,
      targetRotZ: pseudoRandom(index, 6) * Math.PI * 2,
      driftSpeed: pseudoRandom(index, 7) * 0.4 + 0.1,
      rotSpeedX: (pseudoRandom(index, 8) - 0.5) * 0.015,
      rotSpeedY: (pseudoRandom(index, 9) - 0.5) * 0.015,
    }));
  }, [cardCount]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    rotationStateRef.current = scatterData.map((data) => ({
      rotX: data.rotX,
      rotY: data.rotY,
      rotZ: data.rotZ,
    }));

    const ctx = gsap.context(() => {
      scatterData.forEach((data) => {
        gsap.to(data, {
          x: data.targetX,
          y: data.targetY,
          z: data.targetZ,
          rotX: data.targetRotX,
          rotY: data.targetRotY,
          rotZ: data.targetRotZ,
          duration: 1.8, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 95%", 
            toggleActions: "play none none none"
          }
        });
      });

      gsap.to(meshRef.current.position, {
        y: 5, 
        z: 2, 
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom", 
          end: "bottom top",       
          scrub: 1.5,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [scatterData, sectionRef]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < cardCount; i++) {
      const data = scatterData[i];
      const rotationState = rotationStateRef.current[i];
      rotationState.rotX += data.rotSpeedX;
      rotationState.rotY += data.rotSpeedY;
      tempObject.position.set(data.x, data.y + Math.sin(time * data.driftSpeed + i) * 1.2, data.z);
      tempObject.rotation.set(rotationState.rotX, rotationState.rotY, rotationState.rotZ);
      tempObject.scale.set(0.12, 0.12, 0.12);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[cardGeometry, cardMaterial, cardCount]} />
    </group>
  );
}

// --- Interactive Card Ring ---
function InteractiveCard({ cardRef }) {
  const { scene } = useGLTF("/metal_credit_card.glb");
  const meshRef = useRef();
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const cardCount = 14;
  const ringRadius = 3.8;

  const cardGeometry = useMemo(() => {
    let geo = null;
    scene.traverse((child) => { if (child.isMesh && !geo) geo = child.geometry; });
    return geo;
  }, [scene]);

  const cardMaterial = useMemo(() => {
    let mat = null;
    scene.traverse((child) => { if (child.isMesh && !mat) mat = child.material; });
    return mat;
  }, [scene]);

  useLayoutEffect(() => {
    if (!meshRef.current || !cardGeometry) return;
    for (let i = 0; i < cardCount; i++) {
      const angle = (i / cardCount) * Math.PI * 2;
      tempObject.position.set(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0);
      tempObject.rotation.set(0, angle + Math.PI / 2, Math.PI / 2);
      tempObject.scale.set(0.12, 0.12, 0.12);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [cardGeometry, tempObject]);

  useFrame((state, delta) => {
    if (meshRef.current) { meshRef.current.rotation.z += delta * 0.1; }
  });

  if (!cardGeometry) return null;

  return (
    <group ref={cardRef} position={[5.5, 0, 0]} scale={[0, 0, 0]}>
      <PresentationControls global={false} cursor={true} snap={true} speed={1} zoom={1} polar={[-Math.PI / 10, Math.PI / 10]} azimuth={[-Math.PI / 10, Math.PI / 10]}>
        <instancedMesh ref={meshRef} args={[cardGeometry, cardMaterial, cardCount]} />
      </PresentationControls>
    </group>
  );
}

function PhoneCluster({ scrollTriggerRef, insideTextRef }) {
  const { scene } = useGLTF("/iphone_17_pro.glb");
  const clusterRef = useRef();
  const phoneRefs = useRef([]);
  const cardRef = useRef();
  const createPhone = () => scene.clone();

  useLayoutEffect(() => {
    if (!clusterRef.current) return;
    const phones = phoneRefs.current.filter(Boolean);
    const radius = 4.8;
    const angles = phones.map((_, index) => ((index - 2) / 5) * Math.PI * 2 + Math.PI / 2);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTriggerRef.current,
        start: "top top",
        end: "+=5500", 
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    gsap.set(phones[2].scale, { x: 30, y: 30, z: 30 });
    gsap.set(phones[2].position, { x: 0, y: 0, z: radius });

    phones.forEach((phone, index) => {
      if (index !== 2) {
        gsap.set(phone.scale, { x: 0, y: 0, z: 0 });
        gsap.set(phone.position, { x: 0, y: 0, z: radius - 0.5 });
      }
    });

    phones.forEach((phone, index) => {
      tl.to(phone.scale, { x: 26, y: 26, z: 26, duration: 0.8 }, 0);
      tl.to(phone.position, { x: Math.cos(angles[index]) * radius, z: Math.sin(angles[index]) * radius, duration: 1.2 }, 0.2);
    });

    tl.to(clusterRef.current.rotation, { y: Math.PI * 2, duration: 3, ease: "power1.inOut" }, 1.5);
    tl.to(phones[2].position, { x: 0, z: radius, duration: 1.5 }, 4.5);
    phones.forEach((phone, index) => { if (index !== 2) tl.to(phone.position, { x: 0, z: radius - 1.5, duration: 1.5 }, 4.5); });
    tl.to(phones[2].position, { z: 25, duration: 2, ease: "expo.in" }, 6.0);
    tl.to(phones[2].scale, { x: 300, y: 300, z: 300, duration: 2, ease: "expo.in" }, 6.0);
    phones.forEach((phone, index) => { if (index !== 2) tl.to(phone.scale, { x: 0, y: 0, z: 0, duration: 0.5 }, 6.0); });
    
    tl.to(cardRef.current.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.2)" }, 7.5);
    if (insideTextRef?.current) { tl.to(insideTextRef.current, { autoAlpha: 1, y: 0, duration: 1 }, 7.5); }

    tl.to(cardRef.current.position, { x: 0, z: 25, duration: 2.5, ease: "power2.in" }, 9.5);
    tl.to(cardRef.current.scale, { x: 4, y: 4, z: 4, duration: 2.5, ease: "power2.in" }, 9.5);
    if (insideTextRef?.current) { tl.to(insideTextRef.current, { autoAlpha: 0, y: -40, duration: 1.5 }, 9.5); }

    return () => { if (tl.scrollTrigger) tl.scrollTrigger.kill(); };
  }, [scene, scrollTriggerRef, insideTextRef]);

  return (
    <group position={[0, -1, 0]}>
      <group ref={clusterRef}>
        {Array.from({ length: 5 }, (_, index) => (
          <group key={index} ref={(node) => { phoneRefs.current[index] = node; }}>
            <primitive object={createPhone()} />
          </group>
        ))}
      </group>
      <InteractiveCard cardRef={cardRef} />
    </group>
  );
}

export default function Home() {
  const storySectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const phoneSectionRef = useRef(null);
  const scatterSectionRef = useRef(null); 
  const scatterTextRef = useRef(null);
  const featureSectionRef = useRef(null);
  const featureHeaderRef = useRef(null);
  const featureRowsRef = useRef([]);
  const heroVideoRef = useRef(null);
  const insideTextRef = useRef(null);

  const storyText = "the story of CRED begins with trust. we believe individuals who've proven their trustworthiness deserve better: better experiences, better rewards, better rules. this is the status quo we're building. make it to the club, and experience the ascension yourself.";

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const words = textContainerRef.current.querySelectorAll(".word");
      gsap.to(words, {
        color: "white",
        stagger: 0.1,
        scrollTrigger: {
          trigger: storySectionRef.current,
          start: "top 30%",
          end: "bottom 80%",
          scrub: 1,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!scatterTextRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        scatterTextRef.current,
        { autoAlpha: 0, y: 40, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: scatterSectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, scatterSectionRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!featureSectionRef.current) return;

    const ctx = gsap.context(() => {
      const rows = featureRowsRef.current.filter(Boolean);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: featureSectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        featureHeaderRef.current,
        { autoAlpha: 0, y: 18, letterSpacing: "0.55em" },
        {
          autoAlpha: 1,
          y: 0,
          letterSpacing: "0.42em",
          duration: 0.7,
          ease: "power3.out",
        }
      );

      rows.forEach((row, index) => {
        const content = row.querySelector('.row-content');
        const line = row.querySelector('.row-line');

        tl.fromTo(content, 
          { y: 120, autoAlpha: 0 }, 
          { y: 0, autoAlpha: 1, duration: 1.1, ease: "power4.out" },
          index === 0 ? ">-0.4" : "-=0.9"
        )
        .fromTo(line, 
          { scaleX: 0 }, 
          { scaleX: 1, duration: 1.3, ease: "expo.out" }, 
          "<0.2"
        );
      });
    }, featureSectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.playbackRate = 0.5;
      heroVideoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <main className="w-full bg-black">
      <section className="relative min-h-screen w-full overflow-hidden text-white">
        <div className="absolute inset-0">
          <video ref={heroVideoRef} className="h-full w-full object-cover" src={heroVideo} autoPlay muted loop playsInline preload="auto" />
        </div>
        <div className="absolute inset-0 bg-black/40" />
        <header className="relative z-20 flex items-start justify-between px-5 pt-4 sm:px-10 lg:px-16">
          <Logo />
        </header>
        <div className="relative z-10 flex min-h-[80vh] items-center justify-center px-5 text-center">
          <h1 className="mx-auto max-w-[11ch] text-[clamp(3.5rem,8vw,8rem)] font-semibold leading-[0.88] tracking-[-0.06em] font-serif">crafted for the creditworthy</h1>
        </div>
      </section>

      <section ref={storySectionRef} className="relative min-h-screen bg-black text-white flex items-center">
        <div className="w-full px-6 sm:px-10 lg:px-24">
          <div ref={textContainerRef} className="max-w-[1100px]">
            <p className="font-serif text-[clamp(2.1rem,4.5vw,4.5rem)] leading-[1.4] text-[#4a5160]">
              {storyText.split(" ").map((word, index) => (
                <span key={index} className="word inline-block mr-[0.25em]">{word}</span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section ref={phoneSectionRef} className="relative h-screen bg-black overflow-hidden">
        <div className="h-full w-full">
          <Canvas dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}>
            <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={35} />
            <ambientLight intensity={1.8} />
            <Environment preset="city" />
            <Suspense fallback={null}>
              <PhoneCluster scrollTriggerRef={phoneSectionRef} insideTextRef={insideTextRef} />
            </Suspense>
          </Canvas>
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
            <div ref={insideTextRef} className="max-w-[550px]" style={{ opacity: 0, transform: "translateY(40px)" }}>
              <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.1] text-white mb-6">do more with<br />your credit cards</h2>
              <p className="text-gray-400 text-[1.05rem] leading-relaxed max-w-[480px]">manage your credit cards better and improve your credit score: receive payment reminders, uncover hidden fees, get spending insights, and discover ways to maximize card benefits.</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={scatterSectionRef} className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 h-full w-full">
          <Canvas dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}>
            <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={40} />
            <ambientLight intensity={1.5} />
            <Environment preset="city" />
            <Suspense fallback={null}>
              <ScatteredCards sectionRef={scatterSectionRef} />
            </Suspense>
          </Canvas>
        </div>

        <div ref={scatterTextRef} className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl group cursor-default" style={{ opacity: 0 }}>
          <div className="mb-10 transition-opacity duration-700 ease-out opacity-20 group-hover:opacity-100">
             <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 0L5 10V30C5 45.42 15.67 59.7 30 65C44.33 59.7 55 45.42 55 30V10L30 0Z" stroke="white" strokeWidth="2" />
                <rect x="22" y="32" width="16" height="12" rx="2" stroke="white" strokeWidth="2" />
                <path d="M26 32V28C26 25.7909 27.7909 24 30 24C32.2091 24 34 25.7909 34 28V32" stroke="white" strokeWidth="2" />
             </svg>
          </div>

          <h3 className="text-white text-[clamp(0.8rem,2vw,1.1rem)] tracking-[0.4em] font-bold uppercase mb-12 transition-opacity duration-700 ease-out opacity-20 group-hover:opacity-100">
            your data isn't our business. keeping it safe is.
          </h3>

          <p className="text-[clamp(1.8rem,4vw,3.5rem)] leading-[1.3] text-white transition-opacity duration-1000 ease-in-out font-light opacity-20 group-hover:opacity-100">
            all your personal <span className="font-semibold">data</span> and transactions <span className="font-semibold">are encrypted</span> and secured. there's <span className="font-semibold">no room for</span> mistakes because we <span className="font-semibold">didn't leave any.</span>
          </p>
        </div>
      </section>

      {/* CREATIVE ANIMATED FEATURE SECTION */}
      <section ref={featureSectionRef} className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-32">
          <div className="mb-20 flex items-center gap-6">
            <span className="h-[1px] flex-1 bg-white/10" />
            <span ref={featureHeaderRef} className="text-[0.7rem] font-bold tracking-[0.5em] uppercase text-white/40">the experience</span>
            <span className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div className="flex flex-col">
            {[
              { id: 0, title: "track", desc: "track your spends, credit limit, bills, and due dates.", icon: <path d="M22 70L62 30 M62 30H45 M62 30V47" stroke="white" strokeWidth="5" strokeLinecap="round" /> },
              { id: 1, title: "savor", desc: "shop smarter by browsing card offers & benefits.", icon: <path d="M30 35H62V69H30V35Z M38 35V26C38 19.3726 43.3726 14 50 14C56.6274 14 62 19.3726 62 26V35" stroke="white" strokeWidth="5" /> },
              { id: 2, title: "reflect", desc: "get insights on your spends and access to monthly statements.", icon: <path d="M20 24h18v44H20z M54 24h18v44H54z M46 18v56" stroke="white" strokeWidth="5" strokeDasharray="4 4" /> }
            ].map((item, i) => (
              <div 
                key={i} 
                ref={(node) => { featureRowsRef.current[i] = node; }} 
                className="relative overflow-hidden group"
              >
                <div className="row-content grid gap-10 py-16 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="max-w-xl">
                    <h3 className="font-sans text-[clamp(3.5rem,7vw,6rem)] font-bold italic leading-[0.85] tracking-[-0.07em] uppercase transition-colors duration-500 group-hover:text-white text-white/90">
                      {item.title}
                    </h3>
                    <p className="mt-8 max-w-[32ch] text-[clamp(1.1rem,1.5vw,1.35rem)] leading-[1.6] text-white/50 font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex justify-start md:justify-end opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    <svg width="100" height="100" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {item.icon}
                    </svg>
                  </div>
                </div>
                {/* STAGGERED LINE ANIMATION */}
                <div className="row-line absolute bottom-0 left-0 h-[1px] w-full bg-white/20 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-[50vh] bg-black" />
    </main>
  );
}

function Logo() {
  return (
    <div className="flex flex-col items-start gap-2 hero-fade-up">
      <div className="text-white text-4xl leading-none font-bold">◫</div>
      <div className="text-white text-[1.65rem] tracking-[0.15em] font-semibold">CRED</div>
    </div>
  );
}

function MenuIcon() {
  return (
    <div className="flex flex-col gap-2">
      <span className="block h-[2px] w-8 bg-white" />
      <span className="block h-[2px] w-8 bg-white" />
      <span className="block h-[2px] w-8 bg-white" />
    </div>
  );
}
