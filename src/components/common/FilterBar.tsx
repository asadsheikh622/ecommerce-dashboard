import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  children: React.ReactNode;
  onFilter?: () => void;
  onReset?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ children, onFilter, onReset }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-5 mb-6 shadow-xl">
      <div className="flex flex-wrap items-end gap-3.5">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {children}
        </div>

        <div className="flex items-center gap-2 self-end">
          {onFilter && (
            <button
              type="button"
              onClick={onFilter}
              className="px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl border border-zinc-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
