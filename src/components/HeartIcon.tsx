import React from 'react';

interface HeartIconProps {
  className?: string;
  filled?: boolean;
}

export const HeartIcon: React.FC<HeartIconProps> = ({ className = '', filled = true }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      className={className}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
};

export const FloatingHearts: React.FC = () => {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 10 + Math.random() * 20,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-primary animate-float"
          style={{
            left: `${heart.left}%`,
            bottom: '-50px',
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            opacity: heart.opacity,
          }}
        >
          <HeartIcon className={`w-${Math.round(heart.size / 4)} h-${Math.round(heart.size / 4)}`} />
        </div>
      ))}
    </div>
  );
};
