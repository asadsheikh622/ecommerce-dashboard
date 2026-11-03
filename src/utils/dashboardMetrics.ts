import { DateRangeState, Expense, Order, Product } from '../types';
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
  conversionGrowth: number;
  periodLabel: string;
  // Dynamic Chart series
  revenueChartData: { label: string; value: number }[];
  customerGrowthData: { label: string; value: number }[];
  salesChartData: { label: string; value: number }[];
  visitorBarData: { label: string; visitors: number; active: boolean }[];
}

export function computeMetricsForRange(
  range: DateRangeState,
  expenses: Expense[],
  orders: Order[],
  products: Product[],
  monthlyGoal: number,
  visitors: { visitorId: string; createdAt: string }[]

): DateRangeStats {
  const start = new Date(range.startDate);
  const end = new Date(range.endDate);
  const days = Math.max(1, diffInDays(start, end));

  // Real database calculations
  const startTime = start.getTime();
  const endTime = end.getTime();

  const periodOrders = orders.filter((order) => {
    const orderTime = new Date(order.date).getTime();

    return (
      orderTime >= startTime &&
      orderTime <= endTime &&
      order.status !== 'Cancelled'
    );
  });

  const deliveredOrders = periodOrders.filter(
    (order) => order.status === 'Delivered'
  );

  const rev = deliveredOrders.reduce(
    (sum, order) => sum + order.subtotal - order.discount,
    0
  );

  const ordersCount = periodOrders.length;

  const cost = deliveredOrders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => {
      const product = products.find(
        (p) => p.id === item.productId
      );

      const itemCost = product?.costPrice ?? item.costPrice ?? 0;

      return itemSum + itemCost * item.quantity;
    }, 0);
  }, 0);

  const exp = expenses
    .filter((expense) => {
      const expenseTime = new Date(expense.date).getTime();
      return expenseTime >= startTime && expenseTime <= endTime;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const revGrowth = 0;
  const custGrowth = 0;
  const customerText = new Set(
    periodOrders.map((order) => order.customer.email)
  ).size.toString();

  const periodVisitors = visitors.filter((visitor) => {
  const visitTime = new Date(visitor.createdAt).getTime();

  return visitTime >= startTime && visitTime <= endTime;
});

const currentVisitorCount = new Set(
  periodVisitors.map((visitor) => visitor.visitorId)
).size;

// Previous period: same duration as the selected period
const periodDuration = endTime - startTime + 1;
const previousStartTime = startTime - periodDuration;
const previousEndTime = startTime - 1;

const previousVisitors = visitors.filter((visitor) => {
  const visitTime = new Date(visitor.createdAt).getTime();

  return (
    visitTime >= previousStartTime &&
    visitTime <= previousEndTime
  );
});

const previousVisitorCount = new Set(
  previousVisitors.map((visitor) => visitor.visitorId)
).size;

const visitorsText = currentVisitorCount.toString();

const visitorsGrowth = previousVisitorCount > 0
  ? Number(
      (((currentVisitorCount - previousVisitorCount) /
        previousVisitorCount) * 100).toFixed(1)
    )
  : 0;

  const goalPct = monthlyGoal > 0
  ? Math.round((rev / monthlyGoal) * 100)
  : 0;
  
  const uniqueBuyers = new Set(
  periodOrders
    .filter((order) => order.visitorId)
    .map((order) => order.visitorId)
).size;

const conversion = currentVisitorCount > 0
  ? Number(((uniqueBuyers / currentVisitorCount) * 100).toFixed(1))
  : 0;

// Previous period buyers
const previousPeriodOrders = orders.filter((order) => {
  const orderTime = new Date(order.date).getTime();

  return (
    orderTime >= previousStartTime &&
    orderTime <= previousEndTime &&
    order.status !== 'Cancelled'
  );
});

const previousUniqueBuyers = new Set(
  previousPeriodOrders
    .filter((order) => order.visitorId)
    .map((order) => order.visitorId)
).size;

const previousConversion = previousVisitorCount > 0
  ? (previousUniqueBuyers / previousVisitorCount) * 100
  : 0;

const conversionGrowth = previousConversion > 0
  ? Number((conversion - previousConversion).toFixed(1))
  : 0;

  const revenueChart: { label: string; value: number }[] = [];
  const customerChart: { label: string; value: number }[] = [];
  const salesChart: { label: string; value: number }[] = [];
  const visitorBars: { label: string; visitors: number; active: boolean }[] = [];

for (let i = 6; i >= 0; i--) {
  const day = new Date(end);
  day.setDate(day.getDate() - i);

  const dayKey = day.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Karachi',
  });

  const dayVisitors = visitors.filter((visitor) => {
    const visitDate = new Date(visitor.createdAt).toLocaleDateString(
      'en-CA',
      { timeZone: 'Asia/Karachi' }
    );

    return visitDate === dayKey;
  }).length;

  visitorBars.push({
    label: day.toLocaleDateString('en-PK', {
      weekday: 'short',
      timeZone: 'Asia/Karachi',
    }),
    visitors: dayVisitors,
    active: i === 0,
  });
}

  const grossProfit = rev - cost;
const totalRefunds = deliveredOrders
  .filter((order) => order.paymentStatus === 'Refunded')
  .reduce((sum, order) => sum + order.total, 0);
  const netProfit = grossProfit - exp - totalRefunds;
  const profitMargin = rev > 0 ? parseFloat(((netProfit / rev) * 100).toFixed(1)) : 0;
  const deliveredOrdersCount = deliveredOrders.length;

const avgOrder = deliveredOrdersCount > 0
  ? parseFloat((rev / deliveredOrdersCount).toFixed(2))
  : 0;

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
    totalSalesWeek: rev,
    profitMargin,
    totalProductCost: cost,
    grossProfit,
    totalExpenses: exp,
    totalRefunds,
    netProfit,
    goalPercentage: goalPct,
    conversionRate: conversion,
    conversionGrowth: conversionGrowth,
    periodLabel: periodLabels[range.preset] || `${days} days`,
    revenueChartData: revenueChart,
    customerGrowthData: customerChart,
    salesChartData: salesChart,
    visitorBarData: visitorBars,
  };
}
