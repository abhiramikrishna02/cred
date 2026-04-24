import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function About() {
  const comp = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
    let ctx = gsap.context(() => {
      gsap.from(".reveal-text", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2
      });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="min-h-screen pt-40 px-6 md:px-32 relative overflow-hidden">
      {/* Abstract Animated Glow Background */}
      <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#0ea5e9]/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-5xl relative z-10">
        <h1 className="reveal-text text-6xl md:text-[7rem] font-black text-white mb-12 tracking-tighter leading-none">
          Beyond <br/> <span className="text-gray-600">Banking.</span>
        </h1>
        <div className="reveal-text h-[1px] w-full bg-gradient-to-r from-[#d4af37] to-transparent mb-16"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-xl text-gray-400 font-light leading-relaxed">
          <p className="reveal-text">
            We recognized that the top 1% of operators are constrained by retail financial rails designed for the masses. Aura is the architectural response to that bottleneck.
          </p>
          <p className="reveal-text">
            No branches. No hold music. Just a seamless interface connected directly to tier-1 liquidity providers and institutional cold storage.
          </p>
        </div>
      </div>
    </div>
  );
}