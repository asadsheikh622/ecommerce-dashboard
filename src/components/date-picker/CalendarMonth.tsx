import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  formatMonthYear,
  getCalendarGridDays,
  isDateInRange,
  isSameDay,
  isStartDate,
  isEndDate,
  startOfDay,
} from '../../utils/dateUtils';

interface CalendarMonthProps {
  year: number;
  month: number;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  showPrevArrow?: boolean;
  showNextArrow?: boolean;
  compact?: boolean;
}

const WEEKDAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const CalendarMonth: React.FC<CalendarMonthProps> = ({
  year,
  month,
  startDate,
  endDate,
  hoverDate,
  onDateClick,
  onDateHover,
  onPrevMonth,
  onNextMonth,
  showPrevArrow = true,
  showNextArrow = true,
  compact = false,
}) => {
  const days = getCalendarGridDays(year, month);

  // Determine effective range for preview highlighting
  let effectiveStart = startDate;
  let effectiveEnd = endDate;

  if (startDate && !endDate && hoverDate) {
    if (hoverDate.getTime() < startDate.getTime()) {
      effectiveStart = hoverDate;
      effectiveEnd = startDate;
    } else {
      effectiveStart = startDate;
      effectiveEnd = hoverDate;
    }
  }

  return (
    <div className={`flex-1 select-none ${compact ? 'w-full' : 'min-w-[280px] max-w-[340px]'}`}>
      {/* Month & Navigation Header with touch-friendly 40px x 40px buttons */}
      <div className="flex items-center justify-between px-1 pb-3 pt-0.5">
        <button
          type="button"
          onClick={onPrevMonth}
          className={`min-w-[40px] min-h-[40px] w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/90 active:scale-95 transition-all cursor-pointer ${
            showPrevArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-sm font-bold text-white tracking-tight">
          {formatMonthYear(year, month)}
        </span>

        <button
          type="button"
          onClick={onNextMonth}
          className={`min-w-[40px] min-h-[40px] w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/90 active:scale-95 transition-all cursor-pointer ${
            showNextArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 gap-0 text-center mb-1">
        {WEEKDAY_NAMES.map((name) => (
          <div
            key={name}
            className="text-[10px] sm:text-[11px] font-bold tracking-wider text-zinc-500 py-1"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar Grid Days */}
      <div className="grid grid-cols-7 gap-y-1 gap-x-0 text-center">
        {days.map((item, index) => {
          const itemDay = startOfDay(item.date);
          const isSelectedStart = isStartDate(itemDay, effectiveStart);
          const isSelectedEnd = isEndDate(itemDay, effectiveEnd);
          const inRange = isDateInRange(itemDay, effectiveStart, effectiveEnd);
          const isSingleSelected =
            isSelectedStart && isSelectedEnd && isSameDay(effectiveStart, effectiveEnd);

          const isMiddleRange = inRange && !isSelectedStart && !isSelectedEnd;

          // Day of week in grid (0 = SUN, 6 = SAT)
          const dayOfWeek = index % 7;
          const isWeekStart = dayOfWeek === 0;
          const isWeekEnd = dayOfWeek === 6;

          return (
            <div
              key={index}
              className={`relative min-h-[40px] h-10 flex items-center justify-center transition-colors ${
                inRange && !isSingleSelected ? 'bg-orange-500/15' : ''
              } ${
                isSelectedStart && !isSingleSelected
                  ? 'rounded-l-xl'
                  : ''
              } ${
                isSelectedEnd && !isSingleSelected
                  ? 'rounded-r-xl'
                  : ''
              } ${
                isWeekStart && inRange ? 'rounded-l-lg' : ''
              } ${
                isWeekEnd && inRange ? 'rounded-r-lg' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => onDateClick(item.date)}
                onMouseEnter={() => onDateHover(item.date)}
                onMouseLeave={() => onDateHover(null)}
                aria-label={item.date.toDateString()}
                className={`relative min-w-[38px] min-h-[38px] w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-medium rounded-xl transition-all duration-150 cursor-pointer select-none active:scale-95 ${
                  isSelectedStart || isSelectedEnd
                    ? 'bg-orange-500 text-white font-bold shadow-[0_0_14px_rgba(249,115,22,0.5)] z-10 scale-105'
                    : isMiddleRange
                    ? 'text-orange-200 font-semibold'
                    : item.isCurrentMonth
                    ? 'text-zinc-200 hover:bg-zinc-800/80 hover:text-white'
                    : 'text-zinc-600/70 hover:text-zinc-400'
                }`}
              >
                <span>{item.dayNumber}</span>

                {/* Today's subtle indicator dot if not selected */}
                {item.isToday && !isSelectedStart && !isSelectedEnd && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-400" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
