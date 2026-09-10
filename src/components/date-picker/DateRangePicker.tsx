import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { DateRangeState, DatePresetKey } from '../../types';
import { DateRangeTrigger } from './DateRangeTrigger';
import { QuickDatePresets } from './QuickDatePresets';
import { DateInput } from './DateInput';
import { CalendarGrid } from './CalendarGrid';
import { DateRangeFooter } from './DateRangeFooter';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import {
  diffInDays,
  formatDateRange,
  getPresetRange,
  startOfDay,
  endOfDay,
} from '../../utils/dateUtils';

interface DateRangePickerProps {
  value: DateRangeState;
  onChange: (value: DateRangeState) => void;
  id?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  id = 'header-date-filter-button',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isBelow768, isNarrowMobile, isSmallTablet, isLargeDesktop, width } = useBreakpoint();

  // Temporary selection states while the picker is open
  const [tempPreset, setTempPreset] = useState<DatePresetKey>(value.preset);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(new Date(value.startDate));
  const [tempEndDate, setTempEndDate] = useState<Date | null>(new Date(value.endDate));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Synchronized calendar navigation state (points to the left calendar's month)
  const [viewYear, setViewYear] = useState<number>(() => new Date(value.startDate).getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => new Date(value.startDate).getMonth());

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Viewport boundary positioning state for Desktop / Tablet
  const [dropdownPlacement, setDropdownPlacement] = useState<{
    openUpward: boolean;
    alignRight: boolean;
  }>({
    openUpward: false,
    alignRight: true,
  });

  // Calculate positioning relative to viewport when opened
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || isBelow768) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const approximatePickerHeight = 540;

    // Open upward if cramped below and more room above
    const openUpward = spaceBelow < approximatePickerHeight && spaceAbove > spaceBelow;

    // Align right by default in header, but shift if overflowing left
    setDropdownPlacement({
      openUpward,
      alignRight: true,
    });
  }, [isBelow768]);

  useLayoutEffect(() => {
    if (isOpen && !isBelow768) {
      updatePosition();
    }
  }, [isOpen, isBelow768, updatePosition]);

  // Sync state whenever picker is opened or external value changes
  const resetToCurrentValue = useCallback(() => {
    const s = new Date(value.startDate);
    const e = new Date(value.endDate);
    setTempPreset(value.preset);
    setTempStartDate(s);
    setTempEndDate(e);
    setViewYear(s.getFullYear());
    setViewMonth(s.getMonth());
    setHoverDate(null);
  }, [value]);

  useEffect(() => {
    if (isOpen) {
      resetToCurrentValue();
    }
  }, [isOpen, resetToCurrentValue]);

  // Lock body scroll on mobile when modal is open
  useEffect(() => {
    if (isOpen && isBelow768) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, isBelow768]);

  // Handle click outside & keyboard escape to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // For desktop dropdown
      if (!isBelow768 && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isBelow768]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setViewMonth((prev) => {
      if (prev === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setViewMonth((prev) => {
      if (prev === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // Quick preset selection
  const handleSelectPreset = (preset: DatePresetKey) => {
    setTempPreset(preset);
    if (preset === 'custom') {
      return;
    }

    const range = getPresetRange(preset);
    setTempStartDate(range.start);
    setTempEndDate(range.end);
    setViewYear(range.start.getFullYear());
    setViewMonth(range.start.getMonth());
  };

  // Date click logic
  const handleDateClick = (clickedDate: Date) => {
    const day = startOfDay(clickedDate);

    // If no start date or both start and end dates are already selected, start a fresh range
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(day);
      setTempEndDate(null);
      setTempPreset('custom');
    } else {
      // Setting the end date
      if (day.getTime() < tempStartDate.getTime()) {
        setTempEndDate(tempStartDate);
        setTempStartDate(day);
      } else {
        setTempEndDate(endOfDay(day));
      }
      setTempPreset('custom');
    }
  };

  // Calculate selected days count
  const selectedDaysCount =
    tempStartDate && tempEndDate
      ? diffInDays(tempStartDate, tempEndDate)
      : tempStartDate
      ? 1
      : 0;

  // Apply changes
  const handleApply = () => {
    if (!tempStartDate) return;

    const finalStart = tempStartDate;
    const finalEnd = tempEndDate || tempStartDate;
    const label = formatDateRange(finalStart, finalEnd, tempPreset);

    onChange({
      preset: tempPreset,
      startDate: finalStart.toISOString(),
      endDate: finalEnd.toISOString(),
      label,
    });

    setIsOpen(false);
  };

  const handleCancel = () => {
    resetToCurrentValue();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Header Trigger Button */}
      <div ref={triggerRef}>
        <DateRangeTrigger
          id={id}
          label={value.label}
          isOpen={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </div>

      {/* ============================================================ */}
      {/* DESKTOP & TABLET VIEW (>= 768px): Anchored Floating Dropdown */}
      {/* ============================================================ */}
      {!isBelow768 && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: dropdownPlacement.openUpward ? 8 : -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: dropdownPlacement.openUpward ? 8 : -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`absolute z-50 rounded-2xl md:rounded-3xl bg-zinc-900/98 backdrop-blur-2xl border border-zinc-800/90 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85),0_0_25px_rgba(249,115,22,0.06)] overflow-hidden ${
                dropdownPlacement.openUpward ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'
              } ${
                dropdownPlacement.alignRight ? 'right-0' : 'left-0'
              } ${
                isLargeDesktop
                  ? 'w-[880px] max-w-[calc(100vw-40px)]'
                  : 'w-[780px] max-w-[calc(100vw-32px)]'
              }`}
            >
              {/* Subtle top warm orange gradient line */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

              {/* Main Panel Content: Left (Quick Select) + Right (Inputs, Calendars, Footer) */}
              <div className="flex flex-row">
                {/* LEFT SIDE: Quick Presets Sidebar */}
                <QuickDatePresets
                  activePreset={tempPreset}
                  onSelectPreset={handleSelectPreset}
                  layout="sidebar"
                />

                {/* RIGHT SIDE: Header, Dual Calendar & Footer */}
                <div className="flex-1 p-4 md:p-5 flex flex-col justify-between overflow-x-hidden">
                  {/* Date Inputs (FROM -> TO) */}
                  <DateInput
                    startDate={tempStartDate}
                    endDate={tempEndDate || (tempStartDate && hoverDate ? hoverDate : tempStartDate)}
                    stacked={false}
                  />

                  {/* Dual Calendars */}
                  <div className="my-1 overflow-x-hidden">
                    <CalendarGrid
                      viewYear={viewYear}
                      viewMonth={viewMonth}
                      startDate={tempStartDate}
                      endDate={tempEndDate}
                      hoverDate={hoverDate}
                      onDateClick={handleDateClick}
                      onDateHover={setHoverDate}
                      onPrevMonth={handlePrevMonth}
                      onNextMonth={handleNextMonth}
                      stacked={false}
                    />
                  </div>

                  {/* Bottom Bar: Days count & Action buttons */}
                  <DateRangeFooter
                    selectedDaysCount={selectedDaysCount}
                    onCancel={handleCancel}
                    onApply={handleApply}
                    isApplyDisabled={!tempStartDate}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ============================================================ */}
      {/* MOBILE & SMALL TABLET VIEW (< 768px): Responsive Bottom Sheet Modal */}
      {/* ============================================================ */}
      {isBelow768 && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
              {/* Dark backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={handleCancel}
                className="fixed inset-0 bg-black/65 backdrop-blur-sm cursor-pointer"
                aria-hidden="true"
              />

              {/* Bottom sheet modal container */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-h-[90vh] flex flex-col bg-zinc-900 border-t border-zinc-800/90 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.85)] overflow-hidden"
              >
                {/* Drag handle pill / Accent indicator */}
                <div className="flex justify-center pt-2.5 pb-1">
                  <div className="w-12 h-1 rounded-full bg-zinc-700/80" />
                </div>

                {/* Sticky Mobile Modal Header */}
                <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-md">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 block">
                      Select Date Range
                    </span>
                    <h2 className="text-sm font-bold text-white tracking-tight">
                      Filter Store Analytics
                    </h2>
                  </div>

                  {/* Touch friendly close button (min 40x40px) */}
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="min-w-[40px] min-h-[40px] w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 active:scale-95 transition-all cursor-pointer"
                    aria-label="Close date range picker"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 scrollbar-thin">
                  {/* Quick Select Grid */}
                  <QuickDatePresets
                    activePreset={tempPreset}
                    onSelectPreset={handleSelectPreset}
                    layout="grid"
                  />

                  {/* Vertically Stacked Date Inputs */}
                  <DateInput
                    startDate={tempStartDate}
                    endDate={tempEndDate || (tempStartDate && hoverDate ? hoverDate : tempStartDate)}
                    stacked={true}
                  />

                  {/* Dual or Single Calendar Stacked Vertically */}
                  <div className="my-2">
                    <CalendarGrid
                      viewYear={viewYear}
                      viewMonth={viewMonth}
                      startDate={tempStartDate}
                      endDate={tempEndDate}
                      hoverDate={hoverDate}
                      onDateClick={handleDateClick}
                      onDateHover={setHoverDate}
                      onPrevMonth={handlePrevMonth}
                      onNextMonth={handleNextMonth}
                      stacked={true}
                      singleMonth={isNarrowMobile}
                    />
                  </div>
                </div>

                {/* Sticky Mobile Footer */}
                <div className="px-4 sm:px-6 pb-4">
                  <DateRangeFooter
                    selectedDaysCount={selectedDaysCount}
                    onCancel={handleCancel}
                    onApply={handleApply}
                    isApplyDisabled={!tempStartDate}
                    isMobileModal={true}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
