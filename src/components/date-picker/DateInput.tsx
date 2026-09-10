import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface DateInputProps {
  startDate: Date | null;
  endDate: Date | null;
  stacked?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  startDate,
  endDate,
  stacked = false,
}) => {
  return (
    <div
      className={`flex items-stretch gap-2.5 pb-3.5 mb-3 border-b border-zinc-800/80 ${
        stacked ? 'flex-col' : 'flex-col sm:flex-row sm:items-center'
      }`}
    >
      {/* FROM Date Block */}
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          From
        </span>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl hover:border-zinc-700/80 transition-colors shadow-inner min-h-[42px]">
          <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="text-xs md:text-sm font-semibold text-white tracking-wide truncate">
            {startDate ? formatDate(startDate) : 'Select Start Date'}
          </span>
        </div>
      </div>

      {/* Arrow Indicator (hidden on stacked or mobile) */}
      {!stacked && (
        <div className="hidden sm:flex items-center justify-center pt-4 text-zinc-600">
          <ArrowRight className="w-4 h-4 text-zinc-500" />
        </div>
      )}

      {/* TO Date Block */}
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          To
        </span>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl hover:border-zinc-700/80 transition-colors shadow-inner min-h-[42px]">
          <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="text-xs md:text-sm font-semibold text-white tracking-wide truncate">
            {endDate ? formatDate(endDate) : 'Select End Date'}
          </span>
        </div>
      </div>
    </div>
  );
};
