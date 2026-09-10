import { Currency, Order, Product } from '../types';

export const DEFAULT_USD_TO_PKR_RATE = 280;

/**
 * Converts an amount from one currency to another using the exchange rate (1 USD = rate PKR).
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate: number = DEFAULT_USD_TO_PKR_RATE
): number {
  if (fromCurrency === toCurrency) return amount;
  if (fromCurrency === 'USD' && toCurrency === 'PKR') {
    return amount * exchangeRate;
  }
  if (fromCurrency === 'PKR' && toCurrency === 'USD') {
    return amount / exchangeRate;
  }
  return amount;
}

/**
 * Converts any user-input price in the current currency to base currency (USD).
 */
export function convertToBase(
  amount: number,
  currentCurrency: Currency,
  exchangeRate: number = DEFAULT_USD_TO_PKR_RATE
): number {
  if (currentCurrency === 'USD') return amount;
  return amount / exchangeRate;
}

/**
 * Converts a base currency (USD) amount to the target currency.
 */
export function convertFromBase(
  amountUSD: number,
  targetCurrency: Currency,
  exchangeRate: number = DEFAULT_USD_TO_PKR_RATE
): number {
  if (targetCurrency === 'USD') return amountUSD;
  return amountUSD * exchangeRate;
}

/**
 * Returns the symbol for the currency.
 */
export function getCurrencySymbol(currency: Currency): string {
  return currency === 'PKR' ? 'Rs.' : '$';
}

/**
 * Returns the localized flag/label for the currency selector.
 */
export function getCurrencyDisplay(currency: Currency): { code: Currency; symbol: string; label: string; flag: string } {
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

/**
 * Formats a monetary value (stored in base USD) into the specified currency string.
 */
export function formatCurrency(
  amountUSD: number,
  currency: Currency,
  exchangeRate: number = DEFAULT_USD_TO_PKR_RATE,
  options?: {
    compact?: boolean;
    decimals?: number;
    showSymbol?: boolean;
  }
): string {
  const showSymbol = options?.showSymbol !== false;
  const converted = convertFromBase(amountUSD, currency, exchangeRate);
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
    return showSymbol ? (currency === 'PKR' ? `Rs. ${formattedCompact}` : `$${formattedCompact}`) : formattedCompact;
  }

  if (currency === 'PKR') {
    // In PKR, values are typically rounded or whole rupees
    const decimals = options?.decimals ?? 0;
    const rounded = decimals === 0 ? Math.round(converted) : converted;
    const formatted = rounded.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return showSymbol ? `Rs. ${formatted}` : formatted;
  } else {
    // USD
    const decimals = options?.decimals !== undefined ? options.decimals : (amountUSD % 1 === 0 ? 0 : 2);
    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: 2,
    });
    return showSymbol ? `$${formatted}` : formatted;
  }
}

// Profit calculations (All base in USD)

export function calculateProductProfit(product: Pick<Product, 'sellingPrice' | 'costPrice'>): {
  grossProfit: number;
  profitMargin: number;
} {
  const grossProfit = product.sellingPrice - product.costPrice;
  const profitMargin = product.sellingPrice > 0 ? (grossProfit / product.sellingPrice) * 100 : 0;
  return { grossProfit, profitMargin };
}

export function calculateOrderProfit(order: Order): {
  grossProfit: number;
  netProfit: number;
  totalCost: number;
  profitMargin: number;
} {
  const totalCost = order.items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
  const grossProfit = order.subtotal - totalCost;
  const netProfit = grossProfit - (order.deliveryCharges || 0) - (order.discount || 0) - (order.refund || 0);
  const profitMargin = order.total > 0 ? (netProfit / order.total) * 100 : 0;

  return {
    grossProfit,
    netProfit,
    totalCost,
    profitMargin,
  };
}
