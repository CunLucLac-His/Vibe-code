import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface AnimatedLetterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function AnimatedLetter({ char, progress, range }: AnimatedLetterProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export function ScrollRevealText({ text, className = "" }: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.4"] });
  const chars = text.split("");

  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => {
        const charProgress = i / chars.length;
        const range: [number, number] = [Math.max(charProgress - 0.1, 0), charProgress + 0.05];
        return (
          <AnimatedLetter
            key={i}
            char={char === " " ? " " : char}
            progress={scrollYProgress}
            range={range}
          />
        );
      })}
    </p>
  );
}
