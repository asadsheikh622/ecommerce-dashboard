import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { NotificationItem } from '../types';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'new_order',
    title: 'New order received',
    description: 'Order #ORD-2026-1042 placed by Sophia Davis',
    time: '2 minutes ago',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    orderNumber: '#ORD-2026-1042',
  },
  {
    id: 'notif-2',
    type: 'low_stock',
    title: 'Low stock alert',
    description: 'Sony WH-1000XM5 is running low (3 units left)',
    time: '15 minutes ago',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    productId: 'prod-sony-wh',
  },
  {
    id: 'notif-3',
    type: 'payment_received',
    title: 'Payment received',
    description: 'Payment of $245.00 confirmed for #ORD-2026-1039',
    time: '45 minutes ago',
    read: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    orderNumber: '#ORD-2026-1039',
  },
  {
    id: 'notif-4',
    type: 'order_delivered',
    title: 'Order delivered',
    description: 'Order #ORD-2026-1031 has been delivered',
    time: '1 hour ago',
    read: true,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    orderNumber: '#ORD-2026-1031',
  },
  {
    id: 'notif-5',
    type: 'new_customer',
    title: 'New customer',
    description: 'Ayesha Malik registered a new customer account',
    time: '3 hours ago',
    read: true,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-6',
    type: 'order_cancelled',
    title: 'Order cancelled',
    description: 'Order #ORD-2026-1028 was cancelled by customer',
    time: '5 hours ago',
    read: true,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    orderNumber: '#ORD-2026-1028',
  },
  {
    id: 'notif-7',
    type: 'out_of_stock',
    title: 'Out of stock',
    description: 'Minimalist Leather Backpack reached 0 stock',
    time: 'Yesterday',
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    productId: 'prod-backpack',
  },
];

const STORAGE_KEY = 'dashboard_notifications_v1';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore JSON parse error
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
