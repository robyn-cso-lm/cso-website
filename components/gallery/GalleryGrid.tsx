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
        setProfiles(Array.isArray(data) ? data : []);
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
        Showing {profiles.length} {profiles.length === 1 ? 'family' : 'families'}
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {profiles.map((profile) => (
          <FamilyCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
}
