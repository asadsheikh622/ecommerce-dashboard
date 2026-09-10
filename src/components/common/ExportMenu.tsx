import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileSpreadsheet, FileText, Table, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCurrency } from '../../context/CurrencyContext';
import {
  buildExportReportData,
  exportToCSV,
  exportToExcel,
  exportToPDF,
} from '../../utils/exportUtils';

interface ExportMenuProps {
  id?: string;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ id = 'header-export-button' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const { dateRange, dateRangeStats, storefrontConfig, addToast } = useStore();
  const { currency, exchangeRate } = useCurrency();

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
  }, [isOpen]);

  const handleExportCSV = () => {
    try {
      setIsExporting('csv');
      const data = buildExportReportData(dateRange, dateRangeStats, currency, exchangeRate, storefrontConfig);
      exportToCSV(data);
      addToast('success', 'CSV Exported', `Generated CSV for ${dateRange.label} in ${currency}`);
    } catch (err) {
      console.error('Failed to export CSV:', err);
      addToast('error', 'Export Failed', 'Unable to generate CSV file');
    } finally {
      setIsExporting(null);
      setIsOpen(false);
    }
  };

  const handleExportExcel = () => {
    try {
      setIsExporting('excel');
      const data = buildExportReportData(dateRange, dateRangeStats, currency, exchangeRate, storefrontConfig);
      exportToExcel(data);
      addToast('success', 'Excel Workbook Exported', `Generated .xlsx for ${dateRange.label} in ${currency}`);
    } catch (err) {
      console.error('Failed to export Excel:', err);
      addToast('error', 'Export Failed', 'Unable to generate Excel file');
    } finally {
      setIsExporting(null);
      setIsOpen(false);
    }
  };

  const handleExportPDF = () => {
    try {
      setIsExporting('pdf');
      const data = buildExportReportData(dateRange, dateRangeStats, currency, exchangeRate, storefrontConfig);
      exportToPDF(data);
      addToast('success', 'PDF Report Exported', `Generated PDF summary for ${dateRange.label} in ${currency}`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      addToast('error', 'Export Failed', 'Unable to generate PDF file');
    } finally {
      setIsExporting(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button - Matches exact original styling and ID */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Export dashboard data"
        className={`flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium border rounded-xl transition-all shadow-sm cursor-pointer select-none ${
          isOpen
            ? 'text-white bg-zinc-800 border-zinc-700 ring-1 ring-orange-500/40'
            : 'text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-white border-zinc-800 hover:border-zinc-700'
        }`}
      >
        <Download className="w-3.5 h-3.5 text-zinc-400" />
        <span>Export</span>
      </button>

      {/* Popover Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -5 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute right-0 top-[calc(100%+6px)] z-50 w-60 rounded-2xl bg-zinc-900/98 backdrop-blur-xl border border-zinc-800/90 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.85),0_0_20px_rgba(249,115,22,0.06)] overflow-hidden"
          >
            {/* Top orange gradient hairline */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

            {/* Header with Title & Active Scope */}
            <div className="px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                  Export Data
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {currency}
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate mt-1">
                Period: <span className="text-zinc-200 font-medium">{dateRange.label}</span>
              </p>
            </div>

            {/* Menu Options */}
            <div className="p-1.5 space-y-1">
              {/* Export CSV */}
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={isExporting !== null}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold block">Export CSV</span>
                    <span className="text-[10px] text-zinc-400">Raw data for spreadsheets</span>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              {/* Export Excel */}
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={isExporting !== null}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <Table className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold block">Export Excel</span>
                    <span className="text-[10px] text-zinc-400">Formatted .xlsx workbook</span>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
              </button>

              {/* Export PDF */}
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={isExporting !== null}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold block">Export PDF</span>
                    <span className="text-[10px] text-zinc-400">Executive report document</span>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:text-rose-400 transition-colors" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
