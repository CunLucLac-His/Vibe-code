import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUp, Send } from "lucide-react";
import Hls from "hls.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, EXPERIENCES, SKILLS } from "@/data/portfolio";

const EMAIL = "htrung23112003@gmail.com";
const INTRO_SESSION_KEY = "asme-intro-seen";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ----------------------------------------------------
// Component: HlsVideo (Helper for HLS Mux Streams)
// ----------------------------------------------------
function HlsVideo({ src, className = "" }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log("HLS autoplay blocked: ", err));
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener(
        "loadedmetadata",
        () => {
          video.play().catch((err) => console.log("Native autoplay blocked: ", err));
        },
        { once: true }
      );
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return <video ref={videoRef} muted loop playsInline className={className} />;
}

// ----------------------------------------------------
// Section 1: Loading Screen
// ----------------------------------------------------
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Design", "Create", "Inspire"];

  useEffect(() => {
    // Word cycler
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 900);

    // Frame-based loader counter
    let startTime: number | null = null;
    const duration = 2700; // 2700ms total
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setCount(progress);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(100);
        setTimeout(() => {
          onComplete();
        }, 400); // 400ms delay on complete
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // GSAP label fade-in
    gsap.fromTo(
      ".loading-label",
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    return () => {
      clearInterval(wordInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-6 md:p-12 select-none font-body">
      {/* Top Left Label */}
      <div className="loading-label text-xs text-muted uppercase tracking-[0.3em] opacity-0">
        Portfolio
      </div>

      {/* Center Rotating Words */}
      <div className="flex justify-center items-center h-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary"
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Counter & Progress Bar */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div className="text-xs text-muted max-w-xs font-mono uppercase tracking-[0.1em]">
            Hà Tiến Trung — CunZ
          </div>
          <div className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums leading-none">
            {String(count).padStart(3, "0")}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-[3px] bg-stroke/50 relative overflow-hidden rounded-full">
          <div
            className="absolute left-0 top-0 h-full accent-gradient origin-left transition-transform duration-75"
            style={{
              width: "100%",
              transform: `scaleX(${count / 100})`,
              boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Main App Component
// ----------------------------------------------------
function App() {
  const [isLoading, setIsLoading] = useState(
    () => sessionStorage.getItem(INTRO_SESSION_KEY) !== "1"
  );
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Playground Parallax lightbox state
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const roles = ["Creative Developer", "Fullstack Engineer", "AI Integrator", "Product Builder"];

  // Lock body and html overflow when intro screen is loading to prevent scroll bleed
  useEffect(() => {
    if (isLoading) {
      document.body.classList.add("overflow-hidden");
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [isLoading]);

  // Page structure refs for GSAP ScrollTrigger
  const heroRef = useRef<HTMLDivElement>(null);
  const explorationsRef = useRef<HTMLDivElement>(null);
  const explorationsCenterRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for header background toggle and active section highlights
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      setShowScrollTop(window.scrollY > window.innerHeight);

      // Simple active link detection
      const scrollPos = window.scrollY + 200;
      const projectsEl = document.getElementById("projects");
      const resumeEl = document.getElementById("resume");
      
      if (resumeEl && scrollPos >= resumeEl.offsetTop) {
        setActiveSection("Resume");
      } else if (projectsEl && scrollPos >= projectsEl.offsetTop) {
        setActiveSection("Work");
      } else {
        setActiveSection("Home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check mobile width for specific responsive layout triggers
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Cycle role text every 2s
  useEffect(() => {
    const roleInterval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(roleInterval);
  }, []);

  // GSAP animations for Hero entrance & Parallax gallery
  useEffect(() => {
    if (isLoading) return;

    // 1. Hero Entrance timeline
    const tl = gsap.timeline();
    tl.fromTo(
      ".name-reveal",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.1 }
    );
    tl.fromTo(
      ".blur-in",
      { opacity: 0, filter: "blur(10px)", y: 20 },
      { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1, ease: "power3.out" },
      "-=0.9"
    );

    // 2. Pin explorations center layout
    const pin = ScrollTrigger.create({
      trigger: explorationsRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: explorationsCenterRef.current,
      pinSpacing: false,
    });

    // 3. Parallax scroll columns
    const col1Anim = gsap.fromTo(
      col1Ref.current,
      { y: isMobile ? 50 : 150 },
      {
        y: isMobile ? -50 : -150,
        scrollTrigger: {
          trigger: explorationsRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    const col2Anim = gsap.fromTo(
      col2Ref.current,
      { y: isMobile ? -50 : -150 },
      {
        y: isMobile ? 50 : 150,
        scrollTrigger: {
          trigger: explorationsRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    // 4. Infinite scrolling contact marquee
    const marqueeAnim = gsap.to(marqueeRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 35,
      repeat: -1,
    });

    return () => {
      tl.kill();
      pin.kill();
      col1Anim.scrollTrigger?.kill();
      col2Anim.scrollTrigger?.kill();
      marqueeAnim.kill();
    };
  }, [isLoading, isMobile]);

  const handleLoadingComplete = () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    setIsLoading(false);
  };

  // Scroll to element helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Playground images (6 abstract items)
  const playgroundItems = [
    { title: "Automotive Motion", img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=400&auto=format&fit=crop" },
    { title: "Urban Architecture", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop" },
    { title: "Human Perspective", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop" },
    { title: "Brand Identity", img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400&auto=format&fit=crop" },
    { title: "Neural Mesh", img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400&auto=format&fit=crop" },
    { title: "Cyberpunk Terminal", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop" },
  ];

  // Map user's real projects to Bento column spans (7/5/5/7 pattern)
  const mappedProjects = [
    { ...PROJECTS[5], span: "md:col-span-7", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop" }, // VN Finance Bot
    { ...PROJECTS[2], span: "md:col-span-5", img: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop" }, // AI chatbot
    { ...PROJECTS[0], span: "md:col-span-5", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" }, // Personal OS
    { ...PROJECTS[1], span: "md:col-span-7", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop" }, // E-commerce
  ];

  // Journal horizontal pills content (4 entries mapping user thoughts)
  const journalEntries = [
    { title: "Tích hợp DeepSeek LLM cho Pipeline Phân loại Tin tức", date: "04/2026", time: "5 min read", img: "https://images.unsplash.com/photo-1680814907498-8f7fe8953ea6?q=80&w=150&auto=format&fit=crop" },
    { title: "Vận hành Docker & AWS EC2 chạy Telegram Bot 24/7", date: "02/2026", time: "8 min read", img: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=150&auto=format&fit=crop" },
    { title: "Tối ưu hóa Hiệu năng Front-end & Tránh Reflow Layout", date: "12/2025", time: "6 min read", img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=150&auto=format&fit=crop" },
    { title: "Mô hình hóa tài chính tương tác trên Web (DCF Modeling)", date: "09/2025", time: "10 min read", img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=150&auto=format&fit=crop" },
  ];

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {!isLoading && (
        <div className="bg-bg text-text-primary min-h-screen relative flex flex-col w-full max-w-full overflow-x-hidden font-body selection:bg-text-primary selection:text-bg">
          
          {/* ----------------------------------------------------
              Navbar (Sticky / Floats at Top Center)
              ---------------------------------------------------- */}
          <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 md:pt-6 px-4">
            <div
              className={`inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2.5 sm:px-4 py-1.5 sm:py-2 gap-2 sm:gap-4 transition-all duration-300 ${
                scrolled ? "shadow-md shadow-black/30 bg-surface/90" : ""
              }`}
            >
              {/* Logo */}
              <a
                href="#"
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
                className="flex items-center gap-2 group"
              >
                <div className="relative w-8 h-8 rounded-full flex items-center justify-center p-[2.5px] overflow-hidden">
                  <div
                    className={`absolute inset-0 accent-gradient transition-transform duration-700 ${
                      isLogoHovered ? "rotate-180" : "rotate-0"
                    }`}
                  />
                  <div className="relative w-full h-full bg-bg rounded-full flex items-center justify-center text-text-primary font-display italic text-[13px] font-bold leading-none select-none">
                    HT
                  </div>
                </div>
                <span className="text-text-primary font-semibold text-xs tracking-tight hidden sm:inline select-none">
                  CunZ
                </span>
              </a>

              {/* Divider */}
              <div className="w-px h-5 bg-stroke hidden sm:block" />

              {/* Nav links */}
              <div className="flex items-center gap-0.5 sm:gap-2">
                {[
                  { name: "Home", target: "hero" },
                  { name: "Work", target: "projects" },
                  { name: "Resume", target: "resume" },
                ].map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.target)}
                    className={`text-xs sm:text-sm rounded-full px-2.5 sm:px-4 py-1.5 transition-all select-none ${
                      activeSection === link.name
                        ? "text-text-primary bg-stroke/70 font-medium"
                        : "text-muted hover:text-text-primary hover:bg-stroke/40"
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-stroke" />

              {/* Say Hi Button */}
              <a
                href={`mailto:${EMAIL}`}
                className="relative text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 bg-surface text-text-primary flex items-center gap-1 border border-white/5 overflow-hidden transition-all group"
              >
                <div className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10 flex items-center gap-1.5 text-text-primary group-hover:text-text-primary">
                  Say hi ↗
                </div>
              </a>
            </div>
          </nav>

          {/* ----------------------------------------------------
              Section 2: Hero
              ---------------------------------------------------- */}
          <section
            id="hero"
            ref={heroRef}
            className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden z-10"
          >
            {/* Background HLS Video */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {!isMobile && (
                <HlsVideo
                  src="https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8"
                  className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
                />
              )}
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
            </div>

            {/* Hero content */}
            <div className="relative z-10 px-6 text-center max-w-4xl flex flex-col items-center select-none">
              <span className="blur-in text-xs text-text-primary uppercase tracking-[0.3em] mb-6 inline-block font-semibold bg-stroke/60 px-3 py-1.5 rounded-full border border-white/5 shadow-sm">
                COLLECTION '26
              </span>
              <h1 className="name-reveal text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
                Hà Tiến Trung
              </h1>
              
              <div className="blur-in text-lg md:text-xl font-semibold text-text-primary/95 max-w-xl mb-6">
                A <span
                  key={roleIndex}
                  className="font-display italic text-text-primary animate-role-fade-in inline-block font-semibold"
                >
                  {roles[roleIndex]}
                </span>{" "}
                lives in Saigon.
              </div>

              <p className="blur-in text-sm text-zinc-200 max-w-md mb-10 leading-relaxed font-semibold">
                Tự học — Tự làm — Tự đột phá bằng Trí tuệ Nhân tạo. Xây dựng các sản phẩm AI &amp; Tài chính thực tế từ ý tưởng đến production.
              </p>

              {/* CTA Buttons */}
              <div className="blur-in flex items-center gap-4 flex-wrap justify-center">
                <button
                  onClick={() => scrollToSection("projects")}
                  className="group relative rounded-full text-sm px-8 py-3.5 bg-text-primary text-bg font-medium hover:bg-bg hover:text-text-primary transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 accent-gradient translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0 pointer-events-none" />
                  <span className="relative z-10 flex items-center gap-1">
                    See Works <ArrowRight size={14} />
                  </span>
                </button>

                <a
                  href={`mailto:${EMAIL}`}
                  className="group relative rounded-full text-sm px-8 py-3.5 border-2 border-stroke bg-bg text-text-primary font-medium hover:border-transparent transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none" />
                  <span className="relative z-10">Reach out...</span>
                </a>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none">
              <span className="text-[10px] text-muted tracking-[0.2em] uppercase font-medium">
                SCROLL
              </span>
              <div className="w-[1px] h-10 bg-stroke relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-text-primary to-transparent animate-scroll-down" />
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------
              Section 3: Selected Works
              ---------------------------------------------------- */}
          <section id="projects" className="bg-bg py-20 z-10">
            <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
              
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12 border-b border-stroke pb-8"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-px bg-stroke" />
                    <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">
                      Selected Work
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-tight font-light">
                    Featured <span className="font-display italic">projects</span>
                  </h2>
                  <p className="text-muted text-sm max-w-md mt-2 leading-relaxed">
                    A selection of projects I've worked on, from concept to launch, driven by AI and data logic.
                  </p>
                </div>
                
                <button
                  onClick={() => scrollToSection("explore")}
                  className="rounded-full border border-stroke hover:border-transparent px-6 py-2.5 text-xs text-text-primary font-medium transition-all group relative overflow-hidden flex items-center gap-1.5 self-start"
                >
                  <div className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <span className="relative z-10 flex items-center gap-1.5">
                    View visual playground <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </motion.div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {mappedProjects.map((project) => (
                  <div
                    key={project.title}
                    className={`relative rounded-3xl overflow-hidden border border-stroke bg-surface h-[320px] md:h-[450px] group ${project.span}`}
                  >
                    {/* Background Tech Image */}
                    <img
                      src={project.img}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0 opacity-40 group-hover:opacity-30"
                    />
                    
                    {/* Halftone Dot Overlay */}
                    <div className="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply pointer-events-none z-10" />

                    {/* Standard visible content overlay */}
                    <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between group-hover:opacity-0 transition-opacity duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-bg/50 backdrop-blur-md text-text-primary rounded-xl border border-stroke">
                          <project.icon size={20} />
                        </div>
                        <h3 className="text-lg md:text-xl font-medium text-text-primary font-display italic">
                          {project.title}
                        </h3>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                          {project.techTags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[9px] bg-bg/50 border border-stroke text-muted px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-muted uppercase tracking-wider font-mono">
                          {project.status.replace(/Highlight Project|School Project|Đang vận hành/i, "") || "ACTIVE"}
                        </span>
                      </div>
                    </div>

                    {/* Premium Hover Overlay details */}
                    <div className="absolute inset-0 bg-bg/85 opacity-0 group-hover:opacity-100 backdrop-blur-lg transition-all duration-300 flex flex-col justify-between p-6 md:p-8 z-30">
                      <div>
                        <h3 className="text-xl md:text-2xl font-display italic text-text-primary mb-2">
                          {project.title}
                        </h3>
                        <p className="text-xs text-zinc-100 mb-4 leading-relaxed font-semibold">
                          {project.description}
                        </p>
                        
                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.techTags.map((tag) => {
                            const isAi = ["DeepSeek LLM", "OpenAI API", "AI Content", "Chatbot"].includes(tag);
                            return (
                              <span
                                key={tag}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                  isAi
                                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-text-primary border-purple-500/40"
                                    : "bg-stroke text-zinc-200 border-stroke/50"
                                }`}
                              >
                                {tag}
                              </span>
                            );
                          })}
                        </div>
                        
                        {/* AI Integration Highlight */}
                        <div className="p-3 bg-stroke/50 border border-stroke/70 rounded-xl text-xs text-zinc-150 font-semibold">
                          <span className="text-text-primary font-bold">Vai trò AI:</span> {project.aiRole}
                        </div>
                      </div>

                      <div className="flex justify-between items-center w-full mt-4">
                        <div className="accent-gradient p-[1px] rounded-full">
                          <div className="bg-white text-zinc-950 text-xs px-4 py-2 rounded-full font-medium flex items-center gap-1.5 shadow-sm">
                            View — <span className="font-display italic font-semibold">{project.title}</span>
                          </div>
                        </div>
                        
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-text-primary text-bg text-xs px-4 py-2 rounded-full hover:bg-white/90 transition-colors font-medium"
                          >
                            Join Bot ↗
                          </a>
                        ) : (
                          <span className="text-[10px] text-muted uppercase tracking-wider">{project.status}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ----------------------------------------------------
              Section 4: Journal
              ---------------------------------------------------- */}
          <section className="bg-bg py-20 z-10 border-t border-stroke">
            <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
              
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-px bg-stroke" />
                    <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">
                      Journal
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-tight font-light">
                    Recent <span className="font-display italic">thoughts</span>
                  </h2>
                  <p className="text-muted text-sm max-w-md mt-2 leading-relaxed">
                    Writing about full-stack engineering, prompt pipelines, and modern web optimization.
                  </p>
                </div>
                
                <a
                  href={`mailto:${EMAIL}`}
                  className="rounded-full border border-stroke hover:border-transparent px-6 py-2.5 text-xs text-text-primary font-medium transition-all group relative overflow-hidden flex items-center gap-1.5 self-start"
                >
                  <div className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <span className="relative z-10">Subscribe to updates</span>
                </a>
              </motion.div>

              {/* Horizontal entries as pills */}
              <div className="flex flex-col gap-4">
                {journalEntries.map((entry) => (
                  <div
                    key={entry.title}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-surface/30 hover:bg-surface border border-stroke rounded-[24px] sm:rounded-full transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={entry.img}
                        alt=""
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-stroke"
                      />
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-text-primary group-hover:text-text-primary transition-colors leading-tight">
                          {entry.title}
                        </h3>
                        <span className="text-[10px] text-zinc-300 font-mono sm:hidden font-semibold">{entry.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-stroke/40 pt-3 sm:pt-0 sm:border-0">
                      <span className="text-xs text-zinc-200 font-mono font-semibold">{entry.time}</span>
                      <span className="text-xs text-zinc-200 font-mono hidden sm:inline font-semibold">{entry.date}</span>
                      <div className="w-8 h-8 rounded-full border border-stroke group-hover:border-text-primary flex items-center justify-center transition-colors">
                        <ArrowRight size={14} className="text-zinc-200 group-hover:text-text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ----------------------------------------------------
              Section 5: Explorations (Parallax Gallery)
              ---------------------------------------------------- */}
          <section
            id="explore"
            ref={explorationsRef}
            className="relative min-h-[300vh] bg-bg flex flex-col justify-between"
          >
            {/* Layer 1: Pinned Center layout */}
            <div
              ref={explorationsCenterRef}
              className="h-screen w-full flex items-center justify-center relative z-10 pointer-events-none select-none"
            >
              <div className="px-6 text-center max-w-xl pointer-events-auto">
                <span className="text-xs text-muted uppercase tracking-[0.3em] mb-4 inline-block font-medium">
                  Explorations
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-display italic text-text-primary mb-4 leading-none">
                  Visual <span className="font-display italic">playground</span>
                </h2>
                <p className="text-muted text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                  A curated gallery of aesthetic experiments, interactive motion UI components, and abstract code setups.
                </p>
                <a
                  href="https://dribbble.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-stroke hover:border-transparent px-6 py-2.5 text-xs text-text-primary font-medium transition-all group relative overflow-hidden inline-flex items-center gap-1.5"
                >
                  <div className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <span className="relative z-10">Browse Dribbble ↗</span>
                </a>
              </div>
            </div>

            {/* Layer 2: Parallax Columns */}
            <div className="absolute inset-0 z-20 flex justify-center items-center pointer-events-none">
              <div className="w-full max-w-[1400px] px-6 grid grid-cols-2 gap-12 md:gap-40">
                {/* Column 1 (Scrolling Down Parallax) */}
                <div ref={col1Ref} className="flex flex-col gap-12 md:gap-32 items-end pointer-events-auto">
                  {playgroundItems.slice(0, 3).map((item, idx) => (
                    <div
                      key={item.title}
                      onClick={() => setLightboxImg(item.img)}
                      className={`relative aspect-square w-full max-w-[320px] rounded-3xl overflow-hidden border border-stroke bg-surface cursor-pointer group shadow-lg ${
                        idx === 1 ? "rotate-2" : idx === 2 ? "-rotate-3" : "-rotate-1"
                      }`}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-xs text-text-primary font-mono">{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Column 2 (Scrolling Up Parallax) */}
                <div ref={col2Ref} className="flex flex-col gap-12 md:gap-32 items-start pointer-events-auto">
                  {playgroundItems.slice(3, 6).map((item, idx) => (
                    <div
                      key={item.title}
                      onClick={() => setLightboxImg(item.img)}
                      className={`relative aspect-square w-full max-w-[320px] rounded-3xl overflow-hidden border border-stroke bg-surface cursor-pointer group shadow-lg ${
                        idx === 0 ? "rotate-3" : idx === 1 ? "-rotate-2" : "rotate-1"
                      }`}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-xs text-text-primary font-mono">{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------
              Section 6: Resume & Skills (Stats Grid & Core Lists)
              ---------------------------------------------------- */}
          <section id="resume" className="bg-bg py-24 z-10 border-t border-stroke">
            <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left mb-24 border-b border-stroke pb-16">
                <div>
                  <h3 className="text-4xl md:text-5xl font-display italic text-text-primary mb-2 font-semibold">
                    STU University
                  </h3>
                  <p className="text-zinc-200 text-xs md:text-sm font-mono tracking-wider font-semibold">
                    Đại học Công Nghệ Sài Gòn (2021-Nay)
                  </p>
                </div>
                <div>
                  <h3 className="text-4xl md:text-5xl font-display italic text-text-primary mb-2 font-semibold">
                    8+ Active
                  </h3>
                  <p className="text-zinc-200 text-xs md:text-sm font-mono tracking-wider font-semibold">
                    Dự án phát triển &amp; Tích hợp thực tế
                  </p>
                </div>
                <div>
                  <h3 className="text-4xl md:text-5xl font-display italic text-text-primary mb-2 font-semibold">
                    DeepSeek &amp; GPT-4
                  </h3>
                  <p className="text-zinc-200 text-xs md:text-sm font-mono tracking-wider font-semibold">
                    Kinh nghiệm tích hợp AI LLM APIs
                  </p>
                </div>
              </div>

              {/* Skills & Experience */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Experience Column */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-6 h-px bg-stroke" />
                    <h3 className="text-xs text-zinc-200 uppercase tracking-[0.3em] font-medium">
                      Experience
                    </h3>
                  </div>
                  <div className="space-y-8">
                    {EXPERIENCES.map((exp) => (
                      <div key={exp.title} className="border-l-2 border-stroke pl-6 ml-2 relative">
                        <div className="absolute w-3 h-3 bg-stroke rounded-full -left-[7px] top-1.5 border border-bg accent-gradient" />
                        <span className="text-[10px] text-zinc-200 font-mono font-semibold">{exp.period}</span>
                        <h4 className="text-base font-bold text-text-primary mt-1">{exp.title}</h4>
                        <p className="text-xs text-text-primary font-semibold mt-1 bg-stroke/50 px-2 py-0.5 rounded w-max border border-white/5">{exp.badge}</p>
                        <p className="text-xs text-zinc-200 mt-2 leading-relaxed font-semibold">{exp.description}</p>
                        
                        {exp.bullets && (
                          <ul className="text-[10px] text-zinc-200 space-y-1.5 mt-3 list-disc pl-4 font-semibold">
                            {exp.bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Column */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-6 h-px bg-stroke" />
                    <h3 className="text-xs text-zinc-200 uppercase tracking-[0.3em] font-medium">
                      Skills
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {SKILLS.map((group) => (
                      <div key={group.title} className="p-5 bg-surface/30 border border-stroke rounded-2xl">
                        <h4 className="text-sm font-semibold text-text-primary mb-3">{group.title}</h4>
                        <ul className="space-y-2">
                          {group.items.map((item) => (
                            <li key={item.name} className="flex justify-between items-center text-xs">
                              <span className="text-zinc-200 font-semibold">{item.name}</span>
                              <span className={`text-[9px] font-mono border px-2 py-0.5 rounded-full ${
                                item.level === "Expert"
                                  ? "border-text-primary bg-text-primary text-bg font-semibold"
                                  : "border-stroke text-zinc-200 bg-surface font-semibold"
                              }`}>
                                {item.level}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ----------------------------------------------------
              Section 7: Contact / Footer (Contact & Infinite Marquee)
              ---------------------------------------------------- */}
          <section
            id="contact"
            className="relative pt-20 pb-12 bg-bg overflow-hidden border-t border-stroke z-10 flex flex-col justify-between"
          >
            {/* Background HLS Video Flipped Vertically */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {!isMobile && (
                <HlsVideo
                  src="https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8"
                  className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1]"
                />
              )}
              <div className="absolute inset-0 bg-black/70 pointer-events-none" />
            </div>

            {/* GSAP Infinite Marquee */}
            <div className="relative z-10 w-full overflow-hidden border-t border-b border-stroke/40 py-6 mb-16 select-none bg-bg/50 backdrop-blur-sm">
              <div ref={marqueeRef} className="flex whitespace-nowrap text-3xl md:text-5xl font-display italic text-text-primary/10 tracking-[0.1em]">
                {Array(15)
                  .fill("BUILDING THE FUTURE • ")
                  .map((text, idx) => (
                    <span key={idx}>{text}</span>
                  ))}
              </div>
            </div>

            {/* Main Contact Content */}
            <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center mb-16 flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-display italic text-text-primary mb-6">
                Let's make something <span className="underline decoration-stroke underline-offset-8">impactful</span>
              </h2>
              <p className="text-muted text-sm max-w-md mb-8 leading-relaxed">
                Liên kết các giải pháp Trí Tuệ Nhân Tạo thực tiễn và thiết lập cấu trúc mã nguồn tối ưu. Gửi tin nhắn trực tiếp qua email.
              </p>

              {/* Email CTA Button with Hover Gradient Ring */}
              <a
                href={`mailto:${EMAIL}`}
                className="group relative rounded-full text-base px-10 py-4 bg-surface text-text-primary border border-white/5 overflow-hidden transition-all duration-300 flex items-center gap-2"
              >
                <div className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="relative z-10 flex items-center gap-2 font-medium text-text-primary">
                  {EMAIL} <Send size={14} />
                </span>
              </a>
            </div>

            {/* Footer Bar */}
            <div className="relative z-10 max-w-[1200px] w-full mx-auto px-6 md:px-10 lg:px-16 border-t border-stroke/40 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Left Social Links */}
              <div className="flex items-center gap-5 text-sm">
                <a href="https://github.com/CunLucLac-His" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text-primary transition-colors">
                  GitHub
                </a>
                <a href="https://facebook.com/tien.trung03" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text-primary transition-colors">
                  Facebook
                </a>
                <a href="https://www.instagram.com/_cuns_2311/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text-primary transition-colors">
                  Instagram
                </a>
              </div>

              {/* Center Status */}
              <div className="flex items-center gap-2 bg-stroke/50 border border-stroke rounded-full px-4 py-1.5 text-xs text-text-primary/90 font-medium font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available for projects
              </div>

              {/* Right Copyright */}
              <div className="text-xs text-muted font-mono">
                © {new Date().getFullYear()} CunZ. All rights reserved.
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------
              Back to Top Button (Hidden initially, appears after innerHeight)
              ---------------------------------------------------- */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setTimeout(() => {
                    ScrollTrigger.refresh();
                  }, 100);
                }}
                className="fixed bottom-8 right-8 z-[100] p-3 rounded-full bg-text-primary text-bg hover:opacity-90 hover:scale-105 active:scale-95 shadow-xl border border-stroke/20 transition-all cursor-pointer flex items-center justify-center"
                aria-label="Back to top"
              >
                <ArrowUp size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* ----------------------------------------------------
              Playground Lightbox Modal
              ---------------------------------------------------- */}
          <AnimatePresence>
            {lightboxImg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxImg(null)}
                className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
              >
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  src={lightboxImg}
                  alt="Playground Exploration Preview"
                  className="max-w-full max-h-[85vh] rounded-2xl object-contain border border-stroke"
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </>
  );
}

export default App;
