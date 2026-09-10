import { DateRangeState, Expense } from '../types';
import { diffInDays } from './dateUtils';

export interface DateRangeStats {
  totalRevenue: number;
  totalProfit: number;
  totalOrdersCount: number;
  avgOrderValue: number;
  revenueGrowth: number;
  profitGrowth: number;
  customerGrowth: number;
  customerGrowthText: string;
  weeklyVisitors: string;
  visitorsGrowth: number;
  totalSalesWeek: number;
  profitMargin: number;
  totalProductCost: number;
  grossProfit: number;
  totalExpenses: number;
  totalRefunds: number;
  netProfit: number;
  goalPercentage: number;
  conversionRate: number;
  periodLabel: string;
  // Dynamic Chart series
  revenueChartData: { label: string; value: number }[];
  customerGrowthData: { label: string; value: number }[];
  salesChartData: { label: string; value: number }[];
  visitorBarData: { label: string; visitors: number; active: boolean }[];
}

export function computeMetricsForRange(
  range: DateRangeState,
  expenses: Expense[]
): DateRangeStats {
  const start = new Date(range.startDate);
  const end = new Date(range.endDate);
  const days = Math.max(1, diffInDays(start, end));

  const totalBaseExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Benchmarks for full month (~30 days)
  const monthlyRevenue = 301.07;
  const monthlyProductCost = 197.14;
  const monthlyExpense = Math.max(37.5, totalBaseExpenses);

  let rev = monthlyRevenue;
  let cost = monthlyProductCost;
  let exp = monthlyExpense;
  let ordersCount = 1284;
  let revGrowth = 18.2;
  let customerText = '12.8K';
  let custGrowth = 9.3;
  let visitorsText = '48.2K';
  let visitorsGrowth = 12.4;
  let goalPct = 78;
  let conversion = 4.9;

  let revenueChart: { label: string; value: number }[] = [];
  let customerChart: { label: string; value: number }[] = [];
  let salesChart: { label: string; value: number }[] = [];
  let visitorBars: { label: string; visitors: number; active: boolean }[] = [];

  switch (range.preset) {
    case 'today':
      rev = 14.25;
      cost = 9.35;
      exp = 1.8;
      ordersCount = 46;
      revGrowth = 8.4;
      customerText = '184';
      custGrowth = 5.1;
      visitorsText = '2.1K';
      visitorsGrowth = 6.5;
      goalPct = 92;
      conversion = 5.2;
      revenueChart = [
        { label: '06:00', value: 1.2 },
        { label: '09:00', value: 3.4 },
        { label: '12:00', value: 6.8 },
        { label: '15:00', value: 9.5 },
        { label: '18:00', value: 12.1 },
        { label: '21:00', value: 14.25 },
      ];
      customerChart = [
        { label: '06:00', value: 24 },
        { label: '09:00', value: 65 },
        { label: '12:00', value: 110 },
        { label: '15:00', value: 145 },
        { label: '18:00', value: 168 },
        { label: '21:00', value: 184 },
      ];
      salesChart = [
        { label: '08:00', value: 2 },
        { label: '11:00', value: 4 },
        { label: '14:00', value: 7 },
        { label: '17:00', value: 11 },
        { label: '20:00', value: 14.25 },
      ];
      visitorBars = [
        { label: '00-04', visitors: 0.2, active: false },
        { label: '04-08', visitors: 0.4, active: false },
        { label: '08-12', visitors: 0.7, active: false },
        { label: '12-16', visitors: 0.9, active: true },
        { label: '16-20', visitors: 0.6, active: false },
        { label: '20-24', visitors: 0.3, active: false },
      ];
      break;

    case 'yesterday':
      rev = 16.8;
      cost = 10.95;
      exp = 2.1;
      ordersCount = 52;
      revGrowth = 6.2;
      customerText = '210';
      custGrowth = 4.8;
      visitorsText = '2.4K';
      visitorsGrowth = 5.9;
      goalPct = 88;
      conversion = 4.7;
      revenueChart = [
        { label: '06:00', value: 1.5 },
        { label: '09:00', value: 4.1 },
        { label: '12:00', value: 7.9 },
        { label: '15:00', value: 11.2 },
        { label: '18:00', value: 14.6 },
        { label: '21:00', value: 16.8 },
      ];
      customerChart = [
        { label: '06:00', value: 30 },
        { label: '09:00', value: 78 },
        { label: '12:00', value: 125 },
        { label: '15:00', value: 165 },
        { label: '18:00', value: 192 },
        { label: '21:00', value: 210 },
      ];
      salesChart = [
        { label: '08:00', value: 3 },
        { label: '11:00', value: 6 },
        { label: '14:00', value: 9 },
        { label: '17:00', value: 13 },
        { label: '20:00', value: 16.8 },
      ];
      visitorBars = [
        { label: '00-04', visitors: 0.3, active: false },
        { label: '04-08', visitors: 0.5, active: false },
        { label: '08-12', visitors: 0.8, active: true },
        { label: '12-16', visitors: 0.7, active: false },
        { label: '16-20', visitors: 0.5, active: false },
        { label: '20-24', visitors: 0.3, active: false },
      ];
      break;

    case 'last7days':
      rev = 82.14;
      cost = 53.8;
      exp = 10.5;
      ordersCount = 295;
      revGrowth = 14.8;
      customerText = '2.9K';
      custGrowth = 11.2;
      visitorsText = '11.8K';
      visitorsGrowth = 14.2;
      goalPct = 82;
      conversion = 5.1;
      revenueChart = [
        { label: 'Day 1', value: 9.8 },
        { label: 'Day 2', value: 11.2 },
        { label: 'Day 3', value: 10.5 },
        { label: 'Day 4', value: 13.4 },
        { label: 'Day 5', value: 12.1 },
        { label: 'Day 6', value: 16.2 },
        { label: 'Day 7', value: 14.8 },
      ];
      customerChart = [
        { label: 'Day 1', value: 2.1 },
        { label: 'Day 2', value: 2.25 },
        { label: 'Day 3', value: 2.4 },
        { label: 'Day 4', value: 2.58 },
        { label: 'Day 5', value: 2.7 },
        { label: 'Day 6', value: 2.82 },
        { label: 'Day 7', value: 2.9 },
      ];
      salesChart = [
        { label: 'Mon', value: 10 },
        { label: 'Tue', value: 12 },
        { label: 'Wed', value: 11 },
        { label: 'Thu', value: 14 },
        { label: 'Fri', value: 13 },
        { label: 'Sat', value: 18 },
        { label: 'Sun', value: 15 },
      ];
      visitorBars = [
        { label: 'Mon', visitors: 1.4, active: false },
        { label: 'Tue', visitors: 1.6, active: false },
        { label: 'Wed', visitors: 1.5, active: false },
        { label: 'Thu', visitors: 1.9, active: false },
        { label: 'Fri', visitors: 2.1, active: false },
        { label: 'Sat', visitors: 2.8, active: true },
        { label: 'Sun', visitors: 1.7, active: false },
      ];
      break;

    case 'last28days':
    case 'last30days':
      rev = range.preset === 'last28days' ? 275.5 : 292.0;
      cost = (rev * 0.65);
      exp = 34.8;
      ordersCount = range.preset === 'last28days' ? 1180 : 1245;
      revGrowth = 16.9;
      customerText = range.preset === 'last28days' ? '11.6K' : '12.4K';
      custGrowth = 9.1;
      visitorsText = range.preset === 'last28days' ? '44.6K' : '47.1K';
      visitorsGrowth = 12.0;
      goalPct = 76;
      conversion = 4.8;
      revenueChart = [
        { label: 'W1', value: 68 },
        { label: 'W2', value: 135 },
        { label: 'W3', value: 205 },
        { label: 'W4', value: rev },
      ];
      customerChart = [
        { label: 'W1', value: 3.2 },
        { label: 'W2', value: 6.4 },
        { label: 'W3', value: 9.5 },
        { label: 'W4', value: parseFloat(customerText) },
      ];
      salesChart = [
        { label: 'W1', value: 62 },
        { label: 'W2', value: 71 },
        { label: 'W3', value: 68 },
        { label: 'W4', value: 85 },
      ];
      visitorBars = [
        { label: 'Mon', visitors: 4.0, active: false },
        { label: 'Tue', visitors: 5.8, active: false },
        { label: 'Wed', visitors: 5.5, active: false },
        { label: 'Thu', visitors: 7.1, active: false },
        { label: 'Fri', visitors: 8.5, active: false },
        { label: 'Sat', visitors: 10.9, active: true },
        { label: 'Sun', visitors: 4.1, active: false },
      ];
      break;

    case 'lastMonth':
      rev = 284.5;
      cost = 186.2;
      exp = 36.2;
      ordersCount = 1190;
      revGrowth = 12.1;
      customerText = '11.9K';
      custGrowth = 8.5;
      visitorsText = '43.5K';
      visitorsGrowth = 10.2;
      goalPct = 74;
      conversion = 4.6;
      revenueChart = [
        { label: '1', value: 20 },
        { label: '5', value: 32 },
        { label: '10', value: 29 },
        { label: '15', value: 48 },
        { label: '20', value: 55 },
        { label: '25', value: 68 },
        { label: '30', value: 81.2 },
      ];
      customerChart = [
        { label: '1', value: 7.8 },
        { label: '5', value: 8.4 },
        { label: '10', value: 8.9 },
        { label: '15', value: 9.8 },
        { label: '20', value: 10.5 },
        { label: '25', value: 11.2 },
        { label: '30', value: 11.9 },
      ];
      salesChart = [
        { label: 'W1', value: 60 },
        { label: 'W2', value: 68 },
        { label: 'W3', value: 65 },
        { label: 'W4', value: 78 },
      ];
      visitorBars = [
        { label: 'Mon', visitors: 3.8, active: false },
        { label: 'Tue', visitors: 5.6, active: false },
        { label: 'Wed', visitors: 5.3, active: false },
        { label: 'Thu', visitors: 6.9, active: false },
        { label: 'Fri', visitors: 8.2, active: false },
        { label: 'Sat', visitors: 10.5, active: true },
        { label: 'Sun', visitors: 4.0, active: false },
      ];
      break;

    case 'thisMonth':
    default:
      if (range.preset === 'custom') {
        const ratio = days / 30;
        rev = Math.max(8.5, parseFloat((monthlyRevenue * ratio).toFixed(2)));
        cost = parseFloat((rev * 0.655).toFixed(2));
        exp = Math.max(2.0, parseFloat((monthlyExpense * ratio).toFixed(2)));
        ordersCount = Math.max(10, Math.round(1284 * ratio));
        revGrowth = parseFloat((15.0 + Math.sin(days) * 3).toFixed(1));
        const custNum = Math.max(0.1, (12.8 * ratio)).toFixed(1);
        customerText = `${custNum}K`;
        custGrowth = 8.8;
        const visNum = Math.max(0.5, (48.2 * ratio)).toFixed(1);
        visitorsText = `${visNum}K`;
        visitorsGrowth = 11.5;
        goalPct = Math.min(100, Math.round(78 * Math.min(1.2, ratio)));
        conversion = 4.8;

        // Construct dynamic chart data based on day count
        const sampleCount = Math.min(7, Math.max(4, days));
        revenueChart = Array.from({ length: sampleCount }, (_, idx) => ({
          label: `P${idx + 1}`,
          value: parseFloat(((rev / sampleCount) * (idx + 1) * (0.85 + Math.sin(idx) * 0.15)).toFixed(1)),
        }));
        customerChart = Array.from({ length: sampleCount }, (_, idx) => ({
          label: `P${idx + 1}`,
          value: parseFloat(((parseFloat(customerText) / sampleCount) * (idx + 1)).toFixed(1)),
        }));
        salesChart = Array.from({ length: sampleCount }, (_, idx) => ({
          label: `D${idx + 1}`,
          value: parseFloat(((rev / sampleCount) * (0.9 + Math.cos(idx) * 0.2)).toFixed(1)),
        }));
        visitorBars = [
          { label: 'Mon', visitors: parseFloat((3.5 * ratio).toFixed(1)), active: false },
          { label: 'Tue', visitors: parseFloat((5.2 * ratio).toFixed(1)), active: false },
          { label: 'Wed', visitors: parseFloat((4.9 * ratio).toFixed(1)), active: false },
          { label: 'Thu', visitors: parseFloat((6.4 * ratio).toFixed(1)), active: false },
          { label: 'Fri', visitors: parseFloat((7.8 * ratio).toFixed(1)), active: false },
          { label: 'Sat', visitors: parseFloat((9.8 * ratio).toFixed(1)), active: true },
          { label: 'Sun', visitors: parseFloat((3.8 * ratio).toFixed(1)), active: false },
        ];
      } else {
        // Benchmark exact 'thisMonth' values
        rev = monthlyRevenue;
        cost = monthlyProductCost;
        exp = monthlyExpense;
        ordersCount = 1284;
        revGrowth = 18.2;
        customerText = '12.8K';
        custGrowth = 9.3;
        visitorsText = '48.2K';
        visitorsGrowth = 12.4;
        goalPct = 78;
        conversion = 4.9;
        revenueChart = [
          { label: '1', value: 24 },
          { label: '5', value: 36 },
          { label: '10', value: 31 },
          { label: '15', value: 52 },
          { label: '20', value: 58 },
          { label: '25', value: 72 },
          { label: '30', value: 84.3 },
        ];
        customerChart = [
          { label: '1', value: 8.2 },
          { label: '5', value: 9.1 },
          { label: '10', value: 8.9 },
          { label: '15', value: 10.4 },
          { label: '20', value: 11.2 },
          { label: '25', value: 12.0 },
          { label: '30', value: 12.8 },
        ];
        salesChart = [
          { label: '1', value: 14 },
          { label: '2', value: 16 },
          { label: '3', value: 15 },
          { label: '4', value: 19 },
          { label: '5', value: 21 },
          { label: '6', value: 25 },
          { label: '7', value: 23 },
        ];
        visitorBars = [
          { label: 'Mon', visitors: 4.2, active: false },
          { label: 'Tue', visitors: 6.1, active: false },
          { label: 'Wed', visitors: 5.8, active: false },
          { label: 'Thu', visitors: 7.4, active: false },
          { label: 'Fri', visitors: 8.9, active: false },
          { label: 'Sat', visitors: 11.5, active: true },
          { label: 'Sun', visitors: 4.3, active: false },
        ];
      }
      break;
  }

  const grossProfit = rev - cost;
  const totalRefunds = 0;
  const netProfit = grossProfit - exp - totalRefunds;
  const profitMargin = rev > 0 ? parseFloat(((netProfit / rev) * 100).toFixed(1)) : 0;
  const avgOrder = ordersCount > 0 ? parseFloat((rev / ordersCount).toFixed(2)) : 10.18;

  const periodLabels: Record<string, string> = {
    today: 'Today',
    yesterday: 'Yesterday',
    last7days: 'Last 7 days',
    last28days: 'Last 28 days',
    last30days: 'Last 30 days',
    thisMonth: 'This month',
    lastMonth: 'Last month',
    custom: `${days} days selected`,
  };

  return {
    totalRevenue: rev,
    totalProfit: netProfit,
    totalOrdersCount: ordersCount,
    avgOrderValue: avgOrder,
    revenueGrowth: revGrowth,
    profitGrowth: parseFloat((revGrowth * 0.85).toFixed(1)),
    customerGrowth: custGrowth,
    customerGrowthText: customerText,
    weeklyVisitors: visitorsText,
    visitorsGrowth,
    totalSalesWeek: range.preset === 'today' ? rev : Math.min(rev, 82.14),
    profitMargin,
    totalProductCost: cost,
    grossProfit,
    totalExpenses: exp,
    totalRefunds,
    netProfit,
    goalPercentage: goalPct,
    conversionRate: conversion,
    periodLabel: periodLabels[range.preset] || `${days} days`,
    revenueChartData: revenueChart,
    customerGrowthData: customerChart,
    salesChartData: salesChart,
    visitorBarData: visitorBars,
  };
}
