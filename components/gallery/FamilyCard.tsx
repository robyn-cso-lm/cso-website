'use client';

import { useState } from 'react';

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

interface FamilyCardProps {
  profile: IPProfile;
  matched?: boolean;
}

const headingStyle: React.CSSProperties = {
  fontWeight: 700,
  color: '#3D1A6E',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '8px',
};

const bodyStyle: React.CSSProperties = {
  color: '#374151',
  fontSize: '0.9rem',
  lineHeight: 1.6,
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
};

export function FamilyCard({ profile, matched = false }: FamilyCardProps) {
  const [expanded, setExpanded] = useState(false);

  // A matched family shows the "Matched" ribbon instead of any marketing badge.
  const isFeatured = !matched && profile.listing_tier === 'cso_client' && Boolean(profile.spotlight_badge);
  const badgeBg = profile.spotlight_badge === 'Featured Family' ? '#C8973A' : '#6a2c91';

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: matched ? '1px solid #d9c7a3' : '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 16px rgba(61,26,110,0.06)',
        position: 'relative',
      }}
    >
      {matched && (
        <div
          aria-label="Matched"
          style={{
            position: 'absolute',
            top: '18px',
            left: '-34px',
            transform: 'rotate(-45deg)',
            background: 'linear-gradient(135deg, #C8973A, #a8761f)',
            color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '5px 40px',
            zIndex: 3,
            boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
          }}
        >
          Matched 💜
        </div>
      )}
      {/* Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '192px',
          backgroundImage: 'linear-gradient(135deg, #E8E0F5, #f0ebf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {profile.profile_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.profile_image_url}
            alt={profile.public_name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#A78BCC', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#8B6BA3', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
          </div>
        )}

        {isFeatured && (
          <div
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: badgeBg,
              color: '#fff',
              padding: '5px 12px',
              borderRadius: '100px',
              fontSize: '0.75rem',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {profile.spotlight_badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.5rem',
            fontWeight: 500,
            color: '#3D1A6E',
            marginBottom: '8px',
          }}
        >
          {profile.public_name}
        </h3>

        <p
          style={{
            ...bodyStyle,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 3,
            WebkitBoxOrient: 'vertical',
            overflow: expanded ? 'visible' : 'hidden',
          }}
        >
          {profile.profile_bio}
        </p>

        {expanded && (
          <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            {profile.profile_family_description && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={headingStyle}>Our Family</h4>
                <p style={bodyStyle}>{profile.profile_family_description}</p>
              </div>
            )}
            {profile.profile_looking_for && (
              <div>
                <h4 style={headingStyle}>What We&rsquo;re Looking For</h4>
                <p style={bodyStyle}>{profile.profile_looking_for}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            marginTop: 'auto',
            width: '100%',
            backgroundColor: '#3D1A6E',
            color: '#fff',
            padding: '11px 16px',
            borderRadius: '100px',
            fontWeight: 600,
            fontSize: '0.875rem',
            fontFamily: "'DM Sans', sans-serif",
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {expanded ? 'Hide Details' : 'Learn More'}
        </button>

        <p
          style={{
            fontSize: '0.72rem',
            color: '#6b7280',
            marginTop: '14px',
            textAlign: 'center',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          This is an anonymized profile. Contact CSO to learn more.
        </p>
      </div>
    </div>
  );
}
