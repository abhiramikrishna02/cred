import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Services() {
  const comp = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
    let ctx = gsap.context(() => {
      gsap.from(".service-card", {
        y: 60,
        opacity: 0,
        rotationX: -15, // Slight 3D tilt entering
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2
      });
    }, comp);
    return () => ctx.revert();
  }, []);

  const services = [
    { num: '01', title: 'Global Liquidity', desc: 'Instant settlement across 40 fiat currencies and major digital assets.' },
    { num: '02', title: 'Black Card Vault', desc: 'Titanium-forged physical card tied directly to your portfolio margin.' },
    { num: '03', title: 'Tax AI Routing', desc: 'Real-time capital gains optimization on every transaction.' }
  ];

  return (
    <div ref={comp} className="min-h-screen pt-40 px-6 md:px-32">
      <h1 className="text-5xl font-black text-white mb-20 tracking-tighter uppercase">Ecosystem</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1000px]">
        {services.map((srv) => (
          <div key={srv.num} className="service-card glass-panel p-10 rounded-2xl hover:-translate-y-4 hover:border-[#d4af37]/50 transition-all duration-500 cursor-pointer group">
            <span className="text-[#d4af37] font-black text-2xl mb-6 block opacity-50 group-hover:opacity-100 transition-opacity">{srv.num}</span>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{srv.title}</h3>
            <p className="text-gray-500 font-light leading-relaxed">{srv.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}