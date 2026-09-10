import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext';
import { StoreProvider } from './context/StoreContext';
import { NotificationProvider } from './context/NotificationContext';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { OrdersPage } from './pages/OrdersPage';
import { UsersPage } from './pages/UsersPage';
import { ProfitLossPage } from './pages/ProfitLossPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { StorefrontPage } from './pages/StorefrontPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <ErrorBoundary>
      <CurrencyProvider>
        <StoreProvider>
          <NotificationProvider>
            <BrowserRouter>
          <div className="min-h-screen bg-[#090909] text-white flex">
            {/* Sidebar (Desktop fixed + Mobile slide-out drawer) */}
            <Sidebar
              mobileOpen={mobileMenuOpen}
              onCloseMobile={closeMobileMenu}
            />

            {/* Main View Area */}
            <div className="flex-1 flex flex-col min-h-screen lg:pl-64 transition-all duration-300">
              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                <Routes>
                  {/* Dashboard / Overview */}
                  <Route
                    path="/"
                    element={<OverviewPage onMobileMenuToggle={toggleMobileMenu} />}
                  />

                  {/* Products */}
                  <Route
                    path="/products/all"
                    element={<ProductsPage onMobileMenuToggle={toggleMobileMenu} />}
                  />
                  <Route
                    path="/products/deleted"
                    element={
                      <ProductsPage deletedOnly={true} onMobileMenuToggle={toggleMobileMenu} />
                    }
                  />

                  {/* Categories */}
                  <Route
                    path="/categories/all"
                    element={<CategoriesPage onMobileMenuToggle={toggleMobileMenu} />}
                  />
                  <Route
                    path="/categories/deleted"
                    element={
                      <CategoriesPage deletedOnly={true} onMobileMenuToggle={toggleMobileMenu} />
                    }
                  />

                  {/* Orders */}
                  <Route
                    path="/orders"
                    element={<OrdersPage onMobileMenuToggle={toggleMobileMenu} />}
                  />

                  {/* Users */}
                  <Route
                    path="/users/all"
                    element={<UsersPage onMobileMenuToggle={toggleMobileMenu} />}
                  />
                  <Route
                    path="/users/deleted"
                    element={
                      <UsersPage deletedOnly={true} onMobileMenuToggle={toggleMobileMenu} />
                    }
                  />

                  {/* Financials: Profit & Loss and Expenses */}
                  <Route
                    path="/profit-loss"
                    element={<ProfitLossPage onMobileMenuToggle={toggleMobileMenu} />}
                  />
                  <Route
                    path="/expenses"
                    element={<ExpensesPage onMobileMenuToggle={toggleMobileMenu} />}
                  />

                  {/* Storefront Buyer Preview & Settings */}
                  <Route
                    path="/storefront"
                    element={<StorefrontPage onMobileMenuToggle={toggleMobileMenu} />}
                  />

                  {/* Settings */}
                  <Route
                    path="/settings"
                    element={<SettingsPage onMobileMenuToggle={toggleMobileMenu} />}
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>

            {/* Global Toasts */}
            <ToastContainer />
          </div>
        </BrowserRouter>
          </NotificationProvider>
        </StoreProvider>
      </CurrencyProvider>
    </ErrorBoundary>
  );
}
