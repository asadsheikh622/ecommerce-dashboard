import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { Currency } from '../../types';
import { getCurrencyDisplay } from '../../utils/currency';
import { useStore } from '../../context/StoreContext';

interface CurrencySelectorProps {
  compact?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ compact = false }) => {
  const { currency, setCurrency } = useCurrency();
  const { addToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentInfo = getCurrencyDisplay(currency);

  const currencies: Currency[] = ['PKR', 'USD'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newCurrency: Currency) => {
    if (newCurrency !== currency) {
      setCurrency(newCurrency);
      addToast('info', `Currency changed to ${newCurrency}`, `All monetary figures converted to ${newCurrency}.`);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        id="currency-selector-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-medium text-zinc-200 bg-[#151515] hover:bg-[#1f1f1f] border border-white/[0.08] hover:border-white/[0.16] rounded-xl transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500/50 cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{currentInfo.flag}</span>
        <span className="font-semibold text-white">{currentInfo.code}</span>
        <span className="text-zinc-400 text-xs">({currentInfo.symbol})</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-orange-400' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-56 rounded-xl bg-[#141414] border border-white/[0.1] shadow-2xl shadow-black/80 py-1.5 z-50 backdrop-blur-md"
          >
            <div className="px-3 py-1.5 border-b border-white/[0.06] mb-1">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Select Store Currency
              </p>
            </div>

            {currencies.map((curr) => {
              const info = getCurrencyDisplay(curr);
              const isSelected = curr === currency;
              return (
                <button
                  key={curr}
                  id={`currency-option-${curr}`}
                  onClick={() => handleSelect(curr)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs md:text-sm text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500/10 text-orange-400 font-medium'
                      : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{info.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <span>{info.code}</span>
                        <span className="text-zinc-400 text-xs font-normal">({info.symbol})</span>
                      </div>
                      <span className="text-[11px] text-zinc-500 block leading-tight">{info.label}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-orange-500" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
