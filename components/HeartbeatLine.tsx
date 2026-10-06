import styles from './HeartbeatLine.module.css';

/**
 * "From hope to heartbeat to home" drawn as one continuous line: a quiet
 * baseline, a heartbeat, then a house drawn wall by wall (roof, door,
 * window), and the line carries on past it. Pure CSS: each stroke is
 * sequenced with animation delays, and reduced-motion visitors see the
 * finished drawing.
 */
export default function HeartbeatLine() {
  return (
    <svg
      className={styles.line}
      viewBox="0 0 640 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* baseline, heartbeat, up the left wall, over the roof, down the right wall */}
      <path
        className={`${styles.stroke} ${styles.lead}`}
        pathLength={1}
        d="M0 76 H150 L166 70 L182 76 H212 L230 36 L250 92 L268 58 L278 76 H372 V50 L420 10 L468 50 V76"
      />
      {/* the floor closes the house */}
      <path className={`${styles.stroke} ${styles.floor}`} pathLength={1} d="M468 76 H372" />
      {/* door and window */}
      <path className={`${styles.stroke} ${styles.detail}`} pathLength={1} d="M398 76 V56 H418 V76" />
      <path className={`${styles.stroke} ${styles.detail2}`} pathLength={1} d="M436 54 H452 V66 H436 Z" />
      {/* and the line keeps going */}
      <path className={`${styles.stroke} ${styles.onward}`} pathLength={1} d="M468 76 H640" />
    </svg>
  );
}
