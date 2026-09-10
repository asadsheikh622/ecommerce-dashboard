import React from 'react';
import { ChevronRight, Menu, Home } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';
import { DateRangePicker } from '../date-picker';
import { ExportMenu } from './ExportMenu';
import { NotificationBell } from './NotificationBell';
import { useStore } from '../../context/StoreContext';
import { useCurrency } from '../../context/CurrencyContext';

interface HeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
  onMobileMenuToggle?: () => void;
  onExport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  breadcrumbs,
  title,
  subtitle,
  actionButton,
  onMobileMenuToggle,
}) => {
  const { dateRange, setDateRange } = useStore();
  const { currency } = useCurrency();

  return (
    <header className="w-full pb-6 pt-2">
      {/* Top row: Breadcrumbs, Status Badge and Mobile menu */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          {onMobileMenuToggle && (
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={onMobileMenuToggle}
              className="lg:hidden p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white mr-2"
              aria-label="Toggle navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors">
            <Home className="w-3.5 h-3.5" />
          </div>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-zinc-700" />
              <span
                className={
                  idx === breadcrumbs.length - 1
                    ? 'text-zinc-200 font-medium'
                    : 'text-zinc-500 hover:text-zinc-300 transition-colors'
                }
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Bento Network/Store Status Pill matching design */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-zinc-400">Store Active • {currency}</span>
          </div>

          {/* Action Controls for Mobile in top-right */}
          <div className="flex items-center gap-2 md:hidden">
            <CurrencySelector compact />
            <NotificationBell compact id="header-notification-bell-mobile" />
          </div>
        </div>
      </div>

      {/* Main Row: Title & Subtitle + Action controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="text-xs md:text-sm text-zinc-400 mt-1">{subtitle}</p>}
        </div>

        {/* Right side controls: Date filter, Currency, Export, Notification Bell, Primary Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Selector */}
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            id="header-date-filter-button"
          />

          {/* Currency Selector (Desktop) */}
          <div className="hidden md:block">
            <CurrencySelector />
          </div>

          {/* Export button with Dropdown Menu (CSV, Excel, PDF) */}
          <ExportMenu id="header-export-button" />

          {/* Main Notification Bell (Desktop) */}
          <div className="hidden md:block">
            <NotificationBell id="header-notification-bell" />
          </div>

          {/* Optional Primary Action (e.g. + Add Product) */}
          {actionButton}
        </div>
      </div>
    </header>
  );
};
