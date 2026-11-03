import React, { useState, useMemo } from 'react';
import { Header } from '../components/common/Header';
import { TopStatStrip, TopStatItem } from '../components/common/TopStatStrip';
import { FilterBar } from '../components/common/FilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { AnimatedPrice } from '../components/common/AnimatedPrice';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useStore } from '../context/StoreContext';
import { useCurrency } from '../context/CurrencyContext';
import { Order, OrderStatus, PaymentStatus } from '../types';
import { calculateOrderProfit } from '../utils/currency';
import {
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Search,
  MoreHorizontal,
  Eye,
  Check,
  Ban,
  DollarSign,
  PackageCheck,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  Receipt,
} from 'lucide-react';

export const OrdersPage: React.FC<{ onMobileMenuToggle: () => void }> = ({ onMobileMenuToggle }) => {
  const { orders, updateOrderStatus, updatePaymentStatus, cancelOrder, addToast } = useStore();
  const { currency, symbol, format } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [dateSort, setDateSort] = useState('Newest');

  // Active view order modal
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [actionDropdownOpenId, setActionDropdownOpenId] = useState<string | null>(null);

  // Filtered orders
  const visibleOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matches =
            o.orderNumber.toLowerCase().includes(term) ||
            o.customer.name.toLowerCase().includes(term) ||
            o.customer.email.toLowerCase().includes(term);
          if (!matches) return false;
        }

        if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) {
          return false;
        }

        if (paymentStatusFilter !== 'All' && o.paymentStatus !== paymentStatusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (dateSort === 'Oldest') return a.id.localeCompare(b.id);
        return b.id.localeCompare(a.id);
      });
  }, [orders, searchTerm, orderStatusFilter, paymentStatusFilter, dateSort]);

  // Dynamic Statistics from Database Orders
const totalOrdersCount = orders.length;

const pendingCount = orders.filter(
  (order) => order.status === 'Pending'
).length;

const processingCount = orders.filter(
  (order) => order.status === 'Processing'
).length;

const deliveredCount = orders.filter(
  (order) => order.status === 'Delivered'
).length;

