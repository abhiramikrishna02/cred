import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Services from "./Pages/Services";
import Contacts from "./Pages/Contacts";

function ScrollManager({ lenisRef }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    const rafId = window.requestAnimationFrame(() => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [pathname, lenisRef]);

  return null;
}

function App() {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      lerp: 0.12,
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.75,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;
    window.history.scrollRestoration = "manual";

    const onScroll = () => ScrollTrigger.update();
    const onResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    lenis.on("scroll", onScroll);
    window.addEventListener("resize", onResize);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  return (
    <>
      <ScrollManager lenisRef={lenisRef} />
      <Navbar />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contacts />} />
      </Routes>
      <Footer />
    </>
  );
}

function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default RootApp;
