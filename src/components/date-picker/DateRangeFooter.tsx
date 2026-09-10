import React from 'react';
import { CalendarCheck, Check } from 'lucide-react';

interface DateRangeFooterProps {
  selectedDaysCount: number;
  onCancel: () => void;
  onApply: () => void;
  isApplyDisabled?: boolean;
  isMobileModal?: boolean;
}

export const DateRangeFooter: React.FC<DateRangeFooterProps> = ({
  selectedDaysCount,
  onCancel,
  onApply,
  isApplyDisabled = false,
  isMobileModal = false,
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 mt-4 border-t border-zinc-800/80 ${
        isMobileModal
          ? 'sticky bottom-0 bg-zinc-900/95 backdrop-blur-md pb-safe pb-4 pt-3.5 -mx-4 px-4 sm:-mx-6 sm:px-6 shadow-[0_-8px_20px_rgba(0,0,0,0.5)] z-30'
          : ''
      }`}
    >
      {/* Left: Days Selected Summary */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 w-full sm:w-auto justify-center sm:justify-start">
        <CalendarCheck className="w-4 h-4 text-orange-400 shrink-0" />
        <span className="font-medium text-zinc-300">
          {selectedDaysCount > 0
            ? `${selectedDaysCount} ${selectedDaysCount === 1 ? 'day' : 'days'} selected`
            : 'Select date range'}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        {/* Cancel Button */}
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 sm:flex-none min-h-[42px] px-4 py-2 text-xs md:text-sm font-medium rounded-xl text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/90 active:scale-95 border border-zinc-700/60 transition-all cursor-pointer text-center select-none"
        >
          Cancel
        </button>

        {/* Apply Button */}
        <button
          type="button"
          onClick={onApply}
          disabled={isApplyDisabled}
          className={`flex-1 sm:flex-none min-h-[42px] flex items-center justify-center gap-1.5 px-6 py-2 text-xs md:text-sm font-semibold rounded-xl text-white transition-all cursor-pointer select-none ${
            isApplyDisabled
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
              : 'bg-orange-500 hover:bg-orange-400 active:scale-95 border border-orange-400/30 shadow-[0_0_18px_rgba(249,115,22,0.35)]'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>Apply</span>
        </button>
      </div>
    </div>
  );
};
