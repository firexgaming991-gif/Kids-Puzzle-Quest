import React from 'react';

interface ShadowShapeProps {
  shape: string;
  size?: number;
  isShadow?: boolean;
}

export const ShadowShape: React.FC<ShadowShapeProps> = ({
  shape,
  size = 140,
  isShadow = true,
}) => {
  const fillColor = isShadow ? '#334155' : 'currentColor';
  const filterStyle = isShadow ? 'drop-shadow(0 6px 12px rgba(15, 23, 42, 0.25))' : undefined;

  switch (shape) {
    case 'star':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ filter: filterStyle }}
          className="transition-transform duration-300 hover:scale-105"
        >
          <polygon
            points="50,5 64,36 98,38 72,61 80,95 50,77 20,95 28,61 2,38 36,36"
            fill={fillColor}
          />
        </svg>
      );

    case 'butterfly':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ filter: filterStyle }}
          className="transition-transform duration-300 hover:scale-105"
        >
          {/* Wings */}
          <path
            d="M50 48 C35 15, 5 22, 10 52 C15 70, 38 78, 50 62 Z"
            fill={fillColor}
          />
          <path
            d="M50 48 C65 15, 95 22, 90 52 C85 70, 62 78, 50 62 Z"
            fill={fillColor}
          />
          <path
            d="M50 58 C38 68, 20 75, 25 88 C30 96, 45 90, 50 72 Z"
            fill={fillColor}
          />
          <path
            d="M50 58 C62 68, 80 75, 75 88 C70 96, 55 90, 50 72 Z"
            fill={fillColor}
          />
          {/* Body and Antennae */}
          <ellipse cx="50" cy="55" rx="3.5" ry="16" fill={fillColor} />
          <circle cx="50" cy="35" r="4.5" fill={fillColor} />
          <path
            d="M50 32 Q42 22 38 20 M50 32 Q58 22 62 20"
            stroke={fillColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case 'bear':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ filter: filterStyle }}
          className="transition-transform duration-300 hover:scale-105"
        >
          {/* Bear ears */}
          <circle cx="28" cy="28" r="14" fill={fillColor} />
          <circle cx="72" cy="28" r="14" fill={fillColor} />
          {/* Head */}
          <circle cx="50" cy="50" r="32" fill={fillColor} />
          {/* Snout */}
          <ellipse cx="50" cy="57" rx="16" ry="12" fill={isShadow ? fillColor : '#FED7AA'} />
          <ellipse cx="50" cy="53" rx="6" ry="4" fill={isShadow ? '#1E293B' : '#78350F'} />
        </svg>
      );

    case 'rocket':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ filter: filterStyle }}
          className="transition-transform duration-300 hover:scale-105"
        >
          {/* Rocket Body */}
          <path
            d="M50 10 C62 28, 65 58, 62 75 L38 75 C35 58, 38 28, 50 10 Z"
            fill={fillColor}
          />
          {/* Wings */}
          <path d="M38 60 L18 80 L35 75 Z" fill={fillColor} />
          <path d="M62 60 L82 80 L65 75 Z" fill={fillColor} />
          {/* Booster */}
          <path d="M42 75 L45 84 L55 84 L58 75 Z" fill={fillColor} />
        </svg>
      );

    case 'apple':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ filter: filterStyle }}
          className="transition-transform duration-300 hover:scale-105"
        >
          {/* Stem & Leaf */}
          <path
            d="M50 24 C50 15, 54 8, 58 6"
            stroke={fillColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M52 18 C64 12, 70 20, 68 24 C58 26, 54 22, 52 18 Z"
            fill={fillColor}
          />
          {/* Apple fruit shape */}
          <path
            d="M50 30 C38 22, 18 30, 20 54 C22 74, 40 88, 50 86 C60 88, 78 74, 80 54 C82 30, 62 22, 50 30 Z"
            fill={fillColor}
          />
        </svg>
      );

    default:
      return (
        <div className="w-24 h-24 rounded-2xl bg-slate-700 flex items-center justify-center text-white text-3xl shadow-md">
          ❓
        </div>
      );
  }
};
