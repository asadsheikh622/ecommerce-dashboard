import React, { useEffect, useState } from 'react';
import { getMonthlyGoal, updateMonthlyGoal } from '../services/settingsApi';
import { Header } from '../components/common/Header';
import { useCurrency } from '../context/CurrencyContext';
import { useStore } from '../context/StoreContext';
import {
  Coins,
  Shield,
  Bell,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

export const SettingsPage: React.FC<{ onMobileMenuToggle: () => void }> = ({ onMobileMenuToggle }) => {
  const { currency, setCurrency, exchangeRate, setExchangeRate } = useCurrency();
  const { resetDemoData, addToast } = useStore();

  const [localRate, setLocalRate] = useState(exchangeRate.toString());
  const [monthlyGoal, setMonthlyGoal] = useState('1000000');
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyStock, setNotifyStock] = useState(true);
  const [notifyDaily, setNotifyDaily] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  useEffect(() => {
    const loadMonthlyGoal = async () => {
      try {
        const goal = await getMonthlyGoal();
        setMonthlyGoal(String(goal));
      } catch (error) {
        console.error("Failed to load monthly goal:", error);
      }
    };

    loadMonthlyGoal();
  }, []);

  const handleSaveMonthlyGoal = async () => {
    try {
      const goal = Number(monthlyGoal);

      if (!Number.isFinite(goal) || goal <= 0) {
        alert("Please enter a valid monthly goal");
        return;
      }

      await updateMonthlyGoal(goal);
      alert("Monthly goal saved successfully!");
    } catch (error) {
      console.error("Failed to save monthly goal:", error);
      alert("Failed to save monthly goal");
    }
  };

  const handleSaveCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(localRate);
    if (rateNum > 0) {
      setExchangeRate(rateNum);
      addToast('success', `Exchange rate set to 1 USD = ${rateNum} PKR`);
    } else {
      addToast('error', 'Please enter a valid positive exchange rate');
    }
  };

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Settings' }]}
        title="Settings & Preferences"
        subtitle="Manage store currency, live exchange rates, notifications and security"
        onMobileMenuToggle={onMobileMenuToggle}
      />

      <div className="max-w-4xl space-y-6">
        {/* Currency & Exchange Rate Card in Bento Grid */}
        <div className="rounded-[2rem] bg-zinc-900 border border-zinc-800 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Currency & Localization
              </span>
              <h3 className="text-base font-bold text-white">Multi-Currency & Conversion Engine</h3>
            </div>
          </div>

          <form onSubmit={handleSaveCurrency} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Default Display Currency
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrency('PKR')}
                    className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${currency === 'PKR'
                      ? 'bg-white text-zinc-950 border-white shadow-md'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                      }`}
                  >
                    PKR (₨)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${currency === 'USD'
                      ? 'bg-white text-zinc-950 border-white shadow-md'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                      }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Exchange Rate (1 USD = ? PKR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-mono text-zinc-500">₨</span>
                  <input
                    type="number"
                    step="any"
                    value={localRate}
                    onChange={(e) => setLocalRate(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono font-bold"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Current rate: 1 USD = {exchangeRate} PKR
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-950 bg-white hover:bg-zinc-200 rounded-xl shadow-md cursor-pointer transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Apply Exchange Rate</span>
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Monthly Revenue Goal</h3>
              <p className="text-sm text-gray-500">
                Set your monthly sales target in PKR
              </p>
            </div>
          </div>

          <label className="block text-sm font-medium mb-2">
            Monthly Target (PKR)
          </label>

          <input
            type="number"
            min="1"
            value={monthlyGoal}
            onChange={(e) => setMonthlyGoal(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3 outline-none"
            placeholder="Enter monthly target"
          />

          <button
            type="button"
            onClick={handleSaveMonthlyGoal}
            className="mt-4 px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Save Monthly Goal
          </button>
        </div>

        {/* Notification Settings */}
        <div className="rounded-[2rem] bg-zinc-900 border border-zinc-800 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Preferences
              </span>
              <h3 className="text-base font-bold text-white">Alerts & Notifications</h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-zinc-800">
              <div>
                <p className="font-bold text-white">New Order Alerts</p>
                <p className="text-[11px] text-zinc-400">
                  Receive instant toast and email notification when a customer places an order
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyOrders}
                onChange={(e) => setNotifyOrders(e.target.checked)}
                className="w-4 h-4 accent-white rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-zinc-800">
              <div>
                <p className="font-bold text-white">Low Inventory Threshold Warning</p>
                <p className="text-[11px] text-zinc-400">
                  Alert when any product SKU drops below 10 units in stock
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyStock}
                onChange={(e) => setNotifyStock(e.target.checked)}
                className="w-4 h-4 accent-white rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-zinc-800">
              <div>
                <p className="font-bold text-white">Daily Financial Performance Digest</p>
                <p className="text-[11px] text-zinc-400">
                  Receive end-of-day summary of revenue, expenses, and net profit
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyDaily}
                onChange={(e) => setNotifyDaily(e.target.checked)}
                className="w-4 h-4 accent-white rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Security & Admin Access */}
        <div className="rounded-[2rem] bg-zinc-900 border border-zinc-800 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Access
              </span>
              <h3 className="text-base font-bold text-white">Security & Access Control</h3>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-zinc-800 text-xs">
            <div>
              <p className="font-bold text-white">Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-zinc-400">Require authenticator passkey on login</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={(e) => setTwoFactor(e.target.checked)}
              className="w-4 h-4 accent-white rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Reset Store Data */}
        <div className="rounded-[2rem] bg-zinc-900 border border-rose-500/20 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Reset Store Mock Data</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Restore default benchmark products, orders, categories and expenses
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetDemoData();
                addToast('info', 'Demo data reset to benchmarks');
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 rounded-xl border border-rose-500/30 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
