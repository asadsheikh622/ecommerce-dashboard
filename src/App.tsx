
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { CurrencyProvider } from './context/CurrencyContext';
import { StoreProvider } from './context/StoreContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { OrdersPage } from './pages/OrdersPage';
import { UsersPage } from './pages/UsersPage';
import { ProfitLossPage } from './pages/ProfitLossPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { StorefrontPage } from './pages/StorefrontPage';
import { SettingsPage } from './pages/SettingsPage';

// Protect dashboard routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Login page route
const LoginRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />;
};

// Existing dashboard layout
const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex">
      {/* Sidebar */}
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

            {/* Financials */}
            <Route
              path="/profit-loss"
              element={<ProfitLossPage onMobileMenuToggle={toggleMobileMenu} />}
            />
            <Route
              path="/expenses"
              element={<ExpensesPage onMobileMenuToggle={toggleMobileMenu} />}
            />

            {/* Storefront */}
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
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CurrencyProvider>
          <StoreProvider>
            <NotificationProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Login Route */}
                  <Route path="/login" element={<LoginRoute />} />

                  {/* Protected Dashboard Routes */}
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </NotificationProvider>
          </StoreProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
