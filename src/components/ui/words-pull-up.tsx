import { useRef } from "react";
import { motion, useInView, easeOut } from "framer-motion";

interface WordsPullUpProps {
  text: string;
  className?: string;
}

export function WordsPullUp({ text, className = "" }: WordsPullUpProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const words = text.split(" ");

  return (
    <span ref={ref} className={`flex flex-wrap justify-center ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: i * 0.08, ease: easeOut }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
