import React from 'react';

interface StarRatingProps {
  stars: number; // 0 to 3
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  stars,
  maxStars = 3,
  size = 'md',
  animated = false,
}) => {
  const sizeMap = {
    sm: 'w-5 h-5 text-sm',
    md: 'w-8 h-8 text-xl',
    lg: 'w-12 h-12 text-3xl',
  };

  return (
    <div className="flex items-center gap-1.5 select-none" dir="ltr">
      {Array.from({ length: maxStars }).map((_, idx) => {
        const isFilled = idx < stars;
        return (
          <div
            key={idx}
            className={`flex items-center justify-center transition-all duration-300 ${
              isFilled ? 'text-amber-400 scale-100' : 'text-slate-300 scale-95'
            } ${animated && isFilled ? 'animate-bounce' : ''}`}
            style={{
              animationDelay: `${idx * 160}ms`,
            }}
          >
            <svg
              className={`${sizeMap[size]} ${
                isFilled
                  ? 'fill-amber-400 filter drop-shadow(0 2px 4px rgba(245, 158, 11, 0.4))'
                  : 'fill-slate-200'
              }`}
              viewBox="0 0 24 24"
              stroke={isFilled ? '#D97706' : '#94A3B8'}
              strokeWidth="1.5"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
