'use client';

import { useEffect, useRef, useState } from 'react';

type CountUpProps = {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
};

/**
 * Number that counts up once when it scrolls into view.
 *
 * The final value is what renders on the server and without JS, so crawlers,
 * screen readers and reduced-motion visitors always see the real number.
 */
export default function CountUp({ end, suffix = '', prefix = '', duration = 1600 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(end);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver === 'undefined') return;

    setValue(0);
    let frame = 0;

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(end * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration]);

  return (
    <span ref={ref} aria-label={`${prefix}${end.toLocaleString('en-CA')}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {value.toLocaleString('en-CA')}
        {suffix}
      </span>
    </span>
  );
}
