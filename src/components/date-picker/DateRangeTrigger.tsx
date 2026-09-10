import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateRangeTriggerProps {
  label: string;
  isOpen: boolean;
  onClick: () => void;
  id?: string;
}

export const DateRangeTrigger: React.FC<DateRangeTriggerProps> = ({
  label,
  isOpen,
  onClick,
  id = 'header-date-filter-button',
}) => {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      aria-label={`Selected date range: ${label}. Click to change date filter.`}
      className={`group relative flex items-center gap-2 px-3 sm:px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer select-none border shadow-sm active:scale-95 ${
        isOpen
          ? 'bg-zinc-900 border-orange-500/50 text-white ring-2 ring-orange-500/20 shadow-[0_0_18px_rgba(249,115,22,0.18)]'
          : 'bg-zinc-900 hover:bg-zinc-800/90 text-zinc-300 hover:text-white border-zinc-800 hover:border-zinc-700/80'
      }`}
    >
      {/* Calendar Icon with orange accent when active */}
      <Calendar
        className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
          isOpen ? 'text-orange-400' : 'text-zinc-400 group-hover:text-zinc-300'
        }`}
      />

      {/* Label - responsive max width */}
      <span className="font-medium tracking-tight truncate max-w-[95px] xs:max-w-[130px] sm:max-w-[180px]">
        {label}
      </span>

      {/* Chevron down with smooth 180 flip */}
      <ChevronDown
        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
          isOpen ? 'rotate-180 text-orange-400' : 'text-zinc-400 group-hover:text-zinc-300'
        }`}
      />
    </button>
  );
};