const cancelledCount = orders.filter(
  (order) => order.status === 'Cancelled'
).length;

  const topStats: TopStatItem[] = [
    {
      id: 'total',
      label: 'Total Orders',
      value: totalOrdersCount,
      icon: <ShoppingCart className="w-4 h-4" />,
      color: 'orange',
    },
    {
      id: 'pending',
      label: 'Pending',
      value: pendingCount,
      icon: <Clock className="w-4 h-4" />,
      color: 'yellow',
    },
    {
      id: 'processing',
      label: 'Processing',
      value: processingCount,
      icon: <Truck className="w-4 h-4" />,
      color: 'blue',
    },
    {
      id: 'delivered',
      label: 'Delivered',
      value: deliveredCount,
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: 'green',
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      value: cancelledCount,
      icon: <XCircle className="w-4 h-4" />,
      color: 'red',
    },
  ];

  const resetFilters = () => {
    setSearchTerm('');
    setOrderStatusFilter('All');
    setPaymentStatusFilter('All');
    setDateSort('Newest');
  };

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Orders' }]}
        title="Orders"
        subtitle="View and manage customer orders"
        onMobileMenuToggle={onMobileMenuToggle}
      />

      {/* Top 5 Metric Cards matching Screenshot 4 */}
      <TopStatStrip items={topStats} />

      {/* Filter Bar */}
      <FilterBar onReset={resetFilters}>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Search</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Order Status</label>
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="All">Select status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Payment Status</label>
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="All">Select payment status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Date</label>
          <select
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="Newest">Newest first</option>
            <option value="Oldest">Oldest first</option>
          </select>
        </div>
      </FilterBar>

      {/* Orders Table - Bento Container */}
      <div className="rounded-[2rem] bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                <th className="py-3.5 pl-5">Customer</th>
                <th className="py-3.5 px-3">Order #</th>
                <th className="py-3.5 px-3">Items</th>
                <th className="py-3.5 px-3">Total</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Payment</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {visibleOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                    <p className="text-sm">No orders found</p>
                  </td>
                </tr>
              ) : (
                visibleOrders.map((order) => {
                  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => setViewingOrder(order)}
                    >
                      {/* Customer */}
                      <td className="py-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/[0.1] flex items-center justify-center text-xs font-bold text-white">
                            {order.customer.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                              {order.customer.name}
                            </div>
                            <div className="text-[11px] text-zinc-500">{order.customer.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Order # */}
                      <td className="py-3.5 px-3 font-mono font-semibold text-zinc-300">
                        {order.orderNumber}
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-3 text-zinc-300 font-medium">{totalItems}</td>

                      {/* Total */}
                      <td className="py-3.5 px-3 font-semibold text-white whitespace-nowrap">
                        <AnimatedPrice amountUSD={order.total} />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <StatusBadge status={order.status} type="order" />
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${order.paymentStatus === 'Paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                        {order.date}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 pr-5 text-right relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setActionDropdownOpenId(
                                actionDropdownOpenId === order.id ? null : order.id
                              )
                            }
                            className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <span>Actions</span>
                            <MoreHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                          </button>

                          {actionDropdownOpenId === order.id && (
                            <div className="absolute right-5 mt-1 w-44 rounded-xl bg-[#141414] border border-white/[0.1] shadow-2xl py-1 z-30 backdrop-blur-md">
                              <button
                                onClick={() => {
                                  setViewingOrder(order);
                                  setActionDropdownOpenId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-left text-zinc-300 hover:bg-white/[0.05] hover:text-white flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Order Details & Profit</span>
                              </button>

                              <button
                                onClick={() => {
                                  updateOrderStatus(order.id, 'Processing');
                                  setActionDropdownOpenId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-left text-blue-400 hover:bg-blue-500/10 flex items-center gap-2"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Mark Processing</span>
                              </button>

                              <button
                                onClick={() => {
                                  updateOrderStatus(order.id, 'Delivered');
                                  setActionDropdownOpenId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-left text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Mark Delivered</span>
                              </button>
                              <button
                                onClick={() => {
                                  updatePaymentStatus(order.id, 'Paid');
                                  setActionDropdownOpenId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-left text-sky-400 hover:bg-sky-500/10 flex items-center gap-2"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>Mark Paid</span>
                              </button>
                              <button
                                onClick={() => {
                                  setCancelConfirmId(order.id);
                                  setActionDropdownOpenId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Cancel Order</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Modal With Profit Calculation (Section 20 requirement) */}
      <Modal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        title={viewingOrder ? `Order Details: ${viewingOrder.orderNumber}` : ''}
        subtitle="Full item breakdown, logistics, customer info, and net order profit"
        maxWidth="2xl"
      >
        {viewingOrder && (
          <div className="space-y-5">
            {/* Customer & Address Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#161616] border border-white/[0.06]">
              <div>
                <span className="text-[11px] uppercase font-bold text-zinc-400 block mb-1">
                  Customer Information
                </span>
                <p className="text-sm font-bold text-white">{viewingOrder.customer.name}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                  <Mail className="w-3 h-3 text-zinc-500" />
                  <span>{viewingOrder.customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                  <Phone className="w-3 h-3 text-zinc-500" />
                  <span>{viewingOrder.customer.phone}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold text-zinc-400 block mb-1">
                  Shipping Address
                </span>
                <div className="flex items-start gap-2 text-xs text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 mt-0.5 shrink-0" />
                  <div>
                    <p>{viewingOrder.customer.address}</p>
                    <p className="text-zinc-500 mt-0.5">
                      {viewingOrder.customer.city}, {viewingOrder.customer.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items with Selling vs Cost Price breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                Purchased Products & Unit Margins
              </h4>
              <div className="border border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-white/[0.04]">
                {viewingOrder.items.map((item, idx) => {
                  const itemGrossProfit = (item.sellingPrice - item.costPrice) * item.quantity;

                  return (
                    <div
                      key={idx}
                      className="p-3 bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-10 h-10 rounded-xl object-cover border border-white/[0.08]"
                        />
                        <div>
                          <p className="font-semibold text-white">{item.productName}</p>
                          <p className="text-[11px] text-zinc-500 font-mono">{item.sku}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 text-right">
                        <div>
                          <span className="text-[10px] text-zinc-500 block">Unit Cost / Price</span>
                          <span className="text-zinc-400">
                            {format(item.costPrice)} / <span className="text-white font-semibold">{format(item.sellingPrice)}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-zinc-500 block">Quantity</span>
                          <span className="font-bold text-white">× {item.quantity}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-zinc-500 block">Gross Profit</span>
                          <span className="font-bold text-emerald-400">
                            +{format(itemGrossProfit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comprehensive Financial Breakdown Box (Section 20 requirement) */}
            {(() => {
              const profitData = calculateOrderProfit(viewingOrder);

              return (
                <div className="p-4 rounded-2xl bg-[#141414] border border-orange-500/20 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>Order Profit & Loss Breakdown ({currency})</span>
                    </span>
                    <span className="text-xs font-semibold text-zinc-300">
                      Payment: {viewingOrder.paymentMethod}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Subtotal (Selling)</span>
                      <span className="font-semibold text-white">{format(viewingOrder.subtotal)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 block">Product Cost (COGS)</span>
                      <span className="font-semibold text-zinc-300">{format(profitData.totalCost)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 block">Delivery Charges</span>
                      <span className="font-semibold text-zinc-300">{format(viewingOrder.deliveryCharges)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 block">Discount / Refund</span>
                      <span className="font-semibold text-rose-400">
                        -{format(viewingOrder.discount + viewingOrder.refund)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/[0.06]">
                    <div className="p-2.5 rounded-xl bg-[#181818] border border-white/[0.04]">
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                        Order Total
                      </span>
                      <span className="text-base font-extrabold text-white">
                        {format(viewingOrder.total)}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#181818] border border-white/[0.04]">
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                        Gross Profit
                      </span>
                      <span className="text-base font-extrabold text-emerald-400">
                        {format(profitData.grossProfit)}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                      <span className="text-[10px] uppercase font-semibold text-orange-400 block">
                        Net Order Profit
                      </span>
                      <span className="text-base font-extrabold text-orange-400">
                        {format(profitData.netProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Order Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Order Timeline
              </h4>
              <div className="space-y-2">
                {viewingOrder.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${event.completed ? 'bg-orange-500 shadow-sm shadow-orange-500/50' : 'bg-zinc-700'
                        }`}
                    />
                    <span className="font-medium text-zinc-200">{event.title}</span>
                    <span className="text-zinc-500 text-[11px] ml-auto">{event.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Order Confirm */}
      <ConfirmDialog
        isOpen={!!cancelConfirmId}
        onClose={() => setCancelConfirmId(null)}
        onConfirm={() => {
          if (cancelConfirmId) {
            cancelOrder(cancelConfirmId);
            setCancelConfirmId(null);
          }
        }}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? It will update the status to Cancelled and mark any refund required."
      />
    </div>
  );
};
