import React from 'react';
import { motion } from 'motion/react';

interface Floating3DObjectProps {
  className?: string;
  size?: number;
}

export const Floating3DObject: React.FC<Floating3DObjectProps> = ({
  className = '',
  size = 130,
}) => {
  return (
    <motion.div
      className={`relative select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -8, 0],
        x: [0, 4, 0],
        rotate: [0, 30, -30, 0],
        scale: [1, 1.025, 1],
      }}
      transition={{
        duration: 5.5,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
    >
      {/* Ambient Outer Light Bloom */}
      <div
        className="absolute inset-2 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(249, 115, 22, 0.45) 0%, rgba(234, 88, 12, 0.2) 45%, transparent 70%)',
          animationDuration: '4s',
        }}
      />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(249,115,22,0.35)]"
      >
        <defs>
          {/* Glowing Orange Edge Gradient */}
          <linearGradient id="neonOrangeRim" x1="20" y1="30" x2="180" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#f97316" stopOpacity="1" />
            <stop offset="60%" stopColor="#fb923c" stopOpacity="1" />
            <stop offset="85%" stopColor="#ea580c" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.8" />
          </linearGradient>

          {/* Dark Glass / Obsidian Body Shader */}
          <radialGradient id="glassBodyDark" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#27272a" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#18181b" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#09090b" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.98" />
          </radialGradient>

          {/* Internal Warm Refraction */}
          <linearGradient id="internalWarmRefraction" x1="70" y1="60" x2="140" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ea580c" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* Specular Edge Highlights */}
          <linearGradient id="specularRim" x1="40" y1="30" x2="160" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="45%" stopColor="#ffedd5" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="rimGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 3D Glass Body (Curved Asymmetric Toroid / Mobius Loop) */}
        <path
          d="M96 36 C134 32, 168 56, 172 94 C176 132, 144 168, 108 172 C70 176, 34 148, 30 110 C26 70, 56 39, 96 36 Z"
          fill="url(#glassBodyDark)"
          stroke="#27272a"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Inner negative loop creating the 3D hollow twisted tunnel */}
        <path
          d="M98 72 C120 70, 136 84, 138 106 C140 128, 122 144, 102 146 C80 148, 64 132, 62 112 C60 90, 76 73, 98 72 Z"
          fill="#09090b"
          opacity="0.85"
        />

        {/* Internal ambient orange refraction layer */}
        <path
          d="M96 36 C134 32, 168 56, 172 94 C176 132, 144 168, 108 172 C70 176, 34 148, 30 110 C26 70, 56 39, 96 36 Z"
          fill="url(#internalWarmRefraction)"
        />

        {/* 3D Twisted Fold Lip - Lower Rim (Glowing bright orange rim matching reference) */}
        <path
          d="M48 116 C60 148, 92 166, 126 156 C152 148, 168 126, 166 100 C162 120, 138 140, 110 144 C82 148, 56 138, 48 116 Z"
          fill="url(#neonOrangeRim)"
          filter="url(#rimGlow)"
        />

        {/* Glowing Orange Main Rim Contour */}
        <path
          d="M46 114 C58 148, 90 166, 128 156 C156 148, 170 124, 168 98"
          stroke="url(#neonOrangeRim)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Inner Glowing Rim (Twist depth) */}
        <path
          d="M80 82 C104 74, 132 84, 142 108 C136 124, 118 136, 96 138 C74 140, 60 126, 64 106"
          stroke="url(#neonOrangeRim)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Crisp Top Specular Highlight Streak */}
        <path
          d="M74 42 C102 36, 134 46, 154 68"
          stroke="url(#specularRim)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Secondary Delicate Specular Edge */}
        <path
          d="M100 78 C116 75, 130 84, 134 98"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Intense Neon Flare at the crest */}
        <circle cx="128" cy="154" r="3" fill="#ffffff" filter="url(#rimGlow)" />
        <circle cx="48" cy="116" r="2.5" fill="#ffedd5" filter="url(#rimGlow)" />
      </svg>
    </motion.div>
  );
};
