import React from 'react';
import { CalendarMonth } from './CalendarMonth';

interface CalendarGridProps {
  viewYear: number;
  viewMonth: number; // 0 to 11
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  stacked?: boolean;
  singleMonth?: boolean;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  viewYear,
  viewMonth,
  startDate,
  endDate,
  hoverDate,
  onDateClick,
  onDateHover,
  onPrevMonth,
  onNextMonth,
  stacked = false,
  singleMonth = false,
}) => {
  // Left / First calendar is viewMonth
  const leftYear = viewYear;
  const leftMonth = viewMonth;

  // Right / Second calendar is next month
  let rightYear = viewYear;
  let rightMonth = viewMonth + 1;
  if (rightMonth > 11) {
    rightMonth = 0;
    rightYear += 1;
  }

  if (singleMonth) {
    return (
      <div className="w-full flex justify-center py-1">
        <CalendarMonth
          year={leftYear}
          month={leftMonth}
          startDate={startDate}
          endDate={endDate}
          hoverDate={hoverDate}
          onDateClick={onDateClick}
          onDateHover={onDateHover}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
          showPrevArrow={true}
          showNextArrow={true}
          compact={true}
        />
      </div>
    );
  }

  if (stacked) {
    return (
      <div className="w-full flex flex-col gap-6 py-2">
        {/* Month 1 */}
        <div className="w-full bg-zinc-950/30 rounded-2xl p-2 border border-zinc-800/40">
          <CalendarMonth
            year={leftYear}
            month={leftMonth}
            startDate={startDate}
            endDate={endDate}
            hoverDate={hoverDate}
            onDateClick={onDateClick}
            onDateHover={onDateHover}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            showPrevArrow={true}
            showNextArrow={true}
            compact={true}
          />
        </div>

        {/* Month 2 */}
        <div className="w-full bg-zinc-950/30 rounded-2xl p-2 border border-zinc-800/40">
          <CalendarMonth
            year={rightYear}
            month={rightMonth}
            startDate={startDate}
            endDate={endDate}
            hoverDate={hoverDate}
            onDateClick={onDateClick}
            onDateHover={onDateHover}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            showPrevArrow={true}
            showNextArrow={true}
            compact={true}
          />
        </div>
      </div>
    );
  }

  // Default Desktop / Tablet side-by-side layout
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-5 lg:gap-6 py-1">
      {/* Left Calendar */}
      <CalendarMonth
        year={leftYear}
        month={leftMonth}
        startDate={startDate}
        endDate={endDate}
        hoverDate={hoverDate}
        onDateClick={onDateClick}
        onDateHover={onDateHover}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        showPrevArrow={true}
        showNextArrow={false}
      />

      {/* Subtle vertical divider between dual calendars on desktop */}
      <div className="hidden lg:block w-px self-stretch bg-zinc-800/80 my-1" />

      {/* Right Calendar */}
      <CalendarMonth
        year={rightYear}
        month={rightMonth}
        startDate={startDate}
        endDate={endDate}
        hoverDate={hoverDate}
        onDateClick={onDateClick}
        onDateHover={onDateHover}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        showPrevArrow={false}
        showNextArrow={true}
      />
    </div>
  );
};
