'use client';

interface CoupleIllustrationProps {
  familyId: string;
  familyName?: string;
}

// Simple hash function to consistently select an illustration
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

const COUPLE_ILLUSTRATIONS = [
  // Couple 1: Black couple (woman/man)
  () => (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#F5E6D3', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#E8D5C4', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bg1)" />
      {/* Woman on left */}
      <circle cx="140" cy="80" r="35" fill="#8B5A3C" />
      <path d="M 110 120 Q 100 140 110 180 L 170 180 Q 180 140 170 120 Z" fill="#A0714F" />
      <circle cx="105" cy="145" r="8" fill="#8B5A3C" />
      <circle cx="175" cy="145" r="8" fill="#8B5A3C" />
      {/* Man on right */}
      <circle cx="260" cy="90" r="32" fill="#5D4037" />
      <path d="M 235 135 Q 225 160 235 200 L 285 200 Q 295 160 285 135 Z" fill="#6D4C41" />
      <circle cx="230" cy="160" r="7" fill="#5D4037" />
      <circle cx="290" cy="160" r="7" fill="#5D4037" />
      {/* Hands together */}
      <path d="M 165 165 Q 180 160 190 170" stroke="#A0714F" strokeWidth="12" fill="none" strokeLinecap="round" />
    </svg>
  ),

  // Couple 2: Asian couple (woman/man)
  () => (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FDF8F3', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#F5EDE5', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bg2)" />
      {/* Woman on left */}
      <circle cx="140" cy="85" r="32" fill="#D4A574" />
      <path d="M 115 125 Q 105 150 115 185 L 165 185 Q 175 150 165 125 Z" fill="#E5B896" />
      <circle cx="110" cy="150" r="7" fill="#D4A574" />
      <circle cx="170" cy="150" r="7" fill="#D4A574" />
      {/* Man on right */}
      <circle cx="260" cy="95" r="30" fill="#C89968" />
      <path d="M 237 140 Q 228 165 237 205 L 283 205 Q 292 165 283 140 Z" fill="#D4A574" />
      <circle cx="233" cy="165" r="6" fill="#C89968" />
      <circle cx="287" cy="165" r="6" fill="#C89968" />
      {/* Hands */}
      <path d="M 160 170 Q 175 165 190 175" stroke="#E5B896" strokeWidth="11" fill="none" strokeLinecap="round" />
    </svg>
  ),

  // Couple 3: White couple (woman/man)
  () => (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FCF6F0', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#F5ECDC', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bg3)" />
      {/* Woman on left */}
      <circle cx="140" cy="80" r="33" fill="#F4D4B8" />
      <path d="M 115 122 Q 105 145 115 180 L 165 180 Q 175 145 165 122 Z" fill="#F9E0CC" />
      <circle cx="110" cy="148" r="7" fill="#F4D4B8" />
      <circle cx="170" cy="148" r="7" fill="#F4D4B8" />
      {/* Man on right */}
      <circle cx="260" cy="92" r="31" fill="#E8D4BB" />
      <path d="M 236 135 Q 226 160 236 198 L 284 198 Q 294 160 284 135 Z" fill="#F0E0CC" />
      <circle cx="231" cy="160" r="7" fill="#E8D4BB" />
      <circle cx="289" cy="160" r="7" fill="#E8D4BB" />
      {/* Hands together */}
      <path d="M 163 165 Q 180 160 193 172" stroke="#F9E0CC" strokeWidth="12" fill="none" strokeLinecap="round" />
    </svg>
  ),

  // Couple 4: Brown/Latin couple (woman/woman)
  () => (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#F8EAE0', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#F0DCC8', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bg4)" />
      {/* Woman on left */}
      <circle cx="130" cy="85" r="32" fill="#B8895C" />
      <path d="M 105 127 Q 95 150 105 185 L 155 185 Q 165 150 155 127 Z" fill="#C9966F" />
      <circle cx="100" cy="152" r="7" fill="#B8895C" />
      <circle cx="160" cy="152" r="7" fill="#B8895C" />
      {/* Woman on right */}
      <circle cx="270" cy="90" r="32" fill="#A67B53" />
      <path d="M 245 132 Q 235 155 245 190 L 295 190 Q 305 155 295 132 Z" fill="#B8895C" />
      <circle cx="240" cy="157" r="7" fill="#A67B53" />
      <circle cx="300" cy="157" r="7" fill="#A67B53" />
      {/* Hands together in center */}
      <path d="M 155 168 Q 200 165 245 168" stroke="#C9966F" strokeWidth="11" fill="none" strokeLinecap="round" />
    </svg>
  ),

  // Couple 5: Mixed race couple (man/man)
  () => (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#F7E8DC', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#EDDBCE', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bg5)" />
      {/* Man on left */}
      <circle cx="130" cy="90" r="30" fill="#6D4C41" />
      <path d="M 107 135 Q 97 160 107 200 L 153 200 Q 163 160 153 135 Z" fill="#7D5C51" />
      <circle cx="102" cy="160" r="6" fill="#6D4C41" />
      <circle cx="158" cy="160" r="6" fill="#6D4C41" />
      {/* Man on right */}
      <circle cx="270" cy="88" r="31" fill="#D4A574" />
      <path d="M 246 133 Q 236 158 246 198 L 294 198 Q 304 158 294 133 Z" fill="#E5B896" />
      <circle cx="241" cy="158" r="7" fill="#D4A574" />
      <circle cx="299" cy="158" r="7" fill="#D4A574" />
      {/* Hands together */}
      <path d="M 150 175 Q 200 170 246 175" stroke="#8B6F63" strokeWidth="11" fill="none" strokeLinecap="round" />
    </svg>
  ),

  // Couple 6: Middle Eastern couple
  () => (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg6" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FAF0E8', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#F2E6DC', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bg6)" />
      {/* Woman on left */}
      <circle cx="140" cy="82" r="33" fill="#C9956B" />
      <path d="M 115 124 Q 105 148 115 182 L 165 182 Q 175 148 165 124 Z" fill="#D9A885" />
      <circle cx="110" cy="150" r="7" fill="#C9956B" />
      <circle cx="170" cy="150" r="7" fill="#C9956B" />
      {/* Man on right */}
      <circle cx="260" cy="92" r="30" fill="#9B7653" />
      <path d="M 237 137 Q 227 162 237 200 L 283 200 Q 293 162 283 137 Z" fill="#A9845E" />
      <circle cx="232" cy="162" r="6" fill="#9B7653" />
      <circle cx="288" cy="162" r="6" fill="#9B7653" />
      {/* Hands */}
      <path d="M 162 167 Q 180 162 191 173" stroke="#D9A885" strokeWidth="12" fill="none" strokeLinecap="round" />
    </svg>
  ),

  // Couple 7: South Asian couple
  () => (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg7" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#F9F1EA', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#F1E8DC', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bg7)" />
      {/* Woman on left */}
      <circle cx="140" cy="83" r="32" fill="#C29863" />
      <path d="M 115 125 Q 105 148 115 183 L 165 183 Q 175 148 165 125 Z" fill="#D4AC7F" />
      <circle cx="110" cy="150" r="7" fill="#C29863" />
      <circle cx="170" cy="150" r="7" fill="#C29863" />
      {/* Man on right */}
      <circle cx="260" cy="93" r="31" fill="#8B6F47" />
      <path d="M 236 138 Q 226 163 236 201 L 284 201 Q 294 163 284 138 Z" fill="#9B7F57" />
      <circle cx="231" cy="163" r="7" fill="#8B6F47" />
      <circle cx="289" cy="163" r="7" fill="#8B6F47" />
      {/* Hands */}
      <path d="M 163 168 Q 180 163 192 174" stroke="#D4AC7F" strokeWidth="12" fill="none" strokeLinecap="round" />
    </svg>
  ),
];

export function CoupleIllustration({ familyId, familyName }: CoupleIllustrationProps) {
  const hash = hashString(familyId);
  const illustrationIndex = hash % COUPLE_ILLUSTRATIONS.length;
  const IllustrationComponent = COUPLE_ILLUSTRATIONS[illustrationIndex];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <IllustrationComponent />
    </div>
  );
}
