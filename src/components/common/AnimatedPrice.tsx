import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useCurrency } from '../../context/CurrencyContext';

interface AnimatedPriceProps {
  amountUSD: number;
  compact?: boolean;
  className?: string;
  decimals?: number;
  showSymbol?: boolean;
}

export const AnimatedPrice: React.FC<AnimatedPriceProps> = ({
  amountUSD,
  compact = false,
  className = '',
  decimals,
  showSymbol = true,
}) => {
  const { currency, exchangeRate, format, convertFromBase, symbol } = useCurrency();
  const targetConverted = convertFromBase(amountUSD);
  const [displayValue, setDisplayValue] = useState<number>(targetConverted);

  useEffect(() => {
    let animationFrameId: number;
    const startValue = displayValue;
    const diff = targetConverted - startValue;
    const duration = 400; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + diff * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetConverted);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetConverted]);

  // Format using current display value
  const renderFormatted = () => {
    if (compact) {
      const absVal = Math.abs(displayValue);
      let compactStr = '';
      if (absVal >= 1_000_000) {
        compactStr = `${(displayValue / 1_000_000).toFixed(1)}M`;
      } else if (absVal >= 1_000) {
        compactStr = `${(displayValue / 1_000).toFixed(1)}K`;
      } else {
        compactStr = Math.round(displayValue).toLocaleString('en-US');
      }
      return showSymbol ? (currency === 'PKR' ? `Rs. ${compactStr}` : `$${compactStr}`) : compactStr;
    }

    if (currency === 'PKR') {
      const dec = decimals ?? 0;
      const rounded = dec === 0 ? Math.round(displayValue) : displayValue;
      const formatted = rounded.toLocaleString('en-US', {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
      });
      return showSymbol ? `Rs. ${formatted}` : formatted;
    } else {
      const dec = decimals !== undefined ? decimals : (amountUSD % 1 === 0 ? 0 : 2);
      const formatted = displayValue.toLocaleString('en-US', {
        minimumFractionDigits: dec,
        maximumFractionDigits: 2,
      });
      return showSymbol ? `$${formatted}` : formatted;
    }
  };

  return (
    <motion.span
      key={`${currency}-${amountUSD}`}
      initial={{ opacity: 0.8, y: 1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`inline-block tabular-nums font-semibold tracking-tight ${className}`}
    >
      {renderFormatted()}
    </motion.span>
  );
};
