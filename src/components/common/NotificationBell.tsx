import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  CheckCheck,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PackageX,
  UserPlus,
  CreditCard,
  Trash2,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationItem, NotificationType } from '../../types';

interface NotificationBellProps {
  id?: string;
  compact?: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  id = 'header-notification-bell',
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();

  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_order':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
            <ShoppingCart className="w-4 h-4" />
          </div>
        );
      case 'order_delivered':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'order_cancelled':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400 shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
        );
      case 'low_stock':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case 'out_of_stock':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400 shrink-0">
            <PackageX className="w-4 h-4" />
          </div>
        );
      case 'new_customer':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
            <UserPlus className="w-4 h-4" />
          </div>
        );
      case 'payment_received':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Notification Bell Trigger Button */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Notifications (${unreadCount} unread)`}
        className={`relative flex items-center justify-center rounded-xl border transition-all shadow-sm cursor-pointer select-none ${
          compact ? 'w-9 h-9' : 'w-9 h-9 md:w-10 md:h-10'
        } ${
          isOpen
            ? 'bg-zinc-800 border-zinc-700 text-white ring-1 ring-orange-500/40'
            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800 hover:border-zinc-700'
        }`}
      >
        <Bell className="w-4 h-4" />

        {/* Dynamic Unread Badge - Only shown when unreadCount > 0 */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-orange-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.7)] ring-2 ring-zinc-950 animate-in fade-in zoom-in duration-200">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -5 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute right-0 top-[calc(100%+6px)] z-50 w-80 sm:w-96 max-w-[calc(100vw-24px)] rounded-2xl bg-zinc-900/98 backdrop-blur-xl border border-zinc-800/90 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.85),0_0_20px_rgba(249,115,22,0.06)] overflow-hidden"
          >
            {/* Top orange gradient hairline */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

            {/* Header: Title, Unread Count & Mark All As Read */}
            <div className="px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              {unreadCount > 0 ? (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs font-medium text-orange-400 hover:text-orange-300 hover:underline transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all as read</span>
                </button>
              ) : (
                <span className="text-xs text-zinc-500 font-medium">All caught up</span>
              )}
            </div>

            {/* Notification Items List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-zinc-800/60 scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  No notifications to display
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!item.read) markAsRead(item.id);
                    }}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group relative ${
                      !item.read
                        ? 'bg-orange-500/[0.06] hover:bg-orange-500/[0.1]'
                        : 'hover:bg-zinc-800/50'
                    }`}
                  >
                    {/* Icon */}
                    {getNotificationIcon(item.type)}

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-semibold block truncate ${
                            !item.read ? 'text-white' : 'text-zinc-300'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-zinc-500 font-medium">{item.time}</span>
                        {item.orderNumber && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 font-mono">
                            {item.orderNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Unread dot indicator & Quick dismiss */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {!item.read && (
                        <span
                          className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.8)]"
                          title="Unread notification"
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
                        title="Dismiss notification"
                        aria-label="Dismiss notification"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="px-4 py-2.5 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Real-time store alerts</span>
              </div>
              <span className="text-zinc-500">{notifications.length} total</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
