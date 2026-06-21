import type { Metadata } from 'next';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';

export const metadata: Metadata = {
  title: 'Families Waiting for a Surrogate in Canada',
  description:
    'Meet families waiting to grow through surrogacy. Browse anonymized family profiles and discover real stories of hope.',
  alternates: { canonical: 'https://canadiansurrogacyoptions.com/gallery' },
};

export default function GalleryPage() {
  return (
    <main style={{ background: '#fff' }}>
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, #3D1A6E 0%, #5a2d8f 100%)',
          color: '#fff',
          padding: '64px 24px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(34px, 5vw, 52px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            Surrogate <span style={{ color: '#C8973A' }}>Connection</span> Gallery
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '17px',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.6,
              maxWidth: '640px',
              marginBottom: '24px',
            }}
          >
            Meet real families seeking surrogates. Every profile here is a story of hope,
            resilience, and the desire to build a family.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span style={badgeStyle}>✓ Completely Anonymized</span>
            <span style={badgeStyle}>✓ CSO Families Featured</span>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <GalleryGrid />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#3D1A6E', color: '#fff', padding: '64px 24px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(28px, 4vw, 38px)',
              fontWeight: 400,
              marginBottom: '14px',
            }}
          >
            Are you a family ready to be seen?
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}
          >
            Join our Surrogate Connection Gallery and increase your visibility with surrogates who
            are actively looking.
          </p>
          <a
            href="https://portal.canadiansurrogacyoptions.com"
            style={{
              display: 'inline-block',
              background: '#C8973A',
              color: '#3D1A6E',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '15px',
              fontWeight: 600,
              padding: '14px 32px',
              borderRadius: '100px',
              textDecoration: 'none',
            }}
          >
            Join the Gallery
          </a>
        </div>
      </section>
    </main>
  );
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  background: '#C8973A',
  color: '#3D1A6E',
  padding: '8px 16px',
  borderRadius: '8px',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '14px',
  fontWeight: 600,
};
