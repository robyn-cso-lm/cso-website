'use client';

import { useEffect, useState } from 'react';
import { FamilyCard } from './FamilyCard';

interface IPProfile {
  id: string;
  public_name: string;
  profile_bio: string;
  profile_family_description: string;
  profile_looking_for: string;
  profile_image_url?: string;
  spotlight_badge?: string;
  listing_tier?: string;
  match_status?: string;
  matched_at?: string;
}

const API_URLS = [
  'https://cso-lm-portal-production.up.railway.app/api/public/ip-profiles',
  'http://localhost:5173/api/public/ip-profiles',
];

export function GalleryGrid() {
  const [profiles, setProfiles] = useState<IPProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        let response: Response | undefined;
        let lastError: unknown;
        for (const url of API_URLS) {
          try {
            response = await fetch(url);
            if (response.ok) break;
          } catch (e) {
            lastError = e;
          }
        }
        if (!response?.ok) throw lastError || new Error('Failed to fetch profiles');

        const data = await response.json();
        const list: IPProfile[] = Array.isArray(data) ? data : [];
        // Map the API's photo field to an absolute URL. Gallery photos are
        // curated artistic portraits (flagged visible_to_surrogates in the
        // portal), so they show for anonymized profiles too.
        const mapped = list.map((p: IPProfile & { primary_photo_url?: string }) => ({
          ...p,
          profile_image_url: p.primary_photo_url
            ? `https://cso-lm-portal-production.up.railway.app${p.primary_photo_url}`
            : undefined,
        }));
        // VIP (featured) families lead the gallery
        const isVip = (p: IPProfile) => p.listing_tier === 'featured' || p.spotlight_badge === 'Featured Family';
        mapped.sort((a, b) => Number(isVip(b)) - Number(isVip(a)));
        setProfiles(mapped);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        if (isDev) {
          setProfiles([
            {
              id: 'mock-1',
              public_name: 'Theo & Zara',
              profile_bio:
                "Theo and Zara are two hard-working, fun-loving, food-obsessed people who found each other and built something truly beautiful. Married and together for five years, they are each other's biggest strength.",
              profile_family_description:
                "We have two rescue dogs and a cottage we're in most weekends. Our home is full of laughter and warmth.",
              profile_looking_for:
                'A surrogate who values open communication and sees this journey as a partnership.',
              spotlight_badge: 'Featured Family',
              listing_tier: 'cso_client',
            },
          ]);
        } else {
          setError('Unable to load family profiles right now. Please try again later, or contact us and we’ll help.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            margin: '0 auto',
            border: '3px solid rgba(61,26,110,0.15)',
            borderBottomColor: '#3D1A6E',
            borderRadius: '50%',
            animation: 'cso-spin 0.8s linear infinite',
          }}
        />
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#4A3560', marginTop: '16px' }}>
          Loading families…
        </p>
        <style>{`@keyframes cso-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <div
          style={{
            display: 'inline-block',
            background: '#FBF1DC',
            border: '1px solid #E6C98A',
            color: '#6b4e1f',
            padding: '18px 24px',
            borderRadius: '12px',
            fontFamily: "'DM Sans', sans-serif",
            maxWidth: '440px',
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: '4px' }}>We couldn’t load the gallery</p>
          <p style={{ fontSize: '14px' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0', fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ color: '#4A3560', fontSize: '17px' }}>No families are currently featured in the gallery.</p>
        <p style={{ color: '#6b7280', marginTop: '8px' }}>
          Check back soon for more families waiting to meet their surrogate.
        </p>
      </div>
    );
  }

  const seeking = profiles.filter((p) => p.match_status !== 'matched');
  const matched = profiles.filter((p) => p.match_status === 'matched');

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  };

  return (
    <div>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: '#4A3560',
          marginBottom: '32px',
          textAlign: 'center',
        }}
      >
        Showing {seeking.length} {seeking.length === 1 ? 'family' : 'families'} seeking a surrogate
      </p>

      {seeking.length > 0 ? (
        <div style={gridStyle}>
          {seeking.map((profile) => (
            <FamilyCard key={profile.id} profile={profile} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#6b7280', fontFamily: "'DM Sans', sans-serif" }}>
          All of our featured families have been matched — check back soon for new families.
        </p>
      )}

      {matched.length > 0 && (
        <section style={{ marginTop: '72px' }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#3D1A6E',
              }}
            >
              Recently Matched <span aria-hidden>💜</span>
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                color: '#6b5b80',
                maxWidth: '560px',
                margin: '6px auto 0',
              }}
            >
              These families found their surrogate through Canadian Surrogacy Options. Every match is a
              new story beginning.
            </p>
          </div>
          <div style={{ ...gridStyle, marginTop: '28px' }}>
            {matched.map((profile) => (
              <FamilyCard key={profile.id} profile={profile} matched />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
