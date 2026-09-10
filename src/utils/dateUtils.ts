import { DatePresetKey, DateRangeState } from '../types';

/**
 * Strips time to start of day (00:00:00.000)
 */
export function startOfDay(d: Date): Date {
  const res = new Date(d);
  res.setHours(0, 0, 0, 0);
  return res;
}

/**
 * Sets time to end of day (23:59:59.999)
 */
export function endOfDay(d: Date): Date {
  const res = new Date(d);
  res.setHours(23, 59, 59, 999);
  return res;
}

/**
 * Returns Today range (00:00:00 to 23:59:59)
 */
export function getToday(): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: startOfDay(now),
    end: endOfDay(now),
  };
}

/**
 * Returns Yesterday range
 */
export function getYesterday(): { start: Date; end: Date } {
  const now = new Date();
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  return {
    start: startOfDay(y),
    end: endOfDay(y),
  };
}

/**
 * Returns Last 7 Days range (inclusive of today)
 */
export function getLast7Days(): { start: Date; end: Date } {
  const now = new Date();
  const s = new Date(now);
  s.setDate(s.getDate() - 6);
  return {
    start: startOfDay(s),
    end: endOfDay(now),
  };
}

/**
 * Returns Last 28 Days range (inclusive of today)
 */
export function getLast28Days(): { start: Date; end: Date } {
  const now = new Date();
  const s = new Date(now);
  s.setDate(s.getDate() - 27);
  return {
    start: startOfDay(s),
    end: endOfDay(now),
  };
}

/**
 * Returns Last 30 Days range (inclusive of today)
 */
export function getLast30Days(): { start: Date; end: Date } {
  const now = new Date();
  const s = new Date(now);
  s.setDate(s.getDate() - 29);
  return {
    start: startOfDay(s),
    end: endOfDay(now),
  };
}

/**
 * Returns This Month range (1st day of current month to last day of current month)
 */
export function getThisMonth(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

/**
 * Returns Last Month range (1st day of previous month to last day of previous month)
 */
export function getLastMonth(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  return { start, end };
}

/**
 * Calculates date range by preset key
 */
export function getPresetRange(preset: DatePresetKey): { start: Date; end: Date; label: string } {
  switch (preset) {
    case 'today':
      return { ...getToday(), label: 'Today' };
    case 'yesterday':
      return { ...getYesterday(), label: 'Yesterday' };
    case 'last7days':
      return { ...getLast7Days(), label: 'Last 7 Days' };
    case 'last28days':
      return { ...getLast28Days(), label: 'Last 28 Days' };
    case 'last30days':
      return { ...getLast30Days(), label: 'Last 30 Days' };
    case 'thisMonth':
      return { ...getThisMonth(), label: 'This Month' };
    case 'lastMonth':
      return { ...getLastMonth(), label: 'Last Month' };
    case 'custom':
    default:
      return { ...getThisMonth(), label: 'Custom' };
  }
}

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTH_NAMES_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Formats a single date, e.g. "01 Sep 2026"
 */
export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date.getTime())) return '—';

  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTH_NAMES_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Formats Month & Year, e.g. "September 2026"
 */
export function formatMonthYear(year: number, month: number): string {
  return `${MONTH_NAMES_FULL[month]} ${year}`;
}

/**
 * Formats a date range into a concise string, e.g.:
 * "This Month" or "01 Sep – 30 Sep 2026"
 */
export function formatDateRange(start: Date, end: Date, preset?: DatePresetKey): string {
  if (preset && preset !== 'custom') {
    const presetLabels: Record<DatePresetKey, string> = {
      today: 'Today',
      yesterday: 'Yesterday',
      last7days: 'Last 7 Days',
      last28days: 'Last 28 Days',
      last30days: 'Last 30 Days',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      custom: 'Custom',
    };
    return presetLabels[preset];
  }

  const sDay = String(start.getDate()).padStart(2, '0');
  const sMonth = MONTH_NAMES_SHORT[start.getMonth()];
  const sYear = start.getFullYear();

  const eDay = String(end.getDate()).padStart(2, '0');
  const eMonth = MONTH_NAMES_SHORT[end.getMonth()];
  const eYear = end.getFullYear();

  if (sYear === eYear) {
    if (sMonth === eMonth && sDay === eDay) {
      return `${sDay} ${sMonth} ${sYear}`;
    }
    if (sMonth === eMonth) {
      return `${sDay} – ${eDay} ${sMonth} ${sYear}`;
    }
    return `${sDay} ${sMonth} – ${eDay} ${eMonth} ${sYear}`;
  }

  return `${sDay} ${sMonth} ${sYear} – ${eDay} ${eMonth} ${eYear}`;
}

/**
 * Checks if two dates fall on the same day
 */
export function isSameDay(d1: Date | null | undefined, d2: Date | null | undefined): boolean {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Checks if a date is today
 */
export function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

/**
 * Checks if a date is between start and end (inclusive)
 */
export function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const t = startOfDay(date).getTime();
  const s = startOfDay(start).getTime();
  const e = startOfDay(end).getTime();
  return t >= s && t <= e;
}

export function isStartDate(date: Date, start: Date | null): boolean {
  if (!start) return false;
  return isSameDay(date, start);
}

export function isEndDate(date: Date, end: Date | null): boolean {
  if (!end) return false;
  return isSameDay(date, end);
}

/**
 * Returns difference in days between two dates inclusive
 */
export function diffInDays(start: Date, end: Date): number {
  const s = startOfDay(start).getTime();
  const e = startOfDay(end).getTime();
  const diffTime = Math.abs(e - s);
  return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export interface CalendarDayItem {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayNumber: number;
}

/**
 * Generates array of calendar day items for a 7-column grid
 * Always returns complete weeks (35 or 42 cells)
 */
export function getCalendarGridDays(year: number, month: number): CalendarDayItem[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const totalDaysInMonth = lastDayOfMonth.getDate();

  const days: CalendarDayItem[] = [];

  // Previous month trailing days
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDate - i);
    days.push({
      date: d,
      isCurrentMonth: false,
      isToday: isToday(d),
      dayNumber: d.getDate(),
    });
  }

  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const date = new Date(year, month, d);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      dayNumber: d,
    });
  }

  // Next month leading days to complete grid (multiples of 7)
  const remaining = (7 - (days.length % 7)) % 7;
  // If total is 28 or 35 and we want a balanced 35 or 42 grid:
  const targetTotal = days.length + remaining < 35 ? 35 : days.length + remaining;
  const nextMonthCount = targetTotal - days.length;

  for (let d = 1; d <= nextMonthCount; d++) {
    const date = new Date(year, month + 1, d);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      dayNumber: d,
    });
  }

  return days;
}
