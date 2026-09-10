import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  category?: string;
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  ghostIcon?: React.ReactNode;
  color?: 'orange' | 'green' | 'red' | 'blue' | 'yellow' | 'zinc';
  growth?: {
    rate: string;
    positive: boolean;
    period?: string;
  };
  metrics?: { label: string; value: React.ReactNode }[];
  floatingElement?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  category,
  title,
  value,
  icon,
  ghostIcon,
  color = 'orange',
  growth,
  metrics,
  floatingElement,
  children,
  className = '',
}) => {
  const getThemeStyles = () => {
    switch (color) {
      case 'orange':
        return {
          glow: 'radial-gradient(circle at 85% 85%, rgba(249, 115, 22, 0.16) 0%, transparent 65%)',
          ghost: 'text-orange-500',
          badge: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          hoverBorder: 'hover:border-orange-500/30',
        };
      case 'green':
        return {
          glow: 'radial-gradient(circle at 85% 85%, rgba(16, 185, 129, 0.16) 0%, transparent 65%)',
          ghost: 'text-emerald-500',
          badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          hoverBorder: 'hover:border-emerald-500/30',
        };
      case 'red':
        return {
          glow: 'radial-gradient(circle at 85% 85%, rgba(244, 63, 94, 0.16) 0%, transparent 65%)',
          ghost: 'text-rose-500',
          badge: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          hoverBorder: 'hover:border-rose-500/30',
        };
      case 'yellow':
        return {
          glow: 'radial-gradient(circle at 85% 85%, rgba(245, 158, 11, 0.16) 0%, transparent 65%)',
          ghost: 'text-amber-500',
          badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          hoverBorder: 'hover:border-amber-500/30',
        };
      case 'blue':
        return {
          glow: 'radial-gradient(circle at 85% 85%, rgba(14, 165, 233, 0.16) 0%, transparent 65%)',
          ghost: 'text-sky-500',
          badge: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
          hoverBorder: 'hover:border-sky-500/30',
        };
      default:
        return {
          glow: 'radial-gradient(circle at 85% 85%, rgba(161, 161, 170, 0.08) 0%, transparent 65%)',
          ghost: 'text-zinc-500',
          badge: 'bg-zinc-800 border-zinc-700 text-zinc-300',
          hoverBorder: 'hover:border-zinc-750',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
      className={`group relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800/90 p-6 ${theme.hoverBorder} transition-all duration-300 flex flex-col justify-between shadow-xl ${className}`}
    >
      {/* Grid Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Semantic Radial Gradient */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-70 group-hover:opacity-100 z-0"
        style={{ background: theme.glow }}
      />

      {/* Background Ghost Icon Watermark */}
      {(ghostIcon || icon) && (
        <div
          className={`absolute -bottom-4 -right-4 w-36 h-36 pointer-events-none select-none z-0 transition-transform duration-500 group-hover:scale-105 opacity-[0.06] ${theme.ghost} flex items-center justify-center`}
          aria-hidden="true"
        >
          {React.isValidElement(ghostIcon || icon) ? (
            React.cloneElement((ghostIcon || icon) as React.ReactElement<{ className?: string }>, {
              className: 'w-36 h-36 stroke-[1]',
            })
          ) : null}
        </div>
      )}

      {/* Floating 3D Object (if provided) */}
      {floatingElement && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none hidden sm:block">
          {floatingElement}
        </div>
      )}

      {/* Top Header inside Card */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`w-10 h-10 rounded-2xl border backdrop-blur-md flex items-center justify-center ${theme.badge}`}>
              {React.isValidElement(icon) ? (
                React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                  className: 'w-4 h-4',
                })
              ) : (
                icon
              )}
            </div>
          )}
          <div>
            {category && (
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">
                {category}
              </span>
            )}
            <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
          </div>
        </div>
      </div>

      {/* Main Value & Metrics */}
      <div className="my-4 relative z-10">
        <div className="flex flex-wrap items-baseline gap-4">
          <div className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            {value}
          </div>

          {metrics && metrics.length > 0 && (
            <div className="flex items-center gap-3.5 pl-3.5 border-l border-zinc-800 text-xs text-zinc-400">
              {metrics.map((m, idx) => (
                <div key={idx}>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                    {m.label}
                  </span>
                  <span className="font-semibold text-zinc-200 text-sm">{m.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {growth && (
          <div className="flex items-center gap-2 mt-2.5 text-xs">
            {growth.positive ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                <TrendingUp className="w-3 h-3 text-orange-400" />
                <span className="text-orange-400">{growth.rate}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
                <TrendingDown className="w-3 h-3" />
                <span>{growth.rate}</span>
              </span>
            )}
            {growth.period && <span className="text-zinc-500 text-[11px]">{growth.period}</span>}
          </div>
        )}
      </div>

      {/* Optional Child Visuals */}
      {children && <div className="mt-auto relative z-10">{children}</div>}
    </motion.div>
  );
};
