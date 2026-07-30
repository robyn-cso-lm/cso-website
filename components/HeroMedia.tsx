'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './HeroMedia.module.css';

type HeroMediaProps = {
  /** Looping clip, e.g. "/video/hero-loop.mp4". Omit to show the poster alone. */
  src?: string;
  /** Still frame. Shown on mobile, on reduced motion, and before the clip loads. */
  poster: string;
  /** Decorative by default: the hero headline carries the meaning. */
  alt?: string;
};

/**
 * Ambient hero loop sitting behind the hero copy.
 *
 * The poster image is what actually ships first, and it is always what renders
 * when the visitor has asked for reduced motion, is on a narrow screen, or is
 * on a metered connection. The clip is a progressive enhancement layered on
 * top, so the hero is never blank and never costs mobile users a video
 * download they did not ask for.
 */
export default function HeroMedia({ src, poster, alt = '' }: HeroMediaProps) {
  const [playClip, setPlayClip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = window.matchMedia('(max-width: 700px)').matches;

    // Respect the browser's data-saver hint where it is exposed.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const saveData = conn?.saveData === true;

    if (reduced || narrow || saveData) return;
    setPlayClip(true);
  }, [src]);

  useEffect(() => {
    if (!playClip) return;
    // Autoplay can still be refused; the poster stays visible underneath.
    videoRef.current?.play().catch(() => {});
  }, [playClip]);

  return (
    <div className={styles.media} aria-hidden={alt === '' ? true : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt={alt} className={styles.poster} />
      {playClip && src && (
        <video
          ref={videoRef}
          className={styles.video}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
      <div className={styles.scrim} />
    </div>
  );
}
