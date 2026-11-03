import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getMonthlyGoal } from '../services/settingsApi';
import { getVisitors } from '../services/visitorApi';
import {
  updateOrderStatusApi,
  updatePaymentStatusApi,
} from '../services/orderApi';
import {
  Category,
  DateRangeState,
  Expense,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  StorefrontConfig,
  ToastMessage,
  User,
} from '../types';
import { getPresetRange } from '../utils/dateUtils';
import { computeMetricsForRange, DateRangeStats } from '../utils/dashboardMetrics';
import {
  INITIAL_CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_STOREFRONT,
  INITIAL_USERS,
} from '../data/mockData';
import {
  getAdminProducts,
  createProduct,
  editProduct,
  removeProduct,
  restoreProductApi,
} from '../services/productApi';
import { getAdminOrders } from '../services/orderApi';
interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: User[];
  expenses: Expense[];
  storefront: StorefrontConfig;
  storefrontConfig: StorefrontConfig;
  toasts: ToastMessage[];

  // Global Date Filter State
  selectedDateRange: DateRangeState;
  setSelectedDateRange: (range: DateRangeState) => void;
  dateRange: DateRangeState;
  setDateRange: (range: DateRangeState) => void;
  dateRangeStats: DateRangeStats;

  // Product actions
addProduct: (product: Omit<Product, 'id' | 'lastUpdated'>) => Promise<void>;
updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
deleteProduct: (id: string) => Promise<void>;
restoreProduct: (id: string) => Promise<void>;

  // Category actions
  addCategory: (category: Omit<Category, 'id' | 'productsCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  restoreCategory: (id: string) => void;

  // Order actions
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
updatePaymentStatus: (id: string, status: PaymentStatus) => Promise<void>;
  cancelOrder: (id: string) => void;

  // User actions
  addUser: (user: Omit<User, 'id' | 'joinedDate' | 'totalOrders' | 'totalSpent'>) => void;
  toggleUserVerification: (id: string) => void;
  deleteUser: (id: string) => void;
  restoreUser: (id: string) => void;

  // Expense actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  // Storefront actions
  updateStorefront: (updates: Partial<StorefrontConfig>) => void;
  updateStorefrontConfig: (updates: Partial<StorefrontConfig>) => void;

  // System actions
  resetDemoData: () => void;

  // Toast actions
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;

  // Aggregate stats (All base in USD)
  stats: {
    totalRevenue: number;
    totalProfit: number;
    totalOrdersCount: number;
    avgOrderValue: number;
    revenueGrowth: number;
    profitGrowth: number;
    customerGrowth: number;
    weeklyVisitors: string;
    totalSalesWeek: number;
    profitMargin: number;
    totalProductCost: number;
    grossProfit: number;
    totalExpenses: number;
    totalRefunds: number;
    netProfit: number;
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states or localStorage safely
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('store_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('store_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_CATEGORIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('store_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('store_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_USERS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem('store_expenses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_EXPENSES;
  });

  const [monthlyGoal, setMonthlyGoal] = useState(1000000);
  const [visitors, setVisitors] = useState<any[]>([]);
  useEffect(() => {
  const loadGoal = async () => {
    try {
      const goal = await getMonthlyGoal();
      setMonthlyGoal(Number(goal));
    } catch (error) {
      console.error("Failed to load monthly goal:", error);
    }
  };

  loadGoal();
}, []);

useEffect(() => {
  const loadVisitors = async () => {
    try {
      const data = await getVisitors();
      setVisitors(data);
    } catch (error) {
      console.error("Failed to load visitors:", error);
    }
  };

  loadVisitors();
}, []);

  const [storefront, setStorefront] = useState<StorefrontConfig>(() => {
    try {
      const saved = localStorage.getItem('store_storefront');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.storeName) {
          return { ...INITIAL_STOREFRONT, ...parsed };
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_STOREFRONT;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Global Date Filter state
  const initialDateRange = useMemo<DateRangeState>(() => {
    const preset = getPresetRange('thisMonth');
    return {
      preset: 'thisMonth',
      startDate: preset.start.toISOString(),
      endDate: preset.end.toISOString(),
      label: 'This Month',
    };
  }, []);

  const [dateRange, setDateRangeState] = useState<DateRangeState>(() => {
    try {
      const saved = localStorage.getItem('store_date_range');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.preset && parsed.startDate && parsed.endDate) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return initialDateRange;
  });

  useEffect(() => {
    try {
      localStorage.setItem('store_date_range', JSON.stringify(dateRange));
    } catch {
      // ignore
    }
  }, [dateRange]);

  const setDateRange = (newRange: DateRangeState) => {
    setDateRangeState(newRange);
    addToast('info', 'Date filter applied', `Dashboard updated for ${newRange.label}`);
  };

// Load products from MongoDB
useEffect(() => {
  const loadProducts = async () => {
    try {
      const data = await getAdminProducts();
      setProducts(data);
    } catch (error) {
      addToast(
        'error',
        'Products loading failed',
        error instanceof Error ? error.message : 'Unable to load products'
      );
    }
  };

  loadProducts();
}, []);

// Load orders from MongoDB
useEffect(() => {
  const loadOrders = async () => {
    try {
      const data = await getAdminOrders();

      const mappedOrders: Order[] = data.map((o: any) => ({
        id: o._id,
        orderNumber: o.orderId,
        visitorId: o.visitorId,
        customer: {
          name: o.customer.fullName,
          email: o.customer.email,
          phone: o.customer.phone,
          address: o.shipping.address,
          city: o.shipping.city,
          country: o.shipping.province,
        },
        items: o.items.map((item: any) => ({
          productId: item.id,
          productName: item.product?.name || 'Product',
          sku: item.product?.sku || '',
          image: item.product?.images?.[0] || item.product?.image || '',
          quantity: item.quantity,
          sellingPrice: item.price,
          costPrice: item.product?.costPrice || 0,
        })),
        subtotal: o.subtotal,
        deliveryCharges: o.deliveryFee,
        discount: o.discountAmount,
        refund: 0,
        total: o.total,
        status: (o.orderStatus || 'pending').charAt(0).toUpperCase() +
          (o.orderStatus || 'pending').slice(1),
        paymentStatus: (o.paymentStatus || 'unpaid').charAt(0).toUpperCase() +
          (o.paymentStatus || 'unpaid').slice(1),
        paymentMethod: o.paymentMethod,
        date: o.createdAt,
        timeline: [],
      }));

      setOrders(mappedOrders);
    } catch (error) {
      addToast(
        'error',
        'Orders loading failed',
        error instanceof Error ? error.message : 'Unable to load orders'
      );
    }
  };

  loadOrders();
}, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('store_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('store_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('store_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('store_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('store_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('store_storefront', JSON.stringify(storefront));
  }, [storefront]);

  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  
  // Product handlers
  const addProduct = async (
    productData: Omit<Product, 'id' | 'lastUpdated'>
  ): Promise<void> => {
    try {
      const newProduct = await createProduct(productData);
      setProducts((prev) => [newProduct, ...prev]);
      addToast('success', 'Product created successfully', `${newProduct.name} added to inventory.`);
    } catch (error) {
      addToast('error', 'Product creation failed', error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const updateProduct = async (
    id: string,
    updates: Partial<Product>
  ): Promise<void> => {
    try {
      const updatedProduct = await editProduct(id, updates);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );
      addToast('success', 'Product updated successfully');
    } catch (error) {
      addToast('error', 'Product update failed', error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await removeProduct(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isDeleted: true } : p))
      );
      addToast('info', 'Product moved to deleted archive');
    } catch (error) {
      addToast('error', 'Product deletion failed', error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const restoreProduct = async (id: string): Promise<void> => {
    try {
      const restoredProduct = await restoreProductApi(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? restoredProduct : p))
      );
      addToast('success', 'Product restored successfully');
    } catch (error) {
      addToast('error', 'Product restore failed', error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  // Category handlers
  const addCategory = (categoryData: Omit<Category, 'id' | 'productsCount'>) => {
    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      productsCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    addToast('success', 'Category added successfully');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    addToast('success', 'Category updated successfully');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, isDeleted: true } : c)));
    addToast('info', 'Category moved to deleted archive');
  };

  const restoreCategory = (id: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, isDeleted: false } : c)));
    addToast('success', 'Category restored successfully');
  };
 
  // Order handlers
  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatusApi(id, status);

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === id) {
            return {
              ...o,
              status,
              timeline: [
                ...o.timeline,
                {
                  title: `Status changed to ${status}`,
                  time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                  completed: true,
                },
              ],
            };
          }
          return o;
        })
      );

      addToast('success', 'Order status updated', `Order status changed to ${status}`);
    } catch (error) {
      addToast(
        'error',
        'Order status update failed',
        error instanceof Error ? error.message : 'Something went wrong'
      );
    }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: PaymentStatus) => {
    try {
      await updatePaymentStatusApi(id, paymentStatus);

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, paymentStatus } : o))
      );

      addToast('success', 'Payment status updated', `Payment marked as ${paymentStatus}`);
    } catch (error) {
      addToast(
        'error',
        'Payment status update failed',
        error instanceof Error ? error.message : 'Something went wrong'
      );
    }
  };

  const cancelOrder = (id: string) => {
    updateOrderStatus(id, 'Cancelled');
  };

  // User handlers
  const addUser = (userData: Omit<User, 'id' | 'joinedDate' | 'totalOrders' | 'totalSpent'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }),
      totalOrders: 0,
      totalSpent: 0,
    };
    setUsers((prev) => [newUser, ...prev]);
    addToast('success', 'User created successfully');
  };

  const toggleUserVerification = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus: User['status'] = u.status === 'Verified' ? 'Unverified' : 'Verified';
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
    addToast('success', 'User verification updated');
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isDeleted: true } : u)));
    addToast('info', 'User moved to deleted');
  };

  const restoreUser = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isDeleted: false } : u)));
    addToast('success', 'User restored');
  };

  // Expense handlers
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
    addToast('success', 'Expense added successfully');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    addToast('info', 'Expense deleted');
  };

  // Storefront handlers
  const updateStorefront = (updates: Partial<StorefrontConfig>) => {
    setStorefront((prev) => ({ ...prev, ...updates }));
    addToast('success', 'Storefront updated successfully');
  };

  // Reset all data to benchmark values
  const resetDemoData = () => {
    try {
      localStorage.removeItem('store_products');
      localStorage.removeItem('store_categories');
      localStorage.removeItem('store_orders');
      localStorage.removeItem('store_users');
      localStorage.removeItem('store_expenses');
      localStorage.removeItem('store_storefront');
    } catch {
      // ignore
    }

    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setUsers(INITIAL_USERS);
    setExpenses(INITIAL_EXPENSES);
    setStorefront(INITIAL_STOREFRONT);

    addToast('info', 'Store demo data restored to benchmarks');
  };

  // Compute dynamic date-dependent statistics and chart series based on selectedDateRange
  const dateRangeStats = useMemo(() => {
    return computeMetricsForRange(dateRange, expenses ,orders, products,monthlyGoal, visitors);
  }, [dateRange, expenses, orders, products, monthlyGoal, visitors]);

  // Aggregate stats conforming to existing interface while reflecting the active date filter
  const stats = useMemo(() => {
    return {
      totalRevenue: dateRangeStats.totalRevenue,
      totalProfit: dateRangeStats.totalProfit,
      totalOrdersCount: dateRangeStats.totalOrdersCount,
      avgOrderValue: dateRangeStats.avgOrderValue,
      revenueGrowth: dateRangeStats.revenueGrowth,
      profitGrowth: dateRangeStats.profitGrowth,
      customerGrowth: dateRangeStats.customerGrowth,
      weeklyVisitors: dateRangeStats.weeklyVisitors,
      totalSalesWeek: dateRangeStats.totalSalesWeek,
      profitMargin: dateRangeStats.profitMargin,
      totalProductCost: dateRangeStats.totalProductCost,
      grossProfit: dateRangeStats.grossProfit,
      totalExpenses: dateRangeStats.totalExpenses,
      totalRefunds: dateRangeStats.totalRefunds,
      netProfit: dateRangeStats.netProfit,
    };
  }, [dateRangeStats]);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        users,
        expenses,
        storefront,
        toasts,
        selectedDateRange: dateRange,
        setSelectedDateRange: setDateRange,
        dateRange,
        setDateRange,
        dateRangeStats,
        addProduct,
        updateProduct,
        deleteProduct,
        restoreProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        restoreCategory,
        updateOrderStatus,
        updatePaymentStatus,
        cancelOrder,
        addUser,
        toggleUserVerification,
        deleteUser,
        restoreUser,
        addExpense,
        deleteExpense,
        updateStorefront,
        storefrontConfig: storefront,
        updateStorefrontConfig: updateStorefront,
        resetDemoData,
        addToast,
        removeToast,
        stats,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
