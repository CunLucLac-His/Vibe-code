import { useEffect, useState, useRef, type MouseEvent } from "react";
import { motion, easeOut, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Send, Mail, Instagram, Github, Facebook } from "lucide-react";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { BlurText } from "@/components/ui/blur-text";
import { Reveal } from "@/components/ui/reveal";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { ScrollRevealText } from "@/components/ui/scroll-reveal-text";
import { Footer } from "@/components/ui/demo";
import { NAV_LINKS, STATS, PROJECTS, EXPERIENCES, SKILLS } from "@/data/portfolio";

const EMAIL = "htrung23112003@gmail.com";

const INTRO_SESSION_KEY = "asme-intro-seen";
const INTRO_WORDS = ["Design", "By Tiến Trung", "CunZ"];
const INTRO_INTERVAL_FRAMES = 400; // Tăng lên để chuyển giữa các khung hình chậm hơn
const INTRO_DISPLAY_MS = 8000;    // Thời gian hiển thị toàn bộ intro (12 giây)
const INTRO_FADE_MS = 1500;        // Thời gian hiệu ứng mờ dần (1.5 giây - giúp chuyển cảnh mượt và thơ hơn)

function IntroHook({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFading(true), INTRO_DISPLAY_MS);
    const doneTimer = window.setTimeout(onDone, INTRO_DISPLAY_MS + INTRO_FADE_MS);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <ParticleTextEffect
        words={INTRO_WORDS}
        intervalFrames={INTRO_INTERVAL_FRAMES}
        className="w-full max-w-3xl px-6"
      />
    </div>
  );
}

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SpotlightCard({ children, className = "", id }: SpotlightCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <div
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.06), transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full w-full flex flex-col justify-between">{children}</div>
    </div>
  );
}

