
import React, { createContext, useContext, useState } from 'react';
import { Currency } from '../types';
import {
  DEFAULT_USD_TO_PKR_RATE,
  formatCurrency,
  getCurrencySymbol,
  convertToBase as convertToBaseUtil,
  convertFromBase as convertFromBaseUtil,
} from '../utils/currency';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  format: (amountPKR: number, options?: {
    compact?: boolean;
    decimals?: number;
    showSymbol?: boolean;
  }) => string;
  symbol: string;
  convertToBase: (amount: number) => number;
  convertFromBase: (amountPKR: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('selectedCurrency');
    return saved === 'USD' || saved === 'PKR' ? saved : 'PKR';
  });

  const [exchangeRate, setExchangeRateState] = useState<number>(() => {
    const savedRate = localStorage.getItem('exchangeRate');
    return savedRate ? parseFloat(savedRate) : DEFAULT_USD_TO_PKR_RATE;
  });

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('selectedCurrency', newCurrency);
  };

  const setExchangeRate = (newRate: number) => {
    if (newRate > 0) {
      setExchangeRateState(newRate);
      localStorage.setItem('exchangeRate', newRate.toString());
    }
  };

  const format = (
    amountPKR: number,
    options?: { compact?: boolean; decimals?: number; showSymbol?: boolean }
  ) => {
    return formatCurrency(amountPKR, currency, exchangeRate, options);
  };

  const symbol = getCurrencySymbol(currency);

  const convertToBase = (amountInCurrent: number) => {
    return convertToBaseUtil(amountInCurrent, currency, exchangeRate);
  };

  const convertFromBase = (amountPKR: number) => {
    return convertFromBaseUtil(amountPKR, currency, exchangeRate);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRate,
        setExchangeRate,
        format,
        symbol,
        convertToBase,
        convertFromBase,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }

  return context;
};
