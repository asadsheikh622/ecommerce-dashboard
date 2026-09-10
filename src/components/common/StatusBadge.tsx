import React from 'react';
import { CheckCircle2, Clock, Truck, AlertCircle, XCircle, ShieldCheck, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  type?: 'product' | 'order' | 'payment' | 'user';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'product',
  size = 'sm',
}) => {
  const getBadgeStyle = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'delivered':
      case 'paid':
      case 'verified':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          dot: 'bg-emerald-400',
        };
      case 'processing':
        return {
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
          dot: 'bg-sky-400',
        };
      case 'pending':
      case 'unverified':
      case 'unpaid':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          dot: 'bg-amber-400',
        };
      case 'out of stock':
      case 'cancelled':
      case 'deleted':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          dot: 'bg-rose-400',
        };
      case 'inactive':
      default:
        return {
          bg: 'bg-zinc-800 text-zinc-400 border-zinc-700/50',
          dot: 'bg-zinc-500',
        };
    }
  };

  const style = getBadgeStyle();
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style.bg} ${sizeClasses} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{status}</span>
    </span>
  );
};
