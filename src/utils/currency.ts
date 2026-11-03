
import { Currency, Order, Product } from '../types';

export const DEFAULT_USD_TO_PKR_RATE = 280;

/**
 * Converts an amount between PKR and USD.
 * Database base currency is PKR.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate: number = DEFAULT_USD_TO_PKR_RATE
): number {
  if (fromCurrency === toCurrency) return amount;

  if (fromCurrency === 'PKR' && toCurrency === 'USD') {
    return amount / exchangeRate;
  }

  if (fromCurrency === 'USD' && toCurrency === 'PKR') {
    return amount * exchangeRate;
  }

  return amount;
}

/**
 * Converts entered amount into base currency (PKR).
 */
export function convertToBase(
  amount: number,
  currentCurrency: Currency,
  exchangeRate: number = DEFAULT_USD_TO_PKR_RATE
): number {
  if (currentCurrency === 'PKR') return amount;
  return amount * exchangeRate;
}

/**
 * Converts base currency (PKR) into selected currency.
 */
export function convertFromBase(
  amountPKR: number,
  targetCurrency: Currency,
  exchangeRate: number = DEFAULT_USD_TO_PKR_RATE
): number {
  if (targetCurrency === 'PKR') return amountPKR;
  return amountPKR / exchangeRate;
}

export function getCurrencySymbol(currency: Currency): string {
  return currency === 'PKR' ? 'Rs.' : '$';
}

export function getCurrencyDisplay(currency: Currency): {
  code: Currency;
  symbol: string;
  label: string;
  flag: string;
} {
  if (currency === 'PKR') {
    return {
      code: 'PKR',
      symbol: 'Rs.',
      label: 'Pakistani Rupee',
      flag: '🇵🇰',
    };
  }

  return {
    code: 'USD',
    symbol: '$',
    label: 'US Dollar',
    flag: '🇺🇸',
  };
}

export function formatCurrency(
  amountPKR: number,
  currency: Currency,
  exchangeRate: number = DEFAULT_USD_TO_PKR_RATE,
  options?: {
    compact?: boolean;
    decimals?: number;
    showSymbol?: boolean;
  }
): string {
  const showSymbol = options?.showSymbol !== false;
  const converted = convertFromBase(amountPKR, currency, exchangeRate);
  const symbol = getCurrencySymbol(currency);

  if (options?.compact) {
    const absVal = Math.abs(converted);
    let formattedCompact = '';

    if (absVal >= 1_000_000) {
      formattedCompact = `${(converted / 1_000_000).toFixed(1)}M`;
    } else if (absVal >= 1_000) {
      formattedCompact = `${(converted / 1_000).toFixed(1)}K`;
    } else {
      formattedCompact = Math.round(converted).toLocaleString('en-US');
    }

    return showSymbol
      ? (currency === 'PKR' ? `Rs. ${formattedCompact}` : `$${formattedCompact}`)
      : formattedCompact;
  }

  const decimals = currency === 'PKR'
    ? (options?.decimals ?? 0)
    : (options?.decimals ?? 2);

  const rounded = currency === 'PKR' && decimals === 0
    ? Math.round(converted)
    : converted;

  const formatted = rounded.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return showSymbol
    ? (currency === 'PKR' ? `Rs. ${formatted}` : `$${formatted}`)
    : formatted;
}

// Profit calculations use PKR as base currency.

export function calculateProductProfit(
  product: Pick<Product, 'sellingPrice' | 'costPrice'>
): {
  grossProfit: number;
  profitMargin: number;
} {
  const grossProfit = product.sellingPrice - product.costPrice;
  const profitMargin = product.sellingPrice > 0
    ? (grossProfit / product.sellingPrice) * 100
    : 0;

  return { grossProfit, profitMargin };
}

export function calculateOrderProfit(order: Order): {
  grossProfit: number;
  netProfit: number;
  totalCost: number;
  profitMargin: number;
} {
  const totalCost = order.items.reduce(
    (sum, item) => sum + item.costPrice * item.quantity,
    0
  );

  const grossProfit = order.subtotal - totalCost;
  const netProfit =
    grossProfit -
    (order.deliveryCharges || 0) -
    (order.discount || 0) -
    (order.refund || 0);

  const profitMargin = order.total > 0
    ? (netProfit / order.total) * 100
    : 0;

  return {
    grossProfit,
    netProfit,
    totalCost,
    profitMargin,
  };
}
