import { useEffect, useRef, useState, Suspense } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Html } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// â”€â”€â”€ PHONE SCREEN CONTENT (premium CRED-style) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function PhoneScreenContent({ word = "friends", dark = false }) {
  if (dark) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#050505",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#ffffff",
        fontFamily: "Georgia, 'Times New Roman', serif",
        position: "relative",
        overflow: "hidden",
        padding: "3rem 2.4rem 2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.1,
        }}
        viewBox="0 0 390 780"
        fill="none"
      >
        {Array.from({ length: 22 }, (_, i) => (
          <path
            key={i}
            d={`M ${-60 + i * 26} 0 Q ${80 + i * 18} ${200 + i * 12} ${-40 + i * 28} 780`}
            stroke="#000"
            strokeWidth="0.8"
            fill="none"
          />
        ))}
      </svg>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
          fontFamily: "sans-serif",
          fontWeight: 600,
          color: "#111",
          marginBottom: "2.5rem",
          position: "relative",
          zIndex: 1,
          letterSpacing: "-0.02em",
        }}
      >
        <span>9:41</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <svg width="18" height="12" viewBox="0 0 18 12">
            <rect x="0" y="3" width="3" height="9" rx="1" fill="#111" />
            <rect x="4.5" y="2" width="3" height="10" rx="1" fill="#111" />
            <rect x="9" y="0" width="3" height="12" rx="1" fill="#111" />
            <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12">
            <path
              d="M8 2.4C10.8 2.4 13.2 3.5 14.9 5.2L16 4.1C13.9 2 11.1.8 8 .8 4.9.8 2.1 2 0 4.1l1.1 1.1C2.8 3.5 5.2 2.4 8 2.4z"
              fill="#111"
            />
            <path
              d="M8 5.6c1.8 0 3.4.7 4.6 1.9l1.1-1.1C12.2 4.9 10.2 4 8 4s-4.2.9-5.7 2.4l1.1 1.1C4.6 6.3 6.2 5.6 8 5.6z"
              fill="#111"
            />
            <circle cx="8" cy="10" r="1.5" fill="#111" />
          </svg>
          <svg width="28" height="13" viewBox="0 0 28 13">
            <rect x="0" y="1" width="24" height="11" rx="3" stroke="#111" strokeWidth="1.2" />
            <rect x="1.5" y="2.5" width="18" height="8" rx="2" fill="#111" />
            <rect x="25" y="4" width="2.5" height="5" rx="1.5" fill="#111" opacity=".5" />
          </svg>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
        <p
          style={{
            fontSize: 13,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#888",
            fontFamily: "sans-serif",
            fontWeight: 500,
            marginBottom: "1.2rem",
          }}
        >
          CRED UPI
        </p>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            color: "#0a0a0a",
            marginBottom: "2rem",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          send
          <br />
          money
          <br />
          to {word}
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "#666",
            lineHeight: 1.65,
            fontFamily: "sans-serif",
            fontWeight: 400,
            maxWidth: 280,
            letterSpacing: "-0.01em",
          }}
        >
          pay anyone, no matter what app they're on: works with contacts, phone numbers, or UPI IDs.
        </p>
      </div>

      <div style={{ position: "relative", zIndex: 1, paddingBottom: "1.5rem" }}>
        <div
          style={{
            background: "#0a0a0a",
            color: "#fff",
            borderRadius: 100,
            padding: "1.4rem 2rem",
            textAlign: "center",
            fontSize: 17,
            fontFamily: "sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            marginBottom: "1rem",
          }}
        >
          Pay with CRED UPI
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          {["â—ˆ Contacts", "# Phone", "â¬¡ UPI ID"].map((l) => (
            <div
              key={l}
              style={{
                fontSize: 12,
                color: "#999",
                fontFamily: "sans-serif",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ iPHONE GLB MODEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function IPhoneModel({ word, dark }) {
  const { scene } = useGLTF("/iphone_17_pro.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (m.metalness !== undefined) {
            m.metalness = Math.max(m.metalness, 0.88);
            m.roughness = Math.min(m.roughness ?? 0.12, 0.14);
            m.envMapIntensity = 3;
          }
        });
      }
    });
  }, [scene]);

  return (
    <group>
      <primitive object={scene} />
      <Html
        transform
        occlude={false}
        position={[0, 0.18, 0.072]}
        rotation={[0, 0, 0]}
        scale={0.094}
        style={{
          width: 390,
          height: 780,
          overflow: "hidden",
          borderRadius: "2.8rem",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <PhoneScreenContent word={word} dark={dark} />
      </Html>
    </group>
  );
}

export function ScrollPhone({ prog }) {
  const groupRef = useRef(null);
  const [word, setWord] = useState("friends");
  const wordRef = useRef("friends");
  const [dark, setDark] = useState(false);
  const darkRef = useRef(false);

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeOutBack = (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };

  useFrame((state) => {
    if (!groupRef.current) return;

    const p = prog.current;
    const t = state.clock.elapsedTime;

    const nextWord = p < 0.44 ? "friends" : p < 0.69 ? "family" : "anyone";
    const nextDark = p >= 0.84;

    if (wordRef.current !== nextWord) {
      wordRef.current = nextWord;
      setWord(nextWord);
    }

    if (darkRef.current !== nextDark) {
      darkRef.current = nextDark;
      setDark(nextDark);
    }

    let targetX = 0;
    let targetY = -8.85;
    let targetZ = 0.18;
    let targetScale = 0.24;
    let targetRotX = 0.05;
    let targetRotY = 0.08;
    let targetRotZ = 0.04;

    if (p < 0.24) {
      const n = p / 0.24;
      const e = easeOutCubic(n);

      targetX = 0;
      targetY = -8.85 + e * 0.18;
      targetZ = 0.18;
      targetScale = 0.24 + e * 0.02;
      targetRotX = 0.05 - e * 0.01;
      targetRotY = 0.08;
      targetRotZ = 0.04;
    } else if (p < 0.55) {
      const n = (p - 0.24) / 0.31;
      const e = easeOutBack(Math.min(Math.max(n, 0), 1));

      targetX = 0;
      targetY = -8.72 + e * 7.95;
      targetZ = 0.16;
      targetScale = 0.28 + e * 1.05;
      targetRotX = 0.04 - e * 0.06;
      targetRotY = 0.08 - e * 0.08;
      targetRotZ = 0.04 - e * 0.09;
    } else if (p < 0.84) {
      const n = (p - 0.55) / 0.29;
      const e = easeOutCubic(Math.min(Math.max(n, 0), 1));

      targetX = 0;
      targetY = -0.78 + Math.sin(t * 0.35) * 0.01;
      targetZ = 0.14;
      targetScale = 1.33 + e * 0.62;
      targetRotX = Math.sin(t * 0.12) * 0.01;
      targetRotY = Math.sin(t * 0.14) * 0.014;
      targetRotZ = Math.sin(t * 0.1) * 0.01;
    } else {
      const n = Math.min((p - 0.84) / 0.16, 1);
      targetX = 0;
      targetY = -0.96;
      targetZ = 0.1;
      targetScale = 2.02 + n * 0.2;
      targetRotX = -0.01;
      targetRotY = 0.02;
      targetRotZ = 0.01;
    }

    const lerpK = 0.12;

    groupRef.current.position.x += (targetX - groupRef.current.position.x) * lerpK;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * lerpK;
    groupRef.current.position.z += (targetZ - groupRef.current.position.z) * lerpK;

    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * lerpK;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * lerpK;
    groupRef.current.rotation.z += (targetRotZ - groupRef.current.rotation.z) * lerpK;

    const s = groupRef.current.scale.x;
    groupRef.current.scale.setScalar(s + (targetScale - s) * lerpK);
  });

  return (
    <group ref={groupRef} position={[0, -8.85, 0.18]} scale={0.24}>
      <Suspense fallback={null}>
        <IPhoneModel word={word} dark={dark} />
      </Suspense>
    </group>
  );
}

export function CinematicCamera({ prog }) {
  const { camera } = useThree();

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  useFrame((state) => {
    const p = prog.current;
    const t = state.clock.elapsedTime;

    let tx = 0;
    let ty = 0.16;
    let tz = 7.35;
    let lx = 0;
    let ly = 0.02;

    if (p < 0.24) {
      const n = p / 0.24;
      const e = easeOutCubic(n);
      tx = 0;
      ty = 0.16 - e * 0.03;
      tz = 7.35 - e * 0.28;
      lx = 0;
      ly = 0.02;
    } else if (p < 0.55) {
      const n = (p - 0.24) / 0.31;
      const e = easeOutCubic(Math.min(Math.max(n, 0), 1));
      tx = 0;
      ty = 0.12 - e * 0.12;
      tz = 7.05 - e * 1.75;
      lx = 0;
      ly = 0;
    } else if (p < 0.84) {
      const n = (p - 0.55) / 0.29;
      const e = easeOutCubic(Math.min(Math.max(n, 0), 1));
      tx = 0;
      ty = 0.0 - e * 0.08;
      tz = 5.3 - e * 1.35;
      lx = 0;
      ly = -0.02;
    } else {
      const n = Math.min((p - 0.84) / 0.16, 1);
      tx = 0;
      ty = -0.08 - n * 0.04;
      tz = 3.95 - n * 0.35;
      lx = 0;
      ly = -0.08;
    }

    const k = 0.055;
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    camera.position.z += (tz - camera.position.z) * k;
    camera.lookAt(lx, ly, 0);
  });

  return null;
}

export function PhonePortal() {
  const sectionRef = useRef(null);
  const prog = useRef(0);

  const topTextRef = useRef(null);
  const bottomTextRef = useRef(null);
  const centerGlowRef = useRef(null);
  const whyWrapRef = useRef(null);
  const chipsRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const withTarget = (target, fn) => {
      if (!target) return;
      fn(target);
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=250%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          prog.current = self.progress;
        },
      },
    });

    withTarget(topTextRef.current, (target) => {
      tl.to(target, { y: -150, opacity: 0, duration: 0.2, ease: "none" }, 0.12);
    });
    withTarget(bottomTextRef.current, (target) => {
      tl.to(target, { y: 150, opacity: 0, duration: 0.2, ease: "none" }, 0.12);
    });
    withTarget(centerGlowRef.current, (target) => {
      tl.fromTo(target, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1.08, duration: 0.18, ease: "none" }, 0.24);
    });
    withTarget(chipsRef.current, (target) => {
      tl.fromTo(target, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.18, ease: "none" }, 0.3);
      tl.to(target, { opacity: 0, y: -12, duration: 0.12, ease: "none" }, 0.78);
    });
    withTarget(whyWrapRef.current, (target) => {
      tl.fromTo(target, { opacity: 0, y: 24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "none" }, 0.82);
    });

    return () => {
      tl.kill();
      tl.scrollTrigger?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portal"
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#070708",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 52% 52% at 50% 52%, rgba(181,255,77,0.08) 0%, transparent 70%), linear-gradient(to bottom, rgba(255,255,255,0.02), transparent 30%, transparent 70%, rgba(0,0,0,0.25))",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "10vh",
          transform: "translateX(-50%)",
          zIndex: 2,
          textAlign: "center",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          ref={topTextRef}
          style={{
            fontSize: "clamp(40px,6vw,92px)",
            fontFamily: "'Bebas Neue', sans-serif",
            color: "#f0f0f0",
            lineHeight: 1,
            letterSpacing: "0.01em",
            opacity: 1,
          }}
        >
          Not just visuals.
        </div>
        <div
          ref={bottomTextRef}
          style={{
            marginTop: "1rem",
            fontSize: "clamp(16px,1.5vw,20px)",
            fontFamily: "'DM Sans', sans-serif",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            opacity: 1,
          }}
        >
          A smooth money story.
        </div>
      </div>

      <div
        ref={centerGlowRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(181,255,77,0.18) 0%, rgba(181,255,77,0.07) 18%, transparent 42%)",
          filter: "blur(18px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
        }}
      >
        <Canvas
          dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
          style={{ background: "transparent" }}
          camera={{ position: [0, 0.18, 7.5], fov: 42 }}
        >
          <ambientLight intensity={0.85} />
          <directionalLight position={[4, 8, 6]} intensity={2.2} color="#ffffff" />
          <directionalLight position={[-4, 2, 4]} intensity={1} color="#b5ff4d" />
          <pointLight position={[2, -2, 3]} intensity={1.3} color="#ffffff" />
          <spotLight
            position={[0, 10, 4]}
            angle={0.35}
            penumbra={0.7}
            intensity={2.6}
            color="#ffffff"
          />

          <CinematicCamera prog={prog} />
          <ScrollPhone prog={prog} />
          <Environment preset="city" />
        </Canvas>
      </div>

      <div
        ref={whyWrapRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0,
        }}
      >
        <div style={{ textAlign: "center", transform: "translateY(18px)" }}>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(48px,7vw,112px)",
              lineHeight: 0.95,
              letterSpacing: "0.02em",
              color: "#f3f3f3",
              textShadow: "0 0 36px rgba(181,255,77,0.18)",
            }}
          >
            WHY US
          </div>
          <div
            style={{
              marginTop: "1rem",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(12px,1.1vw,15px)",
              color: "rgba(255,255,255,0.62)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Built for trust, motion, and clarity
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 6,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(7,7,8,0.12) 0%, transparent 18%, transparent 78%, rgba(7,7,8,0.62) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 180,
          zIndex: 7,
          background: "linear-gradient(to top, #080808 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}

export function Hero() {
  const sectionRef = useRef(null);
  const videoWrapRef = useRef(null);
  const videoRef = useRef(null);
  const glowRef = useRef(null);
  const contentRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const hintRef = useRef(null);
  const scrollLineRef = useRef(null);
  const titleRevealRef = useRef(null);
  const titleRevealEyebrowRef = useRef(null);
  const titleRevealHeadingRef = useRef(null);
  const titleRevealSubRef = useRef(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
    const section = sectionRef.current;
    const onMove = (e) => {
      if (!glowRef.current || !section) return;
      const r = section.getBoundingClientRect();
      gsap.to(glowRef.current, {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        duration: 0.6,
        ease: "power2.out",
      });
    };
    section?.addEventListener("mousemove", onMove);

    const entryTl = gsap.timeline({ delay: 0.2 });
    const withTarget = (target, fn) => {
      if (!target) return;
      fn(target);
    };
    withTarget(videoWrapRef.current, (target) => {
      entryTl.fromTo(target, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" });
    });
    withTarget(eyebrowRef.current, (target) => {
      entryTl.fromTo(target, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.6");
    });
    withTarget(headingRef.current, (target) => {
      entryTl.fromTo(target, { opacity: 0, y: 40, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power4.out" }, "-=0.5");
    });
    withTarget(subRef.current, (target) => {
      entryTl.fromTo(target, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");
    });
    withTarget(scrollLineRef.current, (target) => {
      entryTl.fromTo(target, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out" }, "-=0.4");
    });
    withTarget(hintRef.current, (target) => {
      entryTl.fromTo(target, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.6");
    });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 0.55)}`,
        scrub: 0.8,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    scrollTl
      .to(
        videoWrapRef.current,
        {
          scale: 0.12,
          y: "-10vh",
          rotateZ: -7,
          borderRadius: "2.5rem",
          ease: "none",
          duration: 0.75,
        },
        0,
      )
      .to(
        hintRef.current,
        {
          opacity: 0,
          y: -8,
          duration: 0.12,
          ease: "none",
        },
        0.05,
      )
      .to(
        glowRef.current,
        {
          opacity: 0,
          duration: 0.1,
          ease: "none",
        },
        0.08,
      )
      .to(
        videoWrapRef.current,
        {
          opacity: 0,
          duration: 0.12,
          ease: "none",
        },
        0.82,
      )
      .to(
        contentRef.current,
        { opacity: 0, duration: 0.12, ease: "none" },
        0.84,
      )
      .to(
        titleRevealRef.current,
        { opacity: 1, duration: 0.08, ease: "none" },
        0.86,
      )
      .to(
        [titleRevealEyebrowRef.current, titleRevealHeadingRef.current, titleRevealSubRef.current],
        { opacity: 1, duration: 0.08, ease: "none" },
        0.86,
      );

    return () => {
      section?.removeEventListener("mousemove", onMove);
      entryTl.kill();
      scrollTl.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100vh] overflow-hidden flex items-center justify-center"
      style={{ background: "var(--black,#080808)" }}
    >
      <div
        ref={titleRevealRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0, zIndex: 5, willChange: "opacity" }}
      >
        <div className="flex flex-col items-center text-center px-6 select-none">
          <p
            ref={titleRevealEyebrowRef}
            style={{
              fontSize: "clamp(10px,1.1vw,13px)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#fff",
              fontFamily: "'DM Sans',sans-serif",
              opacity: 0,
              marginBottom: "2rem",
              fontWeight: 500,
            }}
          >
            CRED
          </p>
          <h1
            ref={titleRevealHeadingRef}
            style={{
              fontFamily: "Georgia,'Times New Roman',serif",
              fontSize: "clamp(56px,9vw,126px)",
              lineHeight: 0.9,
              color: "#fff",
              letterSpacing: "-0.02em",
              opacity: 0,
              textShadow: "0 4px 38px rgba(0,0,0,0.65)",
            }}
          >
            payments, for the <br />
            ones with taste.
          </h1>
          <p
            ref={titleRevealSubRef}
            style={{
              fontSize: "clamp(12px,1.15vw,15px)",
              color: "rgba(255,255,255,0.9)",
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 300,
              letterSpacing: "0.02em",
              opacity: 0,
              marginTop: "1.75rem",
              maxWidth: 860,
            }}
          >
            CRED is a members-only club that enables the trustworthy to make financial progress
          </p>
        </div>
      </div>

      <div
        ref={glowRef}
        className="absolute pointer-events-none z-0"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(181,255,77,0.09) 0%, transparent 70%)",
          transform: "translate(-50%,-50%)",
          willChange: "transform",
        }}
      />
      <div
        ref={videoWrapRef}
        className="absolute inset-0 z-10 overflow-hidden"
        style={{
          transformOrigin: "center center",
          willChange: "transform,opacity",
          opacity: 1,
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.55) 52%, rgba(8,8,8,0.92) 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
            opacity: 0.45,
          }}
        />
        <video
          ref={videoRef}
          src="/video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />
      </div>
      <div
        ref={contentRef}
        className="relative z-20 flex flex-col items-center text-center px-6 select-none"
        style={{ willChange: "transform,opacity", opacity: 1 }}
      >
        <p
          ref={eyebrowRef}
          style={{
            fontSize: "clamp(10px,1.1vw,13px)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "white",
            fontFamily: "'DM Sans',sans-serif",
            opacity: 1,
            marginBottom: "2rem",
            fontWeight: 500,
          }}
        >
          CRED
        </p>
        <h1
          ref={headingRef}
          style={{
            fontFamily: "Georgia,'Times New Roman',serif",
            fontSize: "clamp(56px,9vw,126px)",
            lineHeight: 0.9,
            color: "#fff",
            letterSpacing: "-0.02em",
            opacity: 1,
            textShadow: "0 4px 38px rgba(0,0,0,0.65)",
          }}
        >
          payments, for the <br />
          ones with taste.
        </h1>
        <p
          ref={subRef}
          style={{
            fontSize: "clamp(12px,1.15vw,15px)",
            color: "rgba(255,255,255,0.9)",
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 300,
            letterSpacing: "0.02em",
            opacity: 1,
            marginTop: "1.75rem",
            maxWidth: 860,
          }}
        >
          CRED is a members-only club that enables the trustworthy to make financial progress
        </p>
        <div
          className="hidden md:block mt-10"
          style={{
            width: 1,
            height: 48,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.95), transparent)",
            opacity: 0.4,
          }}
        />
      </div>
      <div
        ref={hintRef}
        className="absolute bottom-10 left-[8vw] flex items-center gap-4 z-20"
        style={{ opacity: 0 }}
      >
        <div
          ref={scrollLineRef}
          className="h-px"
          style={{
            width: 60,
            background: "rgba(255,255,255,0.95)",
            transformOrigin: "left center",
            transform: "scaleX(0)",
          }}
        />
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.58)",
            textTransform: "uppercase",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Scroll to explore
        </span>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none"
        style={{
          height: 180,
          background: "linear-gradient(to top, var(--black,#080808) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}

// â”€â”€â”€ HORIZONTAL SERVICES (unchanged) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function ServicesHScroll() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const slides = [
    {
      num: "01",
      tag: "01 / 03 â€” Design",
      title: ["UI/UX", "Design"],
      desc: "We don't design screens. We design how people feel while using them. Every pixel carries intention.",
      accent: "rgba(181,255,77,0.05)",
    },
    {
      num: "02",
      tag: "02 / 03 â€” Engineering",
      title: ["Frontend", "Dev"],
      desc: "Fast. Fluid. Alive. Every interaction matters. We build interfaces that feel inevitable.",
      accent: "rgba(100,200,255,0.04)",
    },
    {
      num: "03",
      tag: "03 / 03 â€” Motion",
      title: ["3D &", "Motion"],
      desc: "Because static is forgettable. We make your brand breathe, move, and command attention.",
      accent: "rgba(255,100,150,0.04)",
    },
  ];
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const scrollDist = () => viewport.offsetWidth * (slides.length - 1);
    const st = ScrollTrigger.create({
      trigger: viewport,
      start: "top top",
      end: () => `+=${scrollDist()}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      animation: gsap.to(track, { x: () => -scrollDist(), ease: "none" }),
    });
    return () => st.kill();
  }, []);
  return (
    <div
      ref={viewportRef}
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "var(--black,#080808)",
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          width: `${slides.length * 100}vw`,
          height: "100%",
          willChange: "transform",
        }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            style={{
              width: "100vw",
              height: "100%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              padding: "0 8vw",
              position: "relative",
              overflow: "hidden",
              background: "var(--black,#080808)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse 60% 60% at 20% 50%, ${s.accent} 0%, transparent 60%)`,
                pointerEvents: "none",
              }}
            />
            <span
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(120px,20vw,240px)",
                color: "rgba(181,255,77,0.06)",
                position: "absolute",
                right: "6vw",
                top: "50%",
                transform: "translateY(-50%)",
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {s.num}
            </span>
            <div style={{ maxWidth: "55vw", position: "relative", zIndex: 1 }}>
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  color: "var(--green,#b5ff4d)",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                  display: "block",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {s.tag}
              </span>
              <div style={{ width: 80, height: 1, background: "var(--green,#b5ff4d)", marginBottom: "3rem" }} />
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(52px,7vw,108px)", lineHeight: 0.95, marginBottom: "2rem", color: "#fff" }}>
                {s.title[0]}
                <br />
                {s.title[1]}
              </h2>
              <p style={{ fontSize: "clamp(16px,1.4vw,20px)", fontWeight: 300, color: "#888", lineHeight: 1.7, maxWidth: 500, fontFamily: "'DM Sans',sans-serif" }}>
                {s.desc}
              </p>
            </div>
            <div style={{ position: "absolute", bottom: "2.5rem", right: "8vw", display: "flex", gap: "0.5rem", zIndex: 2 }}>
              {slides.map((_, di) => (
                <div
                  key={di}
                  style={{
                    width: di === i ? 28 : 8,
                    height: 2,
                    background: di === i ? "var(--green,#b5ff4d)" : "rgba(255,255,255,0.2)",
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// â”€â”€â”€ CSS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const styles = `
  :root { --black:#080808; --off-black:#0d0d0d; --panel:#111; --green:#b5ff4d; --green-dim:#7db835; --green-glow:rgba(181,255,77,0.12); --green-glow-hard:rgba(181,255,77,0.25); --white:#f0f0f0; --muted:#444; --glass:rgba(255,255,255,0.04); --glass-border:rgba(255,255,255,0.07); }
  .services-page,.services-page *,.services-page *::before,.services-page *::after{box-sizing:border-box}
  .services-page{scroll-behavior:auto;background:var(--black);color:var(--white);font-family:"DM Sans",sans-serif;overflow-x:hidden;cursor:auto;min-height:100vh}

  #statement{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:0 8vw;position:relative;overflow:hidden}
  .statement-bg{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.62) 0%,rgba(0,0,0,.9) 100%),radial-gradient(ellipse 80% 60% at 50% 50%,rgba(181,255,77,.035) 0%,transparent 72%),url("/bg.jpg");background-size:cover;background-position:center;background-color:#050505;transform-origin:center;will-change:transform,opacity;pointer-events:none}
  .statement-particles{position:absolute;inset:0;pointer-events:none;overflow:hidden}
  .statement-particle{position:absolute;width:3px;height:3px;border-radius:9999px;background:rgba(88,227,255,.82);box-shadow:0 0 6px rgba(88,227,255,.35),0 0 10px rgba(181,255,77,.1);opacity:.28;animation:statementParticleFloat var(--dur,18s) linear infinite;animation-delay:var(--delay,0s)}
  .statement-particle:nth-child(odd){background:rgba(181,255,77,.7);box-shadow:0 0 7px rgba(181,255,77,.3),0 0 12px rgba(88,227,255,.1)}
  .statement-particle:nth-child(1){left:12%;top:24%;--dur:20s;--delay:-2s}
  .statement-particle:nth-child(2){left:28%;top:66%;--dur:22s;--delay:-8s}
  .statement-particle:nth-child(3){left:58%;top:18%;--dur:19s;--delay:-5s}
  .statement-particle:nth-child(4){left:80%;top:58%;--dur:24s;--delay:-10s}
  @keyframes statementParticleFloat{0%{transform:translate3d(0,6px,0) scale(.9);opacity:.08}50%{transform:translate3d(8px,-14px,0) scale(1);opacity:.42}100%{transform:translate3d(-8px,-28px,0) scale(.92);opacity:.1}}
  @keyframes glow{0%{text-shadow:0 0 30px rgba(181,255,77,0.3)}100%{text-shadow:0 0 40px rgba(181,255,77,0.6),0 0 60px rgba(181,255,77,0.2)}}
  .statement-line{font-family:"Bebas Neue",sans-serif;font-size:clamp(48px,7vw,110px);line-height:1;letter-spacing:.01em;opacity:0;transform:translateY(18px);position:relative;z-index:1;will-change:transform,opacity}
  .statement-line:nth-child(2){color:var(--muted);padding-left:8vw}
  .statement-line:nth-child(3){color:var(--green);text-shadow:0 0 24px rgba(181,255,77,.28)}
  .statement-line+.statement-line{margin-top:.6rem}

  #process{padding:10vh 8vw;position:relative;overflow:hidden}
  .process-header{font-family:"Bebas Neue",sans-serif;font-size:clamp(40px,5vw,72px);margin-bottom:8vh;opacity:0;transform:translateY(30px)}
  .process-track{position:relative}
  .process-progress-rail{position:absolute;left:0;top:28px;width:100%;height:1px;background:rgba(255,255,255,.08)}
  .process-progress-fill{height:1px;width:0;background:var(--green);box-shadow:0 0 12px var(--green)}
  .process-steps{display:flex;gap:0;justify-content:space-between;position:relative}
  .process-step{flex:1;padding-top:60px;opacity:0;transform:translateY(20px)}
  .step-dot{width:14px;height:14px;border-radius:50%;border:2px solid var(--muted);background:var(--black);position:absolute;top:21px;left:0;transform:translateX(-50%);transition:border-color .4s,box-shadow .4s}
  .step-dot.active{border-color:var(--green);box-shadow:0 0 16px rgba(181,255,77,.5)}
  .step-num{font-family:"Bebas Neue",sans-serif;font-size:48px;color:rgba(181,255,77,.15);line-height:1;margin-bottom:.5rem}
  .step-title{font-family:"Syne",sans-serif;font-size:clamp(16px,1.5vw,20px);font-weight:800;margin-bottom:.5rem}
  .step-desc{font-size:13px;color:var(--muted);font-weight:300;line-height:1.6;max-width:180px}

  #features{padding:12vh 8vw}
  .features-label{font-size:11px;letter-spacing:.35em;color:var(--green);text-transform:uppercase;margin-bottom:5vh;opacity:0;transform:translateY(15px)}
  .features-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5px}
  .feature-card{background:var(--glass);border:1px solid var(--glass-border);padding:clamp(2rem,3vw,3.5rem);position:relative;overflow:hidden;opacity:0;transform:translateY(30px);transition:border-color .4s}
  .feature-card::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--green),transparent);opacity:0;transition:opacity .4s}
  .feature-card:hover{border-color:rgba(181,255,77,.15)}
  .feature-card:hover::before{opacity:1}
  .feature-card-glow{position:absolute;width:200px;height:200px;background:radial-gradient(circle,rgba(181,255,77,.06) 0%,transparent 70%);border-radius:50%;pointer-events:none;opacity:0;transform:translate(-50%,-50%);transition:opacity .3s}
  .feature-card:hover .feature-card-glow{opacity:1}
  .feature-icon{width:40px;height:40px;border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;margin-bottom:2rem;font-size:16px}
  .feature-title{font-family:"Syne",sans-serif;font-size:clamp(18px,1.8vw,24px);font-weight:800;margin-bottom:.8rem}
  .feature-desc{font-size:13px;color:var(--muted);font-weight:300;line-height:1.7}

  #hscroll-outer{overflow:hidden;position:relative}
  .hscroll-pin{height:100vh;display:flex;align-items:center;overflow:hidden}
  .hscroll-track{display:flex;align-items:center;width:max-content;gap:0;will-change:transform}
  .hscroll-item{width:50vw;height:70vh;display:flex;flex-direction:column;justify-content:flex-end;padding:4vw;border-right:1px solid var(--glass-border);position:relative;overflow:hidden;flex-shrink:0}
  .hscroll-item:first-child{margin-left:8vw}
  .hscroll-num{font-family:"Bebas Neue",sans-serif;font-size:clamp(80px,12vw,160px);color:rgba(255,255,255,.04);line-height:1;position:absolute;top:2vw;right:3vw}
  .hscroll-tag{font-size:10px;letter-spacing:.35em;color:var(--green);text-transform:uppercase;margin-bottom:1rem}
  .hscroll-title{font-family:"Bebas Neue",sans-serif;font-size:clamp(36px,4vw,60px);line-height:1}
  .hscroll-bar{width:30px;height:2px;background:var(--green);margin-top:1.5rem}

  #cta{height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;overflow:hidden}
  .cta-glow{position:absolute;inset:0;background:radial-gradient(ellipse 70% 70% at 50% 50%,rgba(181,255,77,.06) 0%,transparent 60%);pointer-events:none}
  .cta-heading{font-family:"Bebas Neue",sans-serif;font-size:clamp(52px,8vw,120px);line-height:.95;max-width:800px;opacity:0;transform:translateY(40px);position:relative;z-index:1}
  .cta-heading em{color:var(--green);font-style:normal}
  .cta-btn{margin-top:4rem;display:inline-flex;align-items:center;gap:1rem;background:var(--green);color:var(--black);font-family:"Syne",sans-serif;font-size:13px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;padding:1.2rem 2.8rem;border:none;cursor:pointer;position:relative;z-index:1;opacity:0;transform:translateY(20px);transition:background .3s,box-shadow .3s;text-decoration:none}
  .cta-btn:hover{background:#c8ff60;box-shadow:0 0 40px rgba(181,255,77,.3)}
  .cta-btn-arrow{font-size:18px;transition:transform .3s}
  .cta-btn:hover .cta-btn-arrow{transform:translateX(5px)}
  .cta-sub{margin-top:2rem;font-size:12px;letter-spacing:.2em;color:var(--muted);text-transform:uppercase;opacity:0;position:relative;z-index:1}

  @media(max-width:768px){.features-grid{grid-template-columns:1fr}.hscroll-item{width:85vw}.process-steps{flex-direction:column;gap:3rem}.process-progress-rail{display:none}}
`;

// â”€â”€â”€ ROOT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Services() {
  const rootRef = useRef(null);

  useEffect(() => {
    const scope = rootRef.current;
    if (!scope) return;
    const selectAll = (selector) => Array.from(scope.querySelectorAll(selector));
    const toIfExists = (selector, vars) => {
      const targets = selectAll(selector);
      if (targets.length) gsap.to(targets, vars);
    };

    const ctaGlow = scope.querySelector("#ctaGlow");
    const track = scope.querySelector("#hscrollTrack");
    const pin = scope.querySelector("#hscrollPin");
    const processFill = scope.querySelector("#processFill");

    const stLines = selectAll(".statement-line");
    const stTl = gsap.timeline({ defaults: { ease: "power2.out" } });
    if (stLines.length) {
      gsap.set(stLines, { y: 120, opacity: 0, scale: 0.82 });
      stLines.forEach((l, i) =>
        stTl.to(l, { y: 0, opacity: 1, scale: 1, duration: 0.95, ease: "power3.out" }, i * 0.28),
      );
      ScrollTrigger.create({
        trigger: scope.querySelector("#statement"),
        start: "top top",
        end: `+=${stLines.length * 55}vh`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.48,
        fastScrollEnd: true,
        animation: stTl,
        invalidateOnRefresh: true,
      });
      toIfExists(".statement-bg", {
        scale: 1.08,
        y: -12,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#statement",
          start: "top top",
          end: `+=${stLines.length * 35}vh`,
          scrub: 1.2,
        },
      });
    }

    toIfExists(".process-header", {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: "#process",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      duration: 0.8,
      ease: "power3.out",
    });
    selectAll(".process-step").forEach((step, i) => {
      gsap.to(step, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: step,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        duration: 0.7,
        delay: i * 0.1,
        ease: "power3.out",
      });
    });
    if (processFill) {
      gsap.to(processFill, {
        width: "100%",
        scrollTrigger: {
          trigger: ".process-track",
          start: "top 70%",
          end: "bottom 60%",
          scrub: 1,
        },
      });
    }
    ["dot1", "dot2", "dot3", "dot4"].forEach((id, i) =>
      ScrollTrigger.create({
        trigger: "#process",
        start: `top+=${i * 80} 70%`,
        onEnter: () => scope.querySelector(`#${id}`)?.classList.add("active"),
        onLeaveBack: () => scope.querySelector(`#${id}`)?.classList.remove("active"),
      }),
    );

    toIfExists(".features-label", {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: "#features",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      duration: 0.6,
    });
    selectAll(".feature-card").forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
        duration: 0.7,
        delay: i * 0.1,
        ease: "power3.out",
      });
      const fn = (e) => {
        const r = card.getBoundingClientRect();
        const g = card.querySelector(".feature-card-glow");
        if (!g) return;
        g.style.left = `${e.clientX - r.left}px`;
        g.style.top = `${e.clientY - r.top}px`;
      };
      card.addEventListener("mousemove", fn);
      card._onCardMove = fn;
    });

    if (track && pin) {
      const gw = () => track.scrollWidth - pin.offsetWidth;
      ScrollTrigger.create({
        trigger: "#hscroll-outer",
        start: "top top",
        end: () => `+=${gw()}`,
        pin,
        scrub: 1.2,
        animation: gsap.to(track, { x: () => -gw(), ease: "none" }),
        invalidateOnRefresh: true,
      });
    }

    const ctaTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#cta",
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });
    if (selectAll(".cta-heading").length) {
      ctaTl.to(".cta-heading", { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
    }
    if (selectAll(".cta-btn").length) {
      ctaTl.to(".cta-btn", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5");
    }
    if (selectAll(".cta-sub").length) {
      ctaTl.to(".cta-sub", { opacity: 1, duration: 0.6 }, "-=0.3");
    }
    if (ctaGlow)
      gsap.to(ctaGlow, {
        scale: 1.15,
        opacity: 0.7,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

    requestAnimationFrame(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      gsap.killTweensOf([ctaGlow, track]);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.utils.toArray(".feature-card").forEach((c) => {
        if (c._onCardMove) c.removeEventListener("mousemove", c._onCardMove);
      });
    };
  }, []);

  return (
    <div ref={rootRef} className="services-page">
      <style>{styles}</style>

      <Hero />

      <section id="statement">
        <div className="statement-bg" />
        <div className="statement-particles" aria-hidden="true">
          <span className="statement-particle" />
          <span className="statement-particle" />
          <span className="statement-particle" />
          <span className="statement-particle" />
        </div>
        <p className="statement-line">Every brand</p>
        <p className="statement-line">has a story.</p>
        <p className="statement-line">Most feel the same.</p>
        <p className="statement-line">We fix that.</p>
      </section>

      <ServicesHScroll />

      <section id="process">
        <h2 className="process-header">How we work</h2>
        <div className="process-track">
          <div className="process-progress-rail">
            <div className="process-progress-fill" id="processFill" />
          </div>
          <div className="process-steps">
            {[
              {
                id: "dot1",
                num: "01",
                title: "Understand",
                desc: "We listen more than we speak. Deep research, honest questions.",
              },
              {
                id: "dot2",
                num: "02",
                title: "Design",
                desc: "Intentional decisions at every level. Form follows function, then transcends it.",
              },
              {
                id: "dot3",
                num: "03",
                title: "Build",
                desc: "Precision engineering. Code that performs under pressure and looks flawless.",
              },
              {
                id: "dot4",
                num: "04",
                title: "Refine",
                desc: "We don't ship and forget. We obsess, iterate, and polish until it's right.",
              },
            ].map((s) => (
              <div key={s.id} className="process-step" style={{ position: "relative" }}>
                <div className="step-dot" id={s.id} />
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PhonePortal />

      <section id="features">
        <p className="features-label">Why us</p>
        <div className="features-grid">
          {[
            {
              icon: "â—ˆ",
              title: "Pixel-perfect execution",
              desc: "Every element placed with reason. We sweat the details others skip.",
            },
            {
              icon: "âš¡",
              title: "Lightning performance",
              desc: "Speed isn't a feature. It's a foundation. We build fast by design.",
            },
            {
              icon: "â—Ž",
              title: "Smooth interactions",
              desc: "Interfaces that respond with grace. Motion that guides, never distracts.",
            },
            {
              icon: "âˆž",
              title: "Scalable systems",
              desc: "Design systems and codebases built to grow with you, not against you.",
            },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-card-glow" />
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div id="hscroll-outer">
        <div className="hscroll-pin" id="hscrollPin">
          <div className="hscroll-track" id="hscrollTrack">
            {[
              {
                title: "Credit That",
                subtitle: "Never Sleeps",
                description: "Round-the-clock credit monitoring with instant alerts"
              },
              {
                title: "Pay With",
                subtitle: "Confidence",
                description: "Secure payments powered by advanced encryption"
              },
              {
                title: "Rewards That",
                subtitle: "Multiply",
                description: "Earn more on every spend with smart rewards"
              },
              {
                title: "Built For",
                subtitle: "Tomorrow",
                description: "Future-ready tech that evolves with your needs"
              },
            ].map((slide, index) => (
              <div className="hscroll-item" key={index} style={{
                backgroundImage: `url('/sample.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(181,255,77,0.1) 0%, rgba(7,7,8,0.8) 50%, rgba(181,255,77,0.05) 100%)',
                  backdropFilter: 'blur(1px)'
                }} />
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#ffffff'
                }}>
                  <div style={{
                    fontSize: 'clamp(2rem, 8vw, 6rem)',
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    lineHeight: 0.9,
                    marginBottom: '0.5rem',
                    textShadow: '0 0 30px rgba(181,255,77,0.3)',
                    background: 'linear-gradient(135deg, #b5ff4d 0%, #ffffff 50%, #b5ff4d 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'glow 3s ease-in-out infinite alternate'
                  }}>
                    {slide.title}
                  </div>
                  <div style={{
                    fontSize: 'clamp(1.2rem, 4vw, 3rem)',
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontWeight: 400,
                    letterSpacing: '0.1em',
                    marginBottom: '1.5rem',
                    color: '#b5ff4d',
                    textShadow: '0 0 20px rgba(181,255,77,0.5)',
                    opacity: 0.9
                  }}>
                    {slide.subtitle}
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    letterSpacing: '0.02em',
                    lineHeight: 1.4,
                    color: 'rgba(255,255,255,0.8)',
                    maxWidth: '300px',
                    textShadow: '0 0 10px rgba(0,0,0,0.5)'
                  }}>
                    {slide.description}
                  </div>
                </div>
                <div className="hscroll-bar" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="cta">
        <div className="cta-glow" id="ctaGlow" />
        <h2 className="cta-heading">
          Ready to build something <em>unforgettable?</em>
        </h2>
        <a href="#" className="cta-btn">
          Let's Work <span className="cta-btn-arrow">â†’</span>
        </a>
        <p className="cta-sub">No commitment. Just a conversation.</p>
      </section>
    </div>
  );
}

export default Services;