function App() {
  const { scrollY } = useScroll();
  const blurValue = useTransform(scrollY, [0, 500], ["blur(0px)", "blur(16px)"]);
  const opacityValue = useTransform(scrollY, [0, 500], [1, 0.45]);
  const overlayOpacity = useTransform(scrollY, [0, 500], [0.35, 0.75]);

  const [showIntro, setShowIntro] = useState(
    () => sessionStorage.getItem(INTRO_SESSION_KEY) !== "1"
  );
  const [activeSection, setActiveSection] = useState("about");
  const [showToast, setShowToast] = useState(false);

  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const projectsTrackRef = useRef<HTMLDivElement>(null);
  const [projectsHeight, setProjectsHeight] = useState<number | string>("150vh");

  useEffect(() => {
    const handleResize = () => {
      if (!projectsTrackRef.current) return;
      const track = projectsTrackRef.current;
      const maxTranslate = track.scrollWidth - window.innerWidth;
      const windowHeight = window.innerHeight;
      const neededHeight = Math.max(windowHeight, maxTranslate + windowHeight);
      setProjectsHeight(neededHeight);
    };

    const handleScroll = () => {
      if (!projectsContainerRef.current || !projectsTrackRef.current) return;
      const container = projectsContainerRef.current;
      const track = projectsTrackRef.current;

      const containerTop = container.getBoundingClientRect().top;
      const containerHeight = container.offsetHeight;
      const windowHeight = window.innerHeight;

      const totalScrollableDistance = containerHeight - windowHeight;
      const scrolledDistance = -containerTop;

      let progress = totalScrollableDistance > 0 ? scrolledDistance / totalScrollableDistance : 0;
      progress = Math.max(0, Math.min(1, progress));

      const maxTranslate = track.scrollWidth - window.innerWidth;
      const currentTranslate = progress * maxTranslate;
      track.style.transform = `translate3d(-${currentTranslate}px, 0, 0)`;

      // Train carriage curving effect as cards scroll past the left padding
      const cards = track.children;
      const leftPadding = parseFloat(window.getComputedStyle(track).paddingLeft) || 0;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const rect = card.getBoundingClientRect();

        if (rect.left < leftPadding) {
          const overflowLeft = leftPadding - rect.left;
          const factor = Math.min(1, overflowLeft / rect.width);

          // 3D bend, scale down, carriage lag translation and fade out
          const scale = 1 - factor * 0.12;
          const opacity = 1 - factor * 0.85;
          const rotateY = factor * 25;
          const translateX = factor * 50;

          card.style.transform = `perspective(1200px) rotateY(${rotateY}deg) scale(${scale}) translateX(${translateX}px)`;
          card.style.opacity = `${opacity}`;
          card.style.transformOrigin = "left center";
        } else {
          card.style.transform = "perspective(1200px) rotateY(0deg) scale(1) translateX(0px)";
          card.style.opacity = "1";
          card.style.transformOrigin = "left center";
        }
      }
    };

    // Calculate initial height and scroll position
    handleResize();
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleScroll);

    let resizeObserver: ResizeObserver | null = null;
    if (projectsTrackRef.current) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
        handleScroll();
      });
      resizeObserver.observe(projectsTrackRef.current);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      (e.target as HTMLFormElement).reset();
    }, 4000);
  };

  const handleIntroDone = () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    setShowIntro(false);
  };

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black relative flex flex-col">
      {/* Background Video with Scroll-Driven Blur and Opacity */}
      <motion.div
        style={{ filter: blurValue, opacity: opacityValue }}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      >
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_053131_1ec3dd1c-d627-44fb-ab20-6e1fce41b0d5.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-black pointer-events-none"
        />
      </motion.div>

      {showIntro && <IntroHook onDone={handleIntroDone} />}

      <section className="relative min-h-screen w-full flex flex-col justify-between z-10">
        <nav className="relative z-20 pl-6 pr-6 py-6">
          <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center gap-8">
              <a href="#" className="flex items-center gap-3 group">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <defs>
                    <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#a3a3a3" />
                      <stop offset="100%" stopColor="#404040" />
                    </linearGradient>
                  </defs>
                  
                  {/* Outer hexagon ring that rotates on hover */}
                  <path
                    d="M16 3L28 10V22L16 29L4 22V10L16 3Z"
                    stroke="url(#logo-grad)"
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                    className="transition-transform duration-700 ease-out group-hover:rotate-180 origin-center"
                  />

                  {/* Inner stylized geometric letter 'C' */}
                  <path
                    d="M20 11C18.5 9.5 16.5 9 14.5 9.5C11.5 10.2 9.5 13 9.5 16C9.5 19 11.5 21.8 14.5 22.5C16.5 23 18.5 22.5 20 21"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="transition-all duration-300 group-hover:stroke-neutral-300"
                  />

                  {/* Pulsing AI sparkles node */}
                  <path
                    d="M21 16L22.5 17.5L24 16L22.5 14.5L21 16Z"
                    fill="white"
                    className="animate-pulse"
                  />
                </svg>
                <span className="text-white font-semibold text-lg tracking-tight group-hover:text-white/80 transition-colors">
                  CunZ
                </span>
              </a>
              <div className="hidden md:flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className={`relative text-sm font-medium transition-colors ${
                      activeSection === link.id ? "text-white" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {activeSection === link.id && (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"
                        transition={{ duration: 0.3, ease: easeOut }}
                      />
                    )}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`mailto:${EMAIL}`}
                className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Liên hệ tôi
              </a>
            </div>
          </div>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[14%]">
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: easeOut }}
            className="liquid-glass rounded-full px-5 py-2 mb-8 text-white/80 text-xs md:text-sm font-medium"
          >
            Solo Product Builder & AI Integrator
          </motion.div>

          <BlurText
            text="Tự học — Tự làm — Tự đột phá bằng Trí tuệ Nhân tạo"
            className="text-5xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          />

          <motion.p
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: easeOut }}
            className="text-white/60 text-sm md:text-base max-w-lg mb-10"
          >
            Xây sản phẩm AI &amp; Tài chính bằng cách tự học, tự làm — từ ý tưởng đến production.
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: easeOut }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-4xl mx-auto mb-10 border-t border-b border-white/5 py-6 w-full px-4"
          >
            {STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-semibold text-white tracking-tight font-mono mb-1">
                  {stat.value}
                </span>
                <span className="text-[10px] md:text-xs text-white/50 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1, ease: easeOut }}
            className="flex items-center gap-4 md:gap-6 flex-wrap justify-center"
          >
            <a
              href="#projects"
              className="group liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              Xem sản phẩm
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="/resume.pdf"
              download
              className="group border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-full px-8 py-3 text-white text-sm font-medium transition-colors flex items-center gap-2"
            >
              Tải CV / Resume
            </a>
            <a
              href="#contact"
              className="text-white/70 hover:text-white transition-colors text-sm font-medium underline underline-offset-4 decoration-white/30"
            >
              Liên hệ tôi
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none">
          <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-medium">
            SCROLL
          </span>
          <div className="w-[1px] h-10 bg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-white/80 to-transparent animate-scroll-down" />
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 px-6 py-24 max-w-3xl mx-auto text-center">
        <Reveal>
          <h2
            className="text-4xl md:text-5xl text-white mb-8 tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Về tôi
          </h2>
          <div className="liquid-glass rounded-3xl px-8 py-10 text-left space-y-4">
            <ScrollRevealText
              text="Mình là Hà Tiến Trung — người thích tìm tòi, research, khám phá và trải nghiệm những thứ mới mẻ. Mình học bằng cách tự làm, tự xem bản thân tận dụng được công nghệ đến đâu, và chỉ thấy hài lòng khi ra được kết quả cụ thể."
              className="text-white/90 text-base leading-relaxed"
            />
            <p className="text-white/90 text-base leading-relaxed">
              Thế mạnh của mình là luôn tìm hiểu và tận dụng những thứ mới, thích nghi nhanh với
              thay đổi, và làm những việc khiến mình thấy thích thú.
            </p>
            <p className="text-white/90 text-base leading-relaxed">
              Hiện tại mình dùng AI xuyên suốt các dự án: viết prompt, tạo Skill cho Obsidian,
              khai thác tool và repo mã nguồn mở để research nhanh hơn. Hai dự án đang xây: một
              "đội quân Agent" chuyên viết lách, và một bộ công cụ chạy 24/24 để tự động cập
              nhật tin tức.
            </p>
          </div>
        </Reveal>
      </section>

      <div ref={projectsContainerRef} className="relative z-10" style={{ height: projectsHeight }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <section id="projects" className="relative px-6 max-w-6xl mx-auto w-full mb-8">
<div className="flex flex-col justify-between md:flex-row md:items-end">
  <div>
    <Reveal>
      <h2 className="text-4xl md:text-5xl text-white tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
        <WordsPullUp text="Sản phẩm AI & Tài chính" />
      </h2>
    </Reveal>
  </div>
</div>

          </section>

          {/* Full-width horizontal viewport */}
          <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
            {/* Fade shadow overlays on screen edges */}
            <div className="absolute inset-y-0 left-0 w-8 md:w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 md:w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

            <div style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
              <div
                ref={projectsTrackRef}
                className="flex gap-6 w-max will-change-transform ease-out duration-100 px-6 md:px-12 lg:px-24 xl:px-[calc((100vw-1152px)/2+24px)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {PROJECTS.map((project, idx) => {
                  const ProjectIcon = project.icon;
                  return (
                    <div
                      key={project.title}
                      className="w-[280px] sm:w-[350px] md:w-[420px] shrink-0 h-auto"
                    >
                      <Reveal delay={idx * 0.1} className="h-full">
                        <SpotlightCard className="liquid-glass project-card rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-3 bg-white/5 rounded-xl text-white">
                                <ProjectIcon size={24} />
                              </div>
                              <h3 className="text-xl font-medium text-white">{project.title}</h3>
                            </div>
                            
                            {/* Tech tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.techTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-medium bg-white/5 text-white/60 px-2 py-0.5 rounded-md border border-white/5"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <p className="text-white/70 text-sm mb-6 leading-relaxed">
                              {project.description}
                            </p>
                            <div className="text-xs text-white/50 border-t border-white/5 pt-4">
                              <span className="text-white/80 font-semibold">Vai trò AI:</span> {project.aiRole}
                            </div>
                          </div>
                          
                          <div className="mt-8 flex justify-start">
                            {project.link ? (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs font-medium text-white bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full transition-all border border-white/5 hover:border-white/20"
                              >
                                Tham gia Telegram <Send size={12} />
                              </a>
                            ) : (
                              <span className="text-xs font-medium text-white/40 bg-white/5 px-5 py-2.5 rounded-full border border-white/5 select-none cursor-not-allowed">
                                {project.status}
                              </span>
                            )}
                          </div>
                        </SpotlightCard>
                      </Reveal>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="experience" className="relative z-10 px-6 py-24 max-w-5xl mx-auto border-t border-white/5">
        <Reveal>
          <h2
            className="text-4xl md:text-5xl text-white mb-12 tracking-tight text-center"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            <WordsPullUp text="Kinh nghiệm & Chuyên môn" />
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EXPERIENCES.map((exp, idx) => (
            <Reveal
              key={exp.title}
              delay={idx * 0.1}
              className={`${exp.className || ""} h-full`}
            >
              <SpotlightCard className="liquid-glass project-card rounded-3xl p-8 h-full">
                <div>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="text-xs font-medium text-white/50 tracking-wider uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      {exp.badge}
                    </span>
                    <span className="text-sm text-white/40 font-mono">
                      {exp.period}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-medium text-white mb-3">
                    {exp.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    {exp.description}
                  </p>
                </div>
                
                {exp.bullets && (
                  <ul className="text-xs text-white/60 space-y-2 border-t border-white/5 pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {exp.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
                
                {exp.tags && (
                  <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4 mt-4">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-white/5 text-white/80 px-2.5 py-1 rounded-full border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="skills" className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <Reveal>
          <h2
            className="text-4xl md:text-5xl text-white mb-8 tracking-tight text-center"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            <WordsPullUp text="Skills" />
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.1} className="liquid-glass rounded-3xl px-6 py-8 h-full">
              <h3 className="text-white font-semibold text-lg mb-1">{group.title}</h3>
              {group.caption && (
                <p className="text-white/50 text-xs mb-4">{group.caption}</p>
              )}
              <ul className={`space-y-3 ${group.caption ? "" : "mt-4"}`}>
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between text-sm">
                    <span className="text-white/80">{item.name}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      item.level === "Expert" 
                        ? "bg-white/10 text-white border-white/20" 
                        : item.level === "Advanced" 
                        ? "bg-white/5 text-white/80 border-white/10" 
                        : "bg-white/0 text-white/40 border-white/5"
                    }`}>
                      {item.level}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="relative z-10 px-6 py-24 max-w-4xl mx-auto text-center border-t border-white/5">
        <Reveal>
          <h2
            className="text-4xl md:text-5xl text-white mb-8 tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            <WordsPullUp text="Liên hệ" />
          </h2>
          <div className="liquid-glass rounded-3xl px-8 py-12">
            <p className="text-white/70 text-sm md:text-base mb-8 leading-relaxed">
              Kết nối với mình qua các kênh hoặc gửi tin nhắn trực tiếp dưới đây. Mình sẽ phản hồi bạn sớm nhất!
            </p>
            
            {/* Multi-channel Contact Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <a
                href={`mailto:${EMAIL}`}
                className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 hover:border-white/15 rounded-2xl transition-all group"
              >
                <Mail size={24} className="text-white/80 group-hover:text-white mb-2 transition-colors" />
                <span className="text-xs font-semibold text-white/90">Email</span>
                <span className="text-[10px] text-white/50 truncate max-w-full mt-1 px-1">{EMAIL}</span>
              </a>
              
              <a
                href="https://github.com/CunLucLac-His"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 hover:border-white/15 rounded-2xl transition-all group"
              >
                <Github size={24} className="text-white/80 group-hover:text-white mb-2 transition-colors" />
                <span className="text-xs font-semibold text-white/90">GitHub</span>
                <span className="text-[10px] text-white/50 mt-1">CunLucLac-His</span>
              </a>

              <a
                href="https://www.instagram.com/_cuns_2311/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 hover:border-white/15 rounded-2xl transition-all group"
              >
                <Instagram size={24} className="text-white/80 group-hover:text-white mb-2 transition-colors" />
                <span className="text-xs font-semibold text-white/90">Instagram</span>
                <span className="text-[10px] text-white/50 mt-1">_cuns_2311</span>
              </a>

              <a
                href="https://facebook.com/tien.trung03"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 hover:border-white/15 rounded-2xl transition-all group"
              >
                <Facebook size={24} className="text-white/80 group-hover:text-white mb-2 transition-colors" />
                <span className="text-xs font-semibold text-white/90">Facebook</span>
                <span className="text-[10px] text-white/50 mt-1">tien.trung03</span>
              </a>
            </div>

            {/* Direct Message Form */}
            <form onSubmit={handleContactSubmit} className="mt-8 pt-8 border-t border-white/5 space-y-4 text-left">
              <h3 className="text-sm font-semibold text-white/80 mb-3">Gửi tin nhắn trực tiếp</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tên của bạn"
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Địa chỉ Email"
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>
              <textarea
                placeholder="Nội dung tin nhắn..."
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90 rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Gửi tin nhắn
                <Send size={14} />
              </button>
              
              {showToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-center text-xs text-white"
                >
                  Cảm ơn bạn! Tin nhắn đã được gửi thành công. Mình sẽ liên hệ lại sớm nhất!
                </motion.div>
              )}
            </form>
          </div>
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}

export default App;
