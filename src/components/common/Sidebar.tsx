import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  LayoutGrid,
  ShoppingCart,
  Users,
  TrendingUp,
  Receipt,
  BarChart3,
  Store,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ArrowDownCircle,
  X,
  Boxes,
  Trash2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const location = useLocation();
  const { products, categories, orders, users, addToast } = useStore();
  const { logout } = useAuth();
  // Submenu toggle states
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    products: location.pathname.startsWith('/products'),
    categories: location.pathname.startsWith('/categories'),
    users: location.pathname.startsWith('/users'),
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeOrdersCount = orders.filter((o) => o.status === 'Processing' || o.status === 'Pending').length;

  const handleLogout = () => {
    logout();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      {/* Brand / Store Logo Header - Bento Style */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md">
            <div className="w-4 h-4 border-[3.5px] border-zinc-950 rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight uppercase text-white">ASAD'S DASHBOARD</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">PRODUCT MANEGER</p>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
        {/* MAIN */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Main
          </div>
          <div className="space-y-1">
            <NavLink
              to="/"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive || location.pathname === '/'
                  ? 'bg-zinc-800 border border-zinc-700 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </NavLink>
          </div>
        </div>

        {/* CATALOGUE */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Catalogue
          </div>
          <div className="space-y-1">
            {/* Products with Submenu */}
            <div>
              <button
                type="button"
                onClick={() => toggleSubmenu('products')}
                className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${location.pathname.startsWith('/products')
                    ? 'bg-orange-500/10 border border-orange-500/25 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Package
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${location.pathname.startsWith('/products')
                        ? 'text-orange-400'
                        : 'text-zinc-400 group-hover:text-orange-400'
                      }`}
                  />
                  <span className={location.pathname.startsWith('/products') ? 'text-white font-semibold' : ''}>
                    Products
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openSubmenus.products
                      ? 'rotate-0 text-orange-400'
                      : '-rotate-90 text-zinc-500'
                    }`}
                />
              </button>

              <AnimatePresence>
                {openSubmenus.products && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="relative ml-5 pl-4 mt-1 mb-1 space-y-1 overflow-hidden"
                  >
                    {/* Subtle Vertical Connector Tree Line */}
                    <div className="absolute left-1.5 top-0 bottom-2.5 w-[1.5px] bg-zinc-800/90 rounded-full" />

                    <NavLink
                      to="/products/all"
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `group/item relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                          ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400 font-semibold shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                        }`
                      }
                    >
                      {/* Connector Branch Tick */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-[1.5px] bg-zinc-800/90" />
                      <motion.div whileHover={{ x: 2 }} className="flex items-center gap-2.5 w-full">
                        <Boxes className="w-3.5 h-3.5 transition-colors group-hover/item:text-orange-400" />
                        <span>All</span>
                      </motion.div>
                    </NavLink>

                    <NavLink
                      to="/products/deleted"
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `group/item relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                          ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400 font-semibold shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                        }`
                      }
                    >
                      {/* Connector Branch Tick */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-[1.5px] bg-zinc-800/90" />
                      <motion.div whileHover={{ x: 2 }} className="flex items-center gap-2.5 w-full">
                        <Trash2 className="w-3.5 h-3.5 transition-colors group-hover/item:text-rose-400" />
                        <span>Deleted</span>
                      </motion.div>
                    </NavLink>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Categories with Submenu */}
            <div>
              <button
                type="button"
                onClick={() => toggleSubmenu('categories')}
                className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${location.pathname.startsWith('/categories')
                    ? 'bg-orange-500/10 border border-orange-500/25 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${location.pathname.startsWith('/categories')
                        ? 'text-orange-400'
                        : 'text-zinc-400 group-hover:text-orange-400'
                      }`}
                  />
                  <span className={location.pathname.startsWith('/categories') ? 'text-white font-semibold' : ''}>
                    Categories
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openSubmenus.categories
                      ? 'rotate-0 text-orange-400'
                      : '-rotate-90 text-zinc-500'
                    }`}
                />
              </button>

              <AnimatePresence>
                {openSubmenus.categories && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="relative ml-5 pl-4 mt-1 mb-1 space-y-1 overflow-hidden"
                  >
                    {/* Subtle Vertical Connector Tree Line */}
                    <div className="absolute left-1.5 top-0 bottom-2.5 w-[1.5px] bg-zinc-800/90 rounded-full" />

                    <NavLink
                      to="/categories/all"
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `group/item relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                          ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400 font-semibold shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                        }`
                      }
                    >
                      {/* Connector Branch Tick */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-[1.5px] bg-zinc-800/90" />
                      <motion.div whileHover={{ x: 2 }} className="flex items-center gap-2.5 w-full">
                        <LayoutGrid className="w-3.5 h-3.5 transition-colors group-hover/item:text-orange-400" />
                        <span>All</span>
                      </motion.div>
                    </NavLink>

                    <NavLink
                      to="/categories/deleted"
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `group/item relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                          ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400 font-semibold shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                        }`
                      }
                    >
                      {/* Connector Branch Tick */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-[1.5px] bg-zinc-800/90" />
                      <motion.div whileHover={{ x: 2 }} className="flex items-center gap-2.5 w-full">
                        <Trash2 className="w-3.5 h-3.5 transition-colors group-hover/item:text-rose-400" />
                        <span>Deleted</span>
                      </motion.div>
                    </NavLink>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* SALES */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Sales
          </div>
          <div className="space-y-1">
            {/* Orders */}
            <NavLink
              to="/orders"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive
                  ? 'bg-zinc-800 border border-zinc-700 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4" />
                <span>Orders</span>
              </div>
              {activeOrdersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-emerald-400 border border-zinc-700">
                  {activeOrdersCount}
                </span>
              )}
            </NavLink>

            {/* Users with Submenu */}
            <div>
              <button
                type="button"
                onClick={() => toggleSubmenu('users')}
                className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${location.pathname.startsWith('/users')
                    ? 'bg-orange-500/10 border border-orange-500/25 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Users
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${location.pathname.startsWith('/users')
                        ? 'text-orange-400'
                        : 'text-zinc-400 group-hover:text-orange-400'
                      }`}
                  />
                  <span className={location.pathname.startsWith('/users') ? 'text-white font-semibold' : ''}>
                    Users
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openSubmenus.users
                      ? 'rotate-0 text-orange-400'
                      : '-rotate-90 text-zinc-500'
                    }`}
                />
              </button>

              <AnimatePresence>
                {openSubmenus.users && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="relative ml-5 pl-4 mt-1 mb-1 space-y-1 overflow-hidden"
                  >
                    {/* Subtle Vertical Connector Tree Line */}
                    <div className="absolute left-1.5 top-0 bottom-2.5 w-[1.5px] bg-zinc-800/90 rounded-full" />

                    <NavLink
                      to="/users/all"
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `group/item relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                          ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400 font-semibold shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                        }`
                      }
                    >
                      {/* Connector Branch Tick */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-[1.5px] bg-zinc-800/90" />
                      <motion.div whileHover={{ x: 2 }} className="flex items-center gap-2.5 w-full">
                        <Users className="w-3.5 h-3.5 transition-colors group-hover/item:text-orange-400" />
                        <span>All</span>
                      </motion.div>
                    </NavLink>

                    <NavLink
                      to="/users/deleted"
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `group/item relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                          ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400 font-semibold shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                        }`
                      }
                    >
                      {/* Connector Branch Tick */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-[1.5px] bg-zinc-800/90" />
                      <motion.div whileHover={{ x: 2 }} className="flex items-center gap-2.5 w-full">
                        <Trash2 className="w-3.5 h-3.5 transition-colors group-hover/item:text-rose-400" />
                        <span>Deleted</span>
                      </motion.div>
                    </NavLink>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* FINANCE */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Finance
          </div>
          <div className="space-y-1">
            <NavLink
              to="/profit-loss"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive
                  ? 'bg-zinc-800 border border-zinc-700 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4" />
                <span>Profit & Loss</span>
              </div>
            </NavLink>

            <NavLink
              to="/expenses"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive
                  ? 'bg-zinc-800 border border-zinc-700 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4" />
                <span>Expenses</span>
              </div>
            </NavLink>
          </div>
        </div>

        {/* STOREFRONT & SETTINGS */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Store & Config
          </div>
          <div className="space-y-1">

            <a
              href="https://2nd-ecommerce-assignment.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onCloseMobile}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4" />
                <span>Storefront</span>
              </div>
            </a>


            <NavLink
              to="/settings"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive
                  ? 'bg-zinc-800 border border-zinc-700 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
            </NavLink>
          </div>
        </div>
      </div>

      {/* User / Workspace Badge matching Bento design */}
      <div className="p-3 border-t border-zinc-800/80">
        <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
            <div>
              <div className="text-xs font-bold text-white">Alex Sterling</div>
              <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-semibold">Admin Workspace</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed left) */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 p-3 z-30">
        <div className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer with Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="lg:hidden fixed top-0 bottom-0 left-0 w-72 bg-zinc-950 border-r border-zinc-800 z-50 shadow-2xl p-2"
            >
              <div className="w-full h-full rounded-[1.8rem] overflow-hidden">
                {sidebarContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
