import React from 'react';
import {
  CalendarDays,
  Calendar,
  History,
  CalendarRange,
  CalendarClock,
} from 'lucide-react';
import { DatePresetKey } from '../../types';

interface QuickDatePresetsProps {
  activePreset: DatePresetKey;
  onSelectPreset: (preset: DatePresetKey) => void;
  layout?: 'sidebar' | 'grid';
}

interface PresetOption {
  key: DatePresetKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRESET_OPTIONS: PresetOption[] = [
  { key: 'today', label: 'Today', icon: Calendar },
  { key: 'yesterday', label: 'Yesterday', icon: History },
  { key: 'last7days', label: 'Last 7 Days', icon: CalendarRange },
  { key: 'last28days', label: 'Last 28 Days', icon: CalendarRange },
  { key: 'last30days', label: 'Last 30 Days', icon: CalendarRange },
  { key: 'thisMonth', label: 'This Month', icon: CalendarDays },
  { key: 'lastMonth', label: 'Last Month', icon: CalendarClock },
  { key: 'custom', label: 'Custom', icon: CalendarDays },
];

export const QuickDatePresets: React.FC<QuickDatePresetsProps> = ({
  activePreset,
  onSelectPreset,
  layout = 'sidebar',
}) => {
  if (layout === 'grid') {
    return (
      <div className="w-full mb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2 px-0.5">
          Quick Select
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {PRESET_OPTIONS.map((item) => {
            const Icon = item.icon;
            const isActive = activePreset === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelectPreset(item.key)}
                className={`group min-h-[42px] px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200 flex items-center justify-start gap-2 text-left cursor-pointer select-none active:scale-[0.98] ${
                  isActive
                    ? 'bg-orange-500 text-white font-semibold shadow-[0_0_14px_rgba(249,115,22,0.4)] border border-orange-400/40'
                    : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Sidebar layout for Desktop and Tablet
  return (
    <div className="w-full sm:w-48 md:w-52 lg:w-56 shrink-0 flex flex-col p-3 sm:border-r border-zinc-800/80 bg-zinc-950/40 sm:bg-transparent">
      <div className="px-2 pb-2.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        Quick Select
      </div>

      <div className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible pb-1 sm:pb-0 scrollbar-none">
        {PRESET_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isActive = activePreset === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectPreset(item.key)}
              className={`group relative flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium rounded-xl transition-all duration-200 text-left whitespace-nowrap cursor-pointer select-none min-h-[40px] ${
                isActive
                  ? 'bg-orange-500/15 text-orange-300 border border-orange-500/40 shadow-[0_0_14px_rgba(249,115,22,0.12)] font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-orange-400' : 'text-zinc-500 group-hover:text-zinc-300'
                }`}
              />
              <span className="truncate">{item.label}</span>

              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(249,115,22,0.8)] hidden sm:block" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
