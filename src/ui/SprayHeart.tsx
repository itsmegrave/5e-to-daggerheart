import { useId } from 'react';

/** A spray-painted heart: violet fill, ink outline, paint drips and overspray dots. */
export function SprayHeart({ size = 44 }: { size?: number }) {
  const blur = useId().replace(/:/g, '');
  return (
    <svg
      className="spray-heart"
      width={size}
      height={size * 1.25}
      viewBox="0 0 64 80"
      role="img"
      aria-label="💜"
    >
      <defs>
        <filter id={blur} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      {/* Overspray halo */}
      <path
        d="M32 56 C 12 42, 3 30, 9 18 C 14 7, 28 8, 32 20 C 36 8, 50 7, 55 18 C 61 30, 52 43, 32 56 Z"
        fill="var(--fear)"
        opacity="0.35"
        filter={`url(#${blur})`}
      />
      {/* Drips running down from the bottom of the heart */}
      <path d="M25 49 C 25.5 56, 24 62, 24.6 67 A 2.1 2.1 0 0 0 28.8 67 C 29 61, 28 55, 28.6 51 Z" fill="var(--fear)" className="heart-line" stroke="var(--ink)" strokeWidth="2" />
      <path d="M37 50 C 37.4 54, 36.8 57, 37.2 59.5 A 1.8 1.8 0 0 0 40.8 59.5 C 40.8 56, 40.2 53, 40.6 48 Z" fill="var(--fear)" className="heart-line" stroke="var(--ink)" strokeWidth="2" />
      {/* The heart, drawn a little lopsided like a quick tag */}
      <path
        d="M32 56 C 12 42, 3 30, 9 18 C 14 7, 28 8, 32 20 C 36 8, 50 7, 55 18 C 61 30, 52 43, 32 56 Z"
        fill="var(--fear)"
        className="heart-line" stroke="var(--ink)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Highlight stroke */}
      <path d="M16 20 C 18 14, 24 13, 27 17" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      {/* Overspray dots */}
      <circle cx="58" cy="10" r="1.6" fill="var(--fear)" />
      <circle cx="61" cy="16" r="1" fill="var(--fear)" />
      <circle cx="5" cy="40" r="1.3" fill="var(--fear)" />
      <circle cx="50" cy="52" r="1.1" fill="var(--fear)" />
      <circle cx="9" cy="9" r="0.9" fill="var(--fear)" />
    </svg>
  );
}
