import React, { useState, useMemo } from 'react';
import { Header } from '../components/common/Header';
import { TopStatStrip, TopStatItem } from '../components/common/TopStatStrip';
import { FilterBar } from '../components/common/FilterBar';
import { AnimatedPrice } from '../components/common/AnimatedPrice';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useStore } from '../context/StoreContext';
import { useCurrency } from '../context/CurrencyContext';
import { Expense } from '../types';
import {
  Receipt,
  Megaphone,
  Truck,
  Users,
  Server,
  Plus,
  Search,
  Trash2,
  Calendar,
  RotateCw,
} from 'lucide-react';

export const ExpensesPage: React.FC<{ onMobileMenuToggle: () => void }> = ({ onMobileMenuToggle }) => {
  const { expenses, addExpense, deleteExpense, addToast } = useStore();
  const { currency, symbol, convertToBase, convertFromBase } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Expense['category']>('Marketing');
  const [formAmount, setFormAmount] = useState(currency === 'PKR' ? '14000' : '50');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formRecurring, setFormRecurring] = useState(false);
  const [formNotes, setFormNotes] = useState('');

  // Filtered
  const visibleExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const titleStr = (e.name || e.title || '').toLowerCase();
        const notesStr = (e.notes || e.description || '').toLowerCase();
        if (!titleStr.includes(term) && !notesStr.includes(term)) {
          return false;
        }
      }
      if (categoryFilter !== 'All' && e.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [expenses, searchTerm, categoryFilter]);

  // Statistics
  const totalExpensesUSD = expenses.reduce((sum, e) => sum + e.amount, 0);
  const marketingUSD = expenses.filter((e) => e.category === 'Marketing').reduce((sum, e) => sum + e.amount, 0);
  const shippingUSD = expenses.filter((e) => e.category === 'Shipping' || e.category === 'Packaging').reduce((sum, e) => sum + e.amount, 0);
  const salariesUSD = expenses.filter((e) => e.category === 'Salaries').reduce((sum, e) => sum + e.amount, 0);
  const softwareUSD = expenses.filter((e) => e.category === 'Software' || e.category === 'Rent').reduce((sum, e) => sum + e.amount, 0);

  const topStats: TopStatItem[] = [
    {
      id: 'total',
      label: 'Total Expenses',
      value: <AnimatedPrice amountUSD={totalExpensesUSD} />,
      icon: <Receipt className="w-4 h-4" />,
      color: 'red',
    },
    {
      id: 'marketing',
      label: 'Marketing & Ads',
      value: <AnimatedPrice amountUSD={marketingUSD} />,
      icon: <Megaphone className="w-4 h-4" />,
      color: 'orange',
    },
    {
      id: 'shipping',
      label: 'Courier & Packing',
      value: <AnimatedPrice amountUSD={shippingUSD} />,
      icon: <Truck className="w-4 h-4" />,
      color: 'blue',
    },
    {
      id: 'salaries',
      label: 'Staff & Salaries',
      value: <AnimatedPrice amountUSD={salariesUSD} />,
      icon: <Users className="w-4 h-4" />,
      color: 'green',
    },
    {
      id: 'software',
      label: 'Tools & Utilities',
      value: <AnimatedPrice amountUSD={softwareUSD} />,
      icon: <Server className="w-4 h-4" />,
      color: 'yellow',
    },
  ];

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      addToast('error', 'Title is required');
      return;
    }

    const enteredAmount = parseFloat(formAmount) || 0;
    const amountUSD = convertToBase(enteredAmount);

    addExpense({
      name: formTitle,
      title: formTitle,
      category: formCategory,
      amount: amountUSD,
      date: formDate,
      description: formNotes || formTitle,
      paymentMethod: 'Cash / Transfer',
      recurring: formRecurring,
      notes: formNotes,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Expenses' }]}
        title="Store Expenses"
        subtitle="Track operating costs, marketing, salaries and logistics"
        actionButton={
          <button
            id="add-expense-btn"
            type="button"
            onClick={() => {
              setFormTitle('');
              setFormCategory('Marketing');
              setFormAmount(currency === 'PKR' ? '14000' : '50');
              setFormDate(new Date().toISOString().split('T')[0]);
              setFormRecurring(false);
              setFormNotes('');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold text-zinc-950 bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        }
        onMobileMenuToggle={onMobileMenuToggle}
      />

      {/* Top 5 Metric Cards in Bento Strip */}
      <TopStatStrip items={topStats} />

      {/* Filter Bar */}
      <FilterBar onReset={() => { setSearchTerm(''); setCategoryFilter('All'); }}>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Search</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="All">All categories</option>
            <option value="Marketing">Marketing</option>
            <option value="Shipping">Shipping</option>
            <option value="Packaging">Packaging</option>
            <option value="Salaries">Salaries</option>
            <option value="Software">Software</option>
            <option value="Rent">Rent</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </FilterBar>

      {/* Expenses Table - Bento Container */}
      <div className="rounded-[2rem] bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                <th className="py-3.5 pl-5">Expense Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Amount ({currency})</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Recurring</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {visibleExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                    <p className="text-sm">No expenses recorded</p>
                  </td>
                </tr>
              ) : (
                visibleExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 pl-5 font-semibold text-white group-hover:text-orange-400 transition-colors">
                      {expense.name || expense.title}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-white/[0.06]">
                        {expense.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-rose-400 whitespace-nowrap">
                      -<AnimatedPrice amountUSD={expense.amount} />
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                      {expense.date}
                    </td>

                    <td className="py-3.5 px-4">
                      {expense.recurring ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-orange-400 font-medium">
                          <RotateCw className="w-3 h-3" />
                          <span>Monthly</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-500">One-time</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate">
                      {expense.notes || '—'}
                    </td>

                    <td className="py-3.5 pr-5 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(expense.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Operating Expense"
        subtitle="Log operational overheads to accurately deduct from Net Profit"
        maxWidth="md"
      >
        <form onSubmit={handleSaveExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Expense Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Meta Ads Campaign - Fall Launch"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as Expense['category'])}
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
              >
                <option value="Marketing">Marketing</option>
                <option value="Shipping">Shipping</option>
                <option value="Packaging">Packaging</option>
                <option value="Salaries">Salaries</option>
                <option value="Software">Software</option>
                <option value="Rent">Rent</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Amount ({symbol})
              </label>
              <input
                type="number"
                step="any"
                required
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Date</label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Internal Notes
            </label>
            <textarea
              rows={2}
              placeholder="Invoice ID, payment receipt info..."
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full bg-[#171717] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formRecurring}
                onChange={(e) => setFormRecurring(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
              <span className="ml-2.5 text-xs font-medium text-zinc-300">
                Recurring Monthly Expense
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.05] rounded-xl border border-white/[0.08]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              Log Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Expense Confirm */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteExpense(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete Expense"
        message="Are you sure you want to remove this expense record? Net profit will update accordingly."
      />
    </div>
  );
};
