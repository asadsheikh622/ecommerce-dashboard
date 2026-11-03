import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Header } from '../components/common/Header';
import { AnimatedPrice } from '../components/common/AnimatedPrice';
import { StatusBadge } from '../components/common/StatusBadge';
import { Floating3DObject } from '../components/common/Floating3DObject';
import { useStore } from '../context/StoreContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

export const OverviewPage: React.FC<{ onMobileMenuToggle: () => void }> = ({ onMobileMenuToggle }) => {
  const { stats, orders, products, addToast, dateRangeStats } = useStore();
  const { currency } = useCurrency();

  // Dynamic Sparkline data for Total Revenue derived from active Date Range
  const revenueChartData = useMemo(() => {
    return dateRangeStats.revenueChartData.map((d) => ({
      day: d.label,
      value: d.value,
    }));
  }, [dateRangeStats]);

  // Customer Growth sparkline data derived from active Date Range
  const customerGrowthData = useMemo(() => {
    return dateRangeStats.customerGrowthData.map((d) => ({
      day: d.label,
      value: d.value,
    }));
  }, [dateRangeStats]);

  // Total Sales sparkline data derived from active Date Range
  const salesChartData = useMemo(() => {
    return dateRangeStats.salesChartData.map((d) => ({
      day: d.label,
      value: d.value,
    }));
  }, [dateRangeStats]);

  // Period Visitors Bar chart data derived from active Date Range
  const weeklyBarData = useMemo(() => {
    return dateRangeStats.visitorBarData.map((b) => ({
      day: b.label,
      visitors: b.visitors,
      active: b.active,
    }));
  }, [dateRangeStats]);

  return (
    <div className="space-y-6">
      {/* Top Header with Breadcrumbs & Actions matching Reference Screenshot 1 */}
      <Header
        breadcrumbs={[{ label: 'Dashboard' }]}
        title="Overview"
        subtitle="Monitor key metrics and manage your store"
        onMobileMenuToggle={onMobileMenuToggle}
      />

      {/* ========================================================================= */}
      {/* ROW 1: TOTAL REVENUE (WITH FLOATING 3D OBJECT), CUSTOMER GROWTH, VISITORS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CARD 1: TOTAL REVENUE (HERO WITH ABSTRACT 3D OBJECT) */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -3 }}
          className="group relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800/90 p-6 sm:p-7 hover:border-orange-500/35 transition-all duration-300 flex flex-col justify-between shadow-xl min-h-[290px]"
        >
          {/* Subtle Grid Dot Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-35 z-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Warm Orange Radial Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500 z-0"
            style={{
              background:
                'radial-gradient(circle at 80% 50%, rgba(249, 115, 22, 0.18) 0%, rgba(234, 88, 12, 0.08) 45%, transparent 70%)',
            }}
          />

          {/* Floating Abstract 3D Object (Framer Motion continuously animated) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <Floating3DObject size={145} />
          </div>

          {/* Card Top Header */}
          <div className="relative z-20">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">
              {dateRangeStats.periodLabel}
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">Total Revenue</h3>
          </div>

          {/* Card Value & Key Secondary Metrics */}
          <div className="my-3 relative z-20">
            <div className="flex flex-wrap items-baseline gap-4">
              <div className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">
                <AnimatedPrice amountUSD={stats.totalRevenue} />
              </div>

              <div className="flex items-center gap-3.5 pl-3.5 border-l border-zinc-800 text-xs text-zinc-400">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Orders</span>
                  <span className="font-semibold text-zinc-200 text-sm">{stats.totalOrdersCount}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Avg order</span>
                  <span className="font-semibold text-zinc-200 text-sm">
                    <AnimatedPrice amountUSD={stats.avgOrderValue} decimals={0} />
                  </span>
                </div>
              </div>
            </div>

            {/* Growth indicator */}
            <div className="flex items-center gap-2 mt-2.5 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/25">
                <TrendingUp className="w-3 h-3 text-orange-400" />
                <span>+{stats.revenueGrowth}% vs last month</span>
              </span>
            </div>
          </div>

          {/* Smooth Glowing Orange Curve Line Chart */}
          <div className="h-16 w-full -mb-3 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueOrangeCurve" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                    <stop offset="90%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#f97316"
                  strokeWidth={3}
                  fill="url(#revenueOrangeCurve)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CARD 2: CUSTOMER GROWTH */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -3 }}
          className="group relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800/90 p-6 sm:p-7 hover:border-orange-500/35 transition-all duration-300 flex flex-col justify-between shadow-xl min-h-[290px]"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-30 z-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-70 group-hover:opacity-90 transition-opacity duration-500 z-0"
            style={{
              background: 'radial-gradient(circle at 85% 85%, rgba(249, 115, 22, 0.12) 0%, transparent 65%)',
            }}
          />

          {/* Top Header */}
          <div className="relative z-20">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">
              Total customers
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">Customer Growth</h3>
          </div>

          {/* Value & Growth */}
          <div className="my-3 relative z-20">
            <div className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">
              {dateRangeStats.customerGrowthText}
            </div>
            <div className="flex items-center gap-2 mt-2.5 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/25">
                <TrendingUp className="w-3 h-3 text-orange-400" />
                <span>+{stats.customerGrowth}% vs last period</span>
              </span>
            </div>
          </div>

          {/* Smooth Glowing Orange Curve Line Chart */}
          <div className="h-16 w-full -mb-3 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerGrowthData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="customerOrangeCurve" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="90%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fill="url(#customerOrangeCurve)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CARD 3: WEEKLY VISITORS */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -3 }}
          className="group relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800/90 p-6 sm:p-7 hover:border-orange-500/35 transition-all duration-300 flex flex-col justify-between shadow-xl min-h-[290px]"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-30 z-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity duration-500 z-0"
            style={{
              background: 'radial-gradient(circle at 85% 85%, rgba(249, 115, 22, 0.12) 0%, transparent 65%)',
            }}
          />

          {/* Top Header */}
          <div className="relative z-20">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">
              {dateRangeStats.periodLabel}
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">Period Visitors</h3>
          </div>

          {/* Value & Growth */}
          <div className="my-2 relative z-20">
            <div className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">
              {dateRangeStats.weeklyVisitors}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/25">
                <TrendingUp className="w-3 h-3 text-orange-400" />
                <span>+{dateRangeStats.visitorsGrowth}%</span>
              </span>
            </div>
          </div>

          {/* Mon-Sun Bar Chart with Saturday Highlighted in Orange */}
          <div className="flex items-end gap-2 h-20 pt-2 relative z-20">
            {weeklyBarData.map((b) => (
              <div key={b.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className={`w-full rounded-md transition-all duration-300 ${b.active
                      ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]'
                      : 'bg-zinc-800 hover:bg-zinc-700'
                    }`}
                  style={{ height: `${(b.visitors / 12) * 100}%` }}
                />
                <span
                  className={`text-[10px] font-semibold ${b.active ? 'text-orange-400 font-bold' : 'text-zinc-500'
                    }`}
                >
                  {b.day}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: TOTAL SALES, MONTHLY GOAL (GAUGE), CONVERSION RATE (GAUGE)         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CARD 4: TOTAL SALES */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -3 }}
          className="group relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800/90 p-6 sm:p-7 hover:border-orange-500/35 transition-all duration-300 flex flex-col justify-between shadow-xl min-h-[250px]"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-30 z-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-70 group-hover:opacity-90 transition-opacity duration-500 z-0"
            style={{
              background: 'radial-gradient(circle at 85% 85%, rgba(249, 115, 22, 0.12) 0%, transparent 65%)',
            }}
          />

          <div className="relative z-20">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">
              {dateRangeStats.periodLabel}
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">Total Sales</h3>
          </div>

          <div className="my-2 relative z-20">
            <div className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">
              <AnimatedPrice amountUSD={stats.totalSalesWeek} decimals={0} />
            </div>
            <div className="flex items-center gap-2 mt-2.5 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/25">
                <TrendingUp className="w-3 h-3 text-orange-400" />
                <span>+{stats.profitGrowth}% vs last period</span>
              </span>
            </div>
          </div>

          <div className="h-14 w-full -mb-3 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesOrangeCurve" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="90%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fill="url(#salesOrangeCurve)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CARD 5: MONTHLY GOAL (CIRCULAR ARC GAUGE) */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -3 }}
          className="group relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800/90 p-6 sm:p-7 hover:border-orange-500/35 transition-all duration-300 flex flex-col justify-between shadow-xl min-h-[250px]"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-30 z-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-70 group-hover:opacity-90 transition-opacity duration-500 z-0"
            style={{
              background: 'radial-gradient(circle at 85% 85%, rgba(249, 115, 22, 0.12) 0%, transparent 65%)',
            }}
          />

          <div className="relative z-20">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">
              Revenue target
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">Monthly Goal</h3>
          </div>

          <div className="flex items-center justify-between mt-1 relative z-20">
            <div>
              <div className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">
                {dateRangeStats.goalPercentage}%
              </div>
              <div className="text-xs text-zinc-400 mt-1">Period Target</div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                +14.2% on schedule
              </div>
            </div>

            {/* Glowing Semi-Circle Arc Gauge */}
            <div className="relative flex flex-col items-center justify-center pr-2">
              <svg width="120" height="70" viewBox="0 0 120 70" className="overflow-visible">
                <defs>
                  <linearGradient id="goalArcOrange" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="70%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
                {/* Track */}
                <path
                  d="M 12 65 A 48 48 0 0 1 108 65"
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                {/* Progress Arc: dynamic percentage */}
                <path
                  d="M 12 65 A 48 48 0 0 1 108 65"
                  fill="none"
                  stroke="url(#goalArcOrange)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={Math.PI * 48}
                  strokeDashoffset={Math.PI * 48 * (1 - Math.min(1, dateRangeStats.goalPercentage / 100))}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* CARD 6: CONVERSION RATE (CIRCULAR ARC GAUGE) */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          whileHover={{ y: -3 }}
          className="group relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800/90 p-6 sm:p-7 hover:border-orange-500/35 transition-all duration-300 flex flex-col justify-between shadow-xl min-h-[250px]"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-30 z-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-70 group-hover:opacity-90 transition-opacity duration-500 z-0"
            style={{
              background: 'radial-gradient(circle at 85% 85%, rgba(249, 115, 22, 0.12) 0%, transparent 65%)',
            }}
          />

          <div className="relative z-20">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">
              Visitors to buyers
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">Conversion Rate</h3>
          </div>

          <div className="flex items-center justify-between mt-1 relative z-20">
            <div>
              <div className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">
                {dateRangeStats.conversionRate}%
              </div>
              <div className="text-xs text-zinc-400 mt-1">Industry avg: 3.2%</div>
              <div className="text-[11px] text-orange-400 font-semibold mt-1">
                {dateRangeStats.conversionGrowth > 0 ? '+' : ''}
                {dateRangeStats.conversionGrowth}% {dateRangeStats.conversionGrowth > 0
                  ? 'increase'
                  : dateRangeStats.conversionGrowth < 0
                    ? 'decrease'
                    : 'change'} this period
              </div>
            </div>

            {/* Glowing Semi-Circle Arc Gauge */}
            <div className="relative flex flex-col items-center justify-center pr-2">
              <svg width="120" height="70" viewBox="0 0 120 70" className="overflow-visible">
                <defs>
                  <linearGradient id="conversionArcOrange" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="70%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
                <path
                  d="M 12 65 A 48 48 0 0 1 108 65"
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 12 65 A 48 48 0 0 1 108 65"
                  fill="none"
                  stroke="url(#conversionArcOrange)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={Math.PI * 48}
                  strokeDashoffset={Math.PI * 48 * (1 - Math.min(1, dateRangeStats.conversionRate / 8))}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* FINANCIAL METRICS STRIP                                                   */}
      {/* ========================================================================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Store Profit & Loss Summary</h3>
              <p className="text-[11px] text-zinc-500">
                Live financial engine calculated in active currency ({currency})
              </p>
            </div>
          </div>
          <Link
            to="/profit-loss"
            className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 self-start sm:self-auto bg-zinc-800 hover:bg-zinc-750 px-3 py-1.5 rounded-xl border border-zinc-700 transition-colors"
          >
            <span>Detailed Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-zinc-800/60 rounded-2xl p-3.5 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Total Revenue</span>
            <div className="text-sm font-bold text-white">
              <AnimatedPrice amountUSD={stats.totalRevenue} />
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-2xl p-3.5 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Product Cost</span>
            <div className="text-sm font-bold text-zinc-300">
              <AnimatedPrice amountUSD={stats.totalProductCost} />
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-2xl p-3.5 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Gross Profit</span>
            <div className="text-sm font-bold text-emerald-400">
              <AnimatedPrice amountUSD={stats.grossProfit} />
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-2xl p-3.5 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Expenses</span>
            <div className="text-sm font-bold text-rose-400">
              <AnimatedPrice amountUSD={stats.totalExpenses} />
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-2xl p-3.5 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Net Profit</span>
            <div className="text-sm font-bold text-emerald-400">
              <AnimatedPrice amountUSD={stats.netProfit} />
            </div>
          </div>

          <div className="bg-zinc-800/60 rounded-2xl p-3.5 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Profit Margin</span>
            <div className="text-sm font-bold text-white">{stats.profitMargin}%</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TWO-COLUMN BENTO: RECENT ORDERS & TOP PRODUCTS                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders (2 Cols) */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Fulfillment Feed
              </span>
              <h3 className="text-base font-bold text-white">Recent Store Orders</h3>
            </div>
            <Link
              to="/orders"
              className="text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-750 px-3 py-1.5 rounded-xl border border-zinc-700 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                  <th className="pb-3 pl-2">Customer</th>
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3 pr-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-white">
                          {order.customer.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{order.customer.name}</div>
                          <div className="text-[11px] text-zinc-500">{order.customer.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-zinc-300">{order.orderNumber}</td>
                    <td className="py-3">
                      <StatusBadge status={order.status} type="order" />
                    </td>
                    <td className="py-3 font-semibold text-white">
                      <AnimatedPrice amountUSD={order.total} />
                    </td>
                    <td className="py-3 pr-2 text-right text-zinc-400">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products (1 Col) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Top Catalogue
              </span>
              <h3 className="text-base font-bold text-white">High Margin Items</h3>
            </div>
            <Link
              to="/products/all"
              className="text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-750 px-3 py-1.5 rounded-xl border border-zinc-700 transition-colors flex items-center gap-1"
            >
              <span>Catalogue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((product) => {
              const profit = product.sellingPrice - product.costPrice;
              const margin = ((profit / product.sellingPrice) * 100).toFixed(0);
              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-xl object-cover border border-zinc-700"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-white truncate max-w-[120px]">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500">
                        Stock: {product.stock} units
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-white">
                      <AnimatedPrice amountUSD={product.sellingPrice} />
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      +{margin}% margin
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
