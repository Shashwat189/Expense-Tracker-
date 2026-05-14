import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Custom formatter that overrides prefix/suffix/decimals */
  format?: (n: number) => string;
}

export function AnimatedNumber({ value, decimals = 2, prefix = "", suffix = "", format }: Props) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    const duration = 600;
    let raf = 0;
    const step = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        fromRef.current = to;
        startRef.current = null;
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  if (format) return <span>{format(display)}</span>;
  return (
    <span>
      {prefix}
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
