import Image from 'next/image';
import styles from './Portrait.module.css';

type PortraitProps = {
  /** Path under /public, e.g. "/images/portraits/tom.webp". Omit to render the fallback. */
  src?: string;
  /** Describe the person, not the artwork. Required whenever src is set. */
  alt?: string;
  /** Shown in the fallback when there is no portrait yet. First letter is used. */
  name: string;
  /** Portrait shape. "card" fills its container; "inset" is the fixed-width /about slot. */
  variant?: 'card' | 'inset';
  /** Set on the single largest portrait above the fold so it is not lazy-loaded. */
  priority?: boolean;
  className?: string;
};

/**
 * Illustrated portrait, matching the anonymized portraits used in the portal
 * gallery. Real photographs are only ever used for team members, never for
 * families, so alt text should describe the person rather than the medium.
 *
 * Renders a lettered fallback when src is absent, which lets pages be wired up
 * for portraits before the artwork exists. The fallback occupies the same box
 * as a real portrait, so dropping images in later causes no layout shift.
 */
export default function Portrait({
  src,
  alt,
  name,
  variant = 'card',
  priority = false,
  className = '',
}: PortraitProps) {
  const shell = [styles.portrait, styles[variant], className].filter(Boolean).join(' ');

  if (!src) {
    return (
      <div className={shell} aria-hidden="true">
        <span className={styles.fallbackLetter}>{name.trim().charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className={shell}>
      <Image
        src={src}
        alt={alt ?? name}
        fill
        sizes={variant === 'inset' ? '220px' : '(max-width: 700px) 100vw, 420px'}
        className={styles.image}
        priority={priority}
      />
    </div>
  );
}
