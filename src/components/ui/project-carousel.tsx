import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface CarouselProject {
  icon: ReactNode;
  title: string;
  description: string;
  aiRole: string;
  footer: ReactNode;
}

interface ProjectCarouselProps {
  items: CarouselProject[];
}

type Role = "center" | "left" | "right" | "back";

const ANIMATION_MS = 650;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

function roleStyle(role: Role, isMobile: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transition: `transform ${ANIMATION_MS}ms ${EASE}, filter ${ANIMATION_MS}ms ${EASE}, opacity ${ANIMATION_MS}ms ${EASE}, left ${ANIMATION_MS}ms ${EASE}`,
    willChange: "transform, filter, opacity, left",
  };

  switch (role) {
    case "center":
      return {
        ...base,
        left: "50%",
        transform: "translate(-50%, -50%) scale(1)",
        filter: "blur(0px)",
        opacity: 1,
        zIndex: 30,
        pointerEvents: "auto",
      };
    case "left":
      return {
        ...base,
        left: isMobile ? "-10%" : "18%",
        transform: `translate(-50%, -50%) scale(${isMobile ? 0.7 : 0.78})`,
        filter: "blur(3px)",
        opacity: isMobile ? 0 : 0.45,
        zIndex: 10,
        pointerEvents: "none",
      };
    case "right":
      return {
        ...base,
        left: isMobile ? "110%" : "82%",
        transform: `translate(-50%, -50%) scale(${isMobile ? 0.7 : 0.78})`,
        filter: "blur(3px)",
        opacity: isMobile ? 0 : 0.45,
        zIndex: 10,
        pointerEvents: "none",
      };
    case "back":
    default:
      return {
        ...base,
        left: "50%",
        transform: "translate(-50%, -50%) scale(0.6)",
        filter: "blur(4px)",
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none",
      };
  }
}

export function ProjectCarousel({ items }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 640
  );
  const lockTimer = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    return () => {
      if (lockTimer.current) window.clearTimeout(lockTimer.current);
    };
  }, []);

  const count = items.length;

  const goTo = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    lockTimer.current = window.setTimeout(() => setIsAnimating(false), ANIMATION_MS);
  };

  const navigate = (direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (direction === "next" ? (prev + 1) % count : (prev + count - 1) % count));
    lockTimer.current = window.setTimeout(() => setIsAnimating(false), ANIMATION_MS);
  };

  const roleFor = (index: number): Role => {
    if (index === activeIndex) return "center";
    if (index === (activeIndex + count - 1) % count) return "left";
    if (index === (activeIndex + 1) % count) return "right";
    return "back";
  };

  const handleCardClick = (index: number) => (e: MouseEvent) => {
    if (roleFor(index) === "center") return;
    e.preventDefault();
    goTo(index);
  };

  return (
    <div>
      <div className="relative w-full h-[440px] sm:h-[420px]">
        {items.map((item, index) => {
          const role = roleFor(index);
          return (
            <div
              key={item.title}
              style={roleStyle(role, isMobile)}
              onClick={handleCardClick(index)}
              className={`w-[280px] sm:w-[340px] ${role !== "center" ? "cursor-pointer" : ""}`}
            >
              <div className="liquid-glass project-card rounded-3xl p-8 min-h-[320px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/5 rounded-xl text-white">{item.icon}</div>
                    <h3 className="text-xl font-medium text-white">{item.title}</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">{item.description}</p>
                  <div className="text-xs text-white/50 border-t border-white/5 pt-4">
                    <span className="text-white/80 font-semibold">Vai trò AI:</span> {item.aiRole}
                  </div>
                </div>
                <div className="mt-8 flex justify-start">{item.footer}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          type="button"
          onClick={() => navigate("prev")}
          aria-label="Dự án trước"
          className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-2">
          {items.map((item, index) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Xem ${item.title}`}
              onClick={() => goTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate("next")}
          aria-label="Dự án tiếp theo"
          className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-white/5 transition-colors"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
