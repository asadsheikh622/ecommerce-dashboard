import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
            error: <AlertCircle className="w-4 h-4 text-rose-400" />,
            warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
            info: <Info className="w-4 h-4 text-sky-400" />,
          };

          const borders = {
            success: 'border-emerald-500/30 bg-[#121814]/95 shadow-emerald-500/10',
            error: 'border-rose-500/30 bg-[#181212]/95 shadow-rose-500/10',
            warning: 'border-amber-500/30 bg-[#181612]/95 shadow-amber-500/10',
            info: 'border-sky-500/30 bg-[#121518]/95 shadow-sky-500/10',
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-3.5 rounded-2xl border ${borders[toast.type]} shadow-xl backdrop-blur-md flex items-start justify-between gap-3`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">{icons[toast.type]}</div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{toast.title}</h4>
                  {toast.message && <p className="text-[11px] text-zinc-400 mt-0.5">{toast.message}</p>}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
