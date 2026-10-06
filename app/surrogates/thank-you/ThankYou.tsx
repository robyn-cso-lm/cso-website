'use client';

import { useEffect } from 'react';
import { trackSurrogateApplication } from '@/lib/track';
import { AFTER_APPLYING } from '@/lib/surrogateScreen';

export default function ThankYou() {
  useEffect(() => {
    // Fires once per visit: this page is only reached after the application is submitted.
    trackSurrogateApplication('surrogate_application');
  }, []);

  return (
    <main style={{ background: '#FDFAF7', padding: '72px 20px 88px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B3FA0', fontWeight: 700, marginBottom: 12 }}>
          Application received
        </p>
        <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 'clamp(34px, 5vw, 52px)', fontWeight: 400, color: '#3D1A6E', lineHeight: 1.1, marginBottom: 16 }}>
          Thank you. We&rsquo;ve got it.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', marginBottom: 28 }}>
          A real person on our team will read your application personally, usually the same day.
          You don&rsquo;t need to do anything else right now.
        </p>
        <div style={{ background: '#fff', border: '1px solid #E8E0F5', borderRadius: 16, padding: '24px 26px' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B3FA0', fontWeight: 700, marginBottom: 14 }}>
            What happens next
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
            {AFTER_APPLYING.map((st, i) => (
              <li key={st.title} style={{ display: 'flex', gap: 14, fontSize: 15, lineHeight: 1.55, color: '#555' }}>
                <span style={{ flex: '0 0 28px', height: 28, borderRadius: '50%', background: '#E8E0F5', color: '#3D1A6E', fontWeight: 700, fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i + 1}
                </span>
                <span>
                  <strong style={{ color: '#3D1A6E' }}>{st.title}</strong>
                  {st.duration ? <em style={{ fontStyle: 'normal', color: '#777' }}> ({st.duration})</em> : null}
                  <span style={{ display: 'block' }}>{st.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: '#444', margin: '28px 0 6px' }}>
          Questions in the meantime? Reply to any of our emails, or{' '}
          <a href="https://calendly.com/cso-robyn" style={{ color: '#6B3FA0', fontWeight: 600 }}>book a time with Robyn</a>.
        </p>
        <p style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontStyle: 'italic', fontSize: 20, color: '#6B3FA0', marginTop: 20 }}>
          from hope to heartbeat to home
        </p>
      </div>
    </main>
  );
}
