import React from 'react';
import { motion } from 'motion/react';

export interface TopStatItem {
  id: string;
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  ghostIcon?: React.ReactNode;
  color: 'orange' | 'green' | 'red' | 'blue' | 'yellow' | 'purple' | 'zinc';
}

interface TopStatStripProps {
  items: TopStatItem[];
}

export const TopStatStrip: React.FC<TopStatStripProps> = ({ items }) => {
  const getThemeStyles = (color: TopStatItem['color']) => {
    switch (color) {
      case 'orange':
        return {
          badge:
            'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.18)]',
          label: 'text-orange-400/90',
          gradient: 'radial-gradient(circle at 90% 90%, rgba(249, 115, 22, 0.15) 0%, transparent 68%)',
          ghostColor: 'text-orange-500',
          borderHover: 'hover:border-orange-500/40',
        };
      case 'green':
        return {
          badge:
            'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.18)]',
          label: 'text-emerald-400/90',
          gradient: 'radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.15) 0%, transparent 68%)',
          ghostColor: 'text-emerald-500',
          borderHover: 'hover:border-emerald-500/40',
        };
      case 'red':
        return {
          badge:
            'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.18)]',
          label: 'text-rose-400/90',
          gradient: 'radial-gradient(circle at 90% 90%, rgba(244, 63, 94, 0.15) 0%, transparent 68%)',
          ghostColor: 'text-rose-500',
          borderHover: 'hover:border-rose-500/40',
        };
      case 'blue':
        return {
          badge:
            'bg-sky-500/10 border-sky-500/30 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.18)]',
          label: 'text-sky-400/90',
          gradient: 'radial-gradient(circle at 90% 90%, rgba(14, 165, 233, 0.15) 0%, transparent 68%)',
          ghostColor: 'text-sky-500',
          borderHover: 'hover:border-sky-500/40',
        };
      case 'yellow':
        return {
          badge:
            'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.18)]',
          label: 'text-amber-400/90',
          gradient: 'radial-gradient(circle at 90% 90%, rgba(245, 158, 11, 0.15) 0%, transparent 68%)',
          ghostColor: 'text-amber-500',
          borderHover: 'hover:border-amber-500/40',
        };
      case 'purple':
        return {
          badge:
            'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.18)]',
          label: 'text-purple-400/90',
          gradient: 'radial-gradient(circle at 90% 90%, rgba(168, 85, 247, 0.15) 0%, transparent 68%)',
          ghostColor: 'text-purple-500',
          borderHover: 'hover:border-purple-500/40',
        };
      default:
        return {
          badge: 'bg-zinc-800/80 border-zinc-700/60 text-zinc-400',
          label: 'text-zinc-400',
          gradient: 'radial-gradient(circle at 90% 90%, rgba(161, 161, 170, 0.08) 0%, transparent 68%)',
          ghostColor: 'text-zinc-500',
          borderHover: 'hover:border-zinc-700',
        };
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {items.map((item, index) => {
        const theme = getThemeStyles(item.color);

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
            whileHover={{ y: -3 }}
            className={`group relative overflow-hidden rounded-[1.75rem] bg-zinc-900 border border-zinc-800/80 p-5 ${theme.borderHover} transition-all duration-300 flex flex-col justify-between select-none shadow-md`}
          >
            {/* Layer 2: Subtle Grid / Dot Texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 z-0"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
                backgroundSize: '15px 15px',
              }}
            />

            {/* Layer 3: Semantic Colored Gradient Glow */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-80 group-hover:opacity-100 z-0"
              style={{
                background: theme.gradient,
              }}
            />

            {/* Layer 4: Large Ghost Watermark Icon (Positioned toward right / bottom-right) */}
            <div
              className={`absolute -bottom-2.5 -right-2.5 w-24 h-24 pointer-events-none select-none z-0 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-15 opacity-[0.07] ${theme.ghostColor} flex items-center justify-center`}
              aria-hidden="true"
            >
              {React.isValidElement(item.ghostIcon || item.icon) ? (
                React.cloneElement((item.ghostIcon || item.icon) as React.ReactElement<{ className?: string }>, {
                  className: 'w-24 h-24 stroke-[1.2]',
                })
              ) : (
                <div className="w-24 h-24" />
              )}
            </div>

            {/* Top Row: Small Icon Badge (Layer 1) & Stat Label */}
            <div className="flex items-center gap-3 relative z-10 mb-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`w-11 h-11 rounded-2xl border backdrop-blur-md flex items-center justify-center transition-all ${theme.badge}`}
              >
                {React.isValidElement(item.icon) ? (
                  React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                    className: 'w-5 h-5',
                  })
                ) : (
                  item.icon
                )}
              </motion.div>
              <span className={`text-xs font-semibold tracking-wide truncate ${theme.label}`}>
                {item.label}
              </span>
            </div>

            {/* Layer 2: Main Stat Value */}
            <div className="relative z-10 mt-1">
              <div className="text-3xl sm:text-[2rem] font-bold tracking-tight text-white">
                {item.value}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
