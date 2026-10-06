import styles from './HeartbeatLine.module.css';

/**
 * "From hope to heartbeat to home" drawn as a line: a quiet baseline, one
 * heartbeat, then the line climbs into the peak of a roof. Draws itself once
 * on load (pure CSS, no JS) and renders complete for reduced-motion visitors.
 */
export default function HeartbeatLine() {
  return (
    <svg
      className={styles.line}
      viewBox="0 0 640 72"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={styles.trace}
        pathLength={1}
        d="M0 46 H196 L212 40 L228 46 H262 L280 8 L300 64 L318 30 L328 46 H400 L452 12 L504 46 H640"
      />
    </svg>
  );
}
