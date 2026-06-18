import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './guides.module.css';

export const metadata: Metadata = {
  title: 'Surrogacy Guides | Canadian Surrogacy Options',
  description:
    'PDF guides for intended parents and surrogates navigating Canadian surrogacy. Honest, detailed, written by Robyn Price after 30 years in the field.',
  alternates: {
    canonical: 'https://canadiansurrogacyoptions.com/guides',
  },
  openGraph: {
    title: 'Surrogacy Guides | Canadian Surrogacy Options',
    description:
      'From first question to matched and ready. Guides for every stage of the Canadian surrogacy journey.',
    url: 'https://canadiansurrogacyoptions.com/guides',
  },
};

const GUIDES = [
  {
    href: '/guides/canadian-surrogacy-roadmap',
    price: '$97',
    badge: 'Most comprehensive',
    title: 'The Canadian Surrogacy Roadmap',
    description:
      'Your complete step-by-step guide from first question to bringing baby home. 12 phases mapped, full budget tracker, legal deep-dive, and 4 fillable worksheets.',
    audience: 'For: Intended parents at any stage',
    featured: true,
  },
  {
    href: '/guides/is-surrogacy-right',
    price: '$27',
    badge: 'Start here',
    title: 'Is Surrogacy Right For Me?',
    description:
      'Honest costs, real timelines, and the legal landscape by province—before you talk to anyone. Know if surrogacy is feasible for your situation.',
    audience: 'For: Explorers, comparison shoppers',
    featured: false,
  },
  {
    href: '/guides/ip-profile-template',
    price: '$67',
    badge: 'Matching prep',
    title: 'IP Profile Template Pack',
    description:
      'A 3-part framework surrogates actually respond to—plus annotated examples, photo guide, and ready-to-use Word + PDF templates.',
    audience: 'For: IPs ready to match',
    featured: false,
  },
  {
    href: '/guides/surrogate-readiness',
    price: '$47',
    badge: 'For surrogates',
    title: 'Surrogate Readiness Guide',
    description:
      "What surrogacy is really like at each stage, how to evaluate agencies, and the honest questions to sit with before you commit.",
    audience: 'For: Women considering surrogacy',
    featured: false,
  },
];

export default function GuidesPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Canadian Surrogacy Options</p>
          <h1 className={styles.title}>Guides for every stage of your journey</h1>
          <p className={styles.subtitle}>
            Written by Robyn Price after 30 years in Canadian surrogacy. No sales pitch—just the
            information you actually need to move forward with clarity.
          </p>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.inner}>
          {GUIDES.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className={guide.featured ? `${styles.card} ${styles.cardFeatured}` : styles.card}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardBadge}>{guide.badge}</span>
                <span className={styles.cardPrice}>{guide.price}</span>
              </div>
              <h2 className={styles.cardTitle}>{guide.title}</h2>
              <p className={styles.cardDescription}>{guide.description}</p>
              <p className={styles.cardAudience}>{guide.audience}</p>
              <span className={styles.cardCta}>Get this guide →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.upsell}>
        <div className={styles.inner}>
          <p className={styles.upsellEyebrow}>Already have a guide?</p>
          <h2 className={styles.upsellTitle}>Browse the IP Gallery</h2>
          <p className={styles.upsellText}>
            The next step after the guides. Browse real profiles from screened, ready-to-match
            surrogates—before you commit to an agency or program.
          </p>
          <a
            href="https://portal.canadiansurrogacyoptions.com/gallery"
            className={styles.upsellCta}
          >
            Explore the Gallery →
          </a>
        </div>
      </section>
    </main>
  );
}
