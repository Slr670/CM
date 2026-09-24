import React from 'react';

interface GarudaEmblemProps {
  className?: string;
  size?: number;
}

export const GarudaEmblem: React.FC<GarudaEmblemProps> = ({ className = '', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="ตราสัญลักษณ์ ระบบแจ้งซ่อม"
    >
      <defs>
        {/* Glow & Shadow */}
        <filter id="garudaGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#dc2626" floodOpacity="0.4" />
        </filter>
        <linearGradient id="garudaRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="garudaGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="garudaCrown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      <g filter="url(#garudaGlow)">
        {/* Left Wing Outer Feathers */}
        <path
          d="M48 42 C38 28 22 20 8 26 C12 36 22 46 36 50 C24 48 14 52 10 60 C18 64 28 64 38 60 C26 64 18 72 16 80 C26 78 36 72 44 64 Z"
          fill="url(#garudaRed)"
        />
        {/* Right Wing Outer Feathers */}
        <path
          d="M52 42 C62 28 78 20 92 26 C88 36 78 46 64 50 C76 48 86 52 90 60 C82 64 72 64 62 60 C74 64 82 72 84 80 C74 78 64 72 56 64 Z"
          fill="url(#garudaRed)"
        />

        {/* Wing Feather Accents (Gold Highlights) */}
        <path
          d="M46 44 C38 34 26 30 16 34 C24 40 32 46 40 48 Z"
          fill="url(#garudaGold)"
          opacity="0.85"
        />
        <path
          d="M54 44 C62 34 74 30 84 34 C76 40 68 46 60 48 Z"
          fill="url(#garudaGold)"
          opacity="0.85"
        />

        {/* Tail Feathers */}
        <path
          d="M44 68 C40 78 36 88 42 94 C46 88 48 80 50 72 C52 80 54 88 58 94 C64 88 60 78 56 68 Z"
          fill="url(#garudaRed)"
        />
        <path
          d="M48 70 C47 78 46 86 50 90 C54 86 53 78 52 70 Z"
          fill="url(#garudaGold)"
        />

        {/* Torso & Musculature */}
        <path
          d="M44 40 C44 34 46 32 50 32 C54 32 56 34 56 40 C56 48 58 54 58 62 C58 66 54 68 50 68 C46 68 42 66 42 62 C42 54 44 48 44 40 Z"
          fill="url(#garudaGold)"
        />
        {/* Chest Armor / Ornaments */}
        <path
          d="M46 42 L50 48 L54 42 L50 38 Z"
          fill="#dc2626"
        />
        <circle cx="50" cy="54" r="2.5" fill="#dc2626" />
        <path
          d="M45 58 Q50 62 55 58"
          stroke="#b45309"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Arms Raised in Majestics */}
        <path
          d="M43 42 C36 40 30 36 28 32 C28 36 34 44 42 46 Z"
          fill="url(#garudaGold)"
        />
        <path
          d="M57 42 C64 40 70 36 72 32 C72 36 66 44 58 46 Z"
          fill="url(#garudaGold)"
        />

        {/* Head & Beak */}
        <circle cx="50" cy="27" r="6" fill="url(#garudaGold)" />
        <path
          d="M48 29 C48 33 50 36 50 36 C50 36 52 33 52 29 Z"
          fill="#ca8a04"
        />
        {/* Curved Beak */}
        <path
          d="M49 27 Q50 32 53 30 Q51 28 49 27 Z"
          fill="#78350f"
        />

        {/* Royal Crown (Chada) */}
        <path
          d="M46 22 L50 6 L54 22 L52 24 L48 24 Z"
          fill="url(#garudaCrown)"
        />
        {/* Crown tiers & gem */}
        <path
          d="M47 18 L50 12 L53 18 Z"
          fill="#fef08a"
        />
        <circle cx="50" cy="11" r="1.5" fill="#dc2626" />
      </g>
    </svg>
  );
};
