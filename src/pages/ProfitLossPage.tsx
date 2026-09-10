import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { StatCard } from '../components/common/StatCard';
import { AnimatedPrice } from '../components/common/AnimatedPrice';
import { useStore } from '../context/StoreContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  TrendingUp,
  DollarSign,
  Package,
  Receipt,
  RotateCcw,
  Percent,
  Calendar,
  Layers,
  PieChart,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const ProfitLossPage: React.FC<{ onMobileMenuToggle: () => void }> = ({ onMobileMenuToggle }) => {
  const { stats, expenses } = useStore();
  const { currency, symbol, format, convertFromBase } = useCurrency();
  const [timeframe, setTimeframe] = useState<'Week' | 'Month' | 'Year'>('Month');

  // Multi-line chart data (base values stored in USD)
  const chartData = [
    { period: 'Week 1', revenue: 65, cost: 42, profit: 15 },
    { period: 'Week 2', revenue: 78, cost: 50, profit: 18 },
    { period: 'Week 3', revenue: 74, cost: 48, profit: 16 },
    { period: 'Week 4', revenue: 84.3, cost: 55.2, profit: 18.6 },
  ];

  // Convert chart values dynamically for the Recharts graph
  const convertedChartData = chartData.map((d) => ({
    period: d.period,
    revenue: Math.round(convertFromBase(d.revenue)),
    cost: Math.round(convertFromBase(d.cost)),
    profit: Math.round(convertFromBase(d.profit)),
  }));

  // Custom Currency-aware Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#141414] border border-white/[0.12] p-3 rounded-2xl shadow-2xl text-xs space-y-1.5 backdrop-blur-md">
          <p className="font-bold text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-mono font-bold text-white">
                {currency === 'PKR' ? `Rs. ${entry.value.toLocaleString()}` : `$${entry.value.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Profit & Loss' }]}
        title="Profit & Loss"
        subtitle="Track revenue, costs, expenses and net profit"
        onMobileMenuToggle={onMobileMenuToggle}
      />

      {/* Top 7 Statistics Cards in Bento Grid style */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* 1. Total Revenue */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all shadow-md">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Total Revenue</span>
          <div className="text-base sm:text-lg font-bold text-white">
            <AnimatedPrice amountUSD={stats.totalRevenue} />
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">+18.2% vs last mo</span>
        </div>

        {/* 2. Product Cost */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all shadow-md">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Product Cost</span>
          <div className="text-base sm:text-lg font-bold text-zinc-300">
            <AnimatedPrice amountUSD={stats.totalProductCost} />
          </div>
          <span className="text-[10px] text-zinc-500 font-semibold mt-1 block">Cost of Goods Sold</span>
        </div>

        {/* 3. Gross Profit */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all shadow-md">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Gross Profit</span>
          <div className="text-base sm:text-lg font-bold text-emerald-400">
            <AnimatedPrice amountUSD={stats.grossProfit} />
          </div>
          <span className="text-[10px] text-zinc-500 font-semibold mt-1 block">Rev - COGS</span>
        </div>

        {/* 4. Expenses */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all shadow-md">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Expenses</span>
          <div className="text-base sm:text-lg font-bold text-rose-400">
            <AnimatedPrice amountUSD={stats.totalExpenses} />
          </div>
          <span className="text-[10px] text-zinc-500 font-semibold mt-1 block">Ads, rent, logistics</span>
        </div>

        {/* 5. Refunds */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all shadow-md">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Refunds</span>
          <div className="text-base sm:text-lg font-bold text-zinc-300">
            <AnimatedPrice amountUSD={stats.totalRefunds} />
          </div>
          <span className="text-[10px] text-zinc-500 font-semibold mt-1 block">0 claims approved</span>
        </div>

        {/* 6. Net Profit */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-zinc-600 transition-all shadow-lg">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Net Profit</span>
          <div className="text-base sm:text-lg font-bold text-emerald-400">
            <AnimatedPrice amountUSD={stats.netProfit} />
          </div>
          <span className="text-[10px] text-emerald-300 font-semibold mt-1 block">+15.4% growth</span>
        </div>

        {/* 7. Profit Margin */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all shadow-md">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Profit Margin</span>
          <div className="text-base sm:text-lg font-bold text-white">{stats.profitMargin}%</div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Net/Revenue ratio</span>
        </div>
      </div>

      {/* Main Chart Bento Card */}
      <div className="rounded-[2rem] bg-zinc-900 border border-zinc-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
              Trajectory Analysis
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Revenue vs Cost vs Profit</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold">
                In {currency}
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Comprehensive financial trajectory across active accounting period
            </p>
          </div>

          {/* Timeframe Toggles in Bento Style */}
          <div className="flex items-center gap-1 p-1 bg-zinc-800 border border-zinc-700 rounded-xl self-start sm:self-auto">
            {(['Week', 'Month', 'Year'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  timeframe === t
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t === 'Week' ? 'This Week' : t === 'Month' ? 'This Month' : 'This Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Multi-Line Recharts */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={convertedChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="period" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }} />
              <Line
                type="monotone"
                name="Revenue"
                dataKey="revenue"
                stroke="#ffffff"
                strokeWidth={3}
                dot={{ r: 4, fill: '#ffffff' }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                name="Product Cost"
                dataKey="cost"
                stroke="#71717a"
                strokeWidth={2}
                dot={{ r: 3, fill: '#71717a' }}
              />
              <Line
                type="monotone"
                name="Net Profit"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Statement Breakdown Table - Bento Container */}
      <div className="rounded-[2rem] bg-zinc-900 border border-zinc-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
              Ledger Accounting
            </span>
            <h3 className="text-base font-bold text-white">Financial Statement Breakdown</h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">Base Unit: {currency}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                <th className="py-3 pl-4">Accounting Line</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3">Calculation Basis</th>
                <th className="py-3 pr-4 text-right">Amount ({currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              <tr className="hover:bg-zinc-800/40">
                <td className="py-3 pl-4 font-semibold text-white">Gross Store Sales</td>
                <td className="py-3 px-3 text-emerald-400 font-medium">Income</td>
                <td className="py-3 px-3 text-zinc-400">1,284 Completed Customer Orders</td>
                <td className="py-3 pr-4 text-right font-bold text-white">
                  <AnimatedPrice amountUSD={stats.totalRevenue} />
                </td>
              </tr>
              <tr className="hover:bg-zinc-800/40">
                <td className="py-3 pl-4 font-semibold text-zinc-300">Cost of Goods Sold (COGS)</td>
                <td className="py-3 px-3 text-rose-400 font-medium">Direct Cost</td>
                <td className="py-3 px-3 text-zinc-400">Raw materials, manufacturing & fabric</td>
                <td className="py-3 pr-4 text-right font-bold text-zinc-300">
                  -<AnimatedPrice amountUSD={stats.totalProductCost} />
                </td>
              </tr>
              <tr className="bg-emerald-500/5">
                <td className="py-3 pl-4 font-bold text-emerald-400">Gross Operating Profit</td>
                <td className="py-3 px-3 text-emerald-400 font-semibold">Subtotal</td>
                <td className="py-3 px-3 text-zinc-400">Revenue - Cost of Goods Sold</td>
                <td className="py-3 pr-4 text-right font-black text-emerald-400">
                  <AnimatedPrice amountUSD={stats.grossProfit} />
                </td>
              </tr>
              <tr className="hover:bg-zinc-800/40">
                <td className="py-3 pl-4 font-semibold text-zinc-300">Operating Expenses (OPEX)</td>
                <td className="py-3 px-3 text-rose-400 font-medium">Indirect Cost</td>
                <td className="py-3 px-3 text-zinc-400">Ads, packaging, courier logistics, salaries</td>
                <td className="py-3 pr-4 text-right font-bold text-rose-400">
                  -<AnimatedPrice amountUSD={stats.totalExpenses} />
                </td>
              </tr>
              <tr className="hover:bg-zinc-800/40">
                <td className="py-3 pl-4 font-semibold text-zinc-300">Customer Returns & Discounts</td>
                <td className="py-3 px-3 text-amber-400 font-medium">Deduction</td>
                <td className="py-3 px-3 text-zinc-400">Promotions, size replacements</td>
                <td className="py-3 pr-4 text-right font-bold text-zinc-400">
                  <AnimatedPrice amountUSD={0} />
                </td>
              </tr>
              <tr className="bg-emerald-500/10 border-t-2 border-emerald-500/30">
                <td className="py-3.5 pl-4 font-bold text-emerald-400 text-sm">
                  Store Net Profit
                </td>
                <td className="py-3.5 px-3 font-bold text-emerald-400">Final Net</td>
                <td className="py-3.5 px-3 text-zinc-300 font-medium">
                  Gross Profit - OPEX ({stats.profitMargin}% margin)
                </td>
                <td className="py-3.5 pr-4 text-right font-bold text-emerald-400 text-sm">
                  <AnimatedPrice amountUSD={stats.netProfit} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
