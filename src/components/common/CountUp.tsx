import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  start?: number;
  end: number;
  duration?: number;
  useEasing?: boolean;
  className?: string;
}

const easeOutExpo = (t: number): number =>
  t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

const CountUp: React.FC<CountUpProps> = ({
  start = 0,
  end,
  duration = 2,
  useEasing = true,
  className,
}) => {
  const [value, setValue] = useState<number>(start);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const target = Number(end) || 0;
    const from = Number(start) || 0;
    const totalMs = Math.max((Number(duration) || 0) * 1000, 0);

    if (totalMs === 0 || from === target) {
      setValue(target);
      return;
    }

    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalMs, 1);
      const eased = useEasing ? easeOutExpo(progress) : progress;
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [start, end, duration, useEasing]);

  return <span className={className}>{value.toLocaleString("en-IN")}</span>;
};

export default CountUp;
