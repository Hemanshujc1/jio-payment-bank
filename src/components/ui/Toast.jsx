import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { IoCheckmarkCircle, IoAlertCircle, IoInformationCircle, IoWarning } from 'react-icons/io5';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => showToast(msg, 'success', dur),
    error: (msg, dur) => showToast(msg, 'error', dur),
    info: (msg, dur) => showToast(msg, 'info', dur),
    warning: (msg, dur) => showToast(msg, 'warning', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            {...toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ message, type, duration, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <IoCheckmarkCircle className="text-green-500 text-xl" />,
    error: <IoAlertCircle className="text-red-500 text-xl" />,
    info: <IoInformationCircle className="text-blue-500 text-xl" />,
    warning: <IoWarning className="text-amber-500 text-xl" />,
  };

  const bgColors = {
    success: 'bg-green-50/90 border-green-200',
    error: 'bg-red-50/90 border-red-200',
    info: 'bg-blue-50/90 border-blue-200',
    warning: 'bg-amber-50/90 border-amber-200',
  };

  return (
    <div 
      onClick={onClose}
      className={`
        pointer-events-auto cursor-pointer
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md
        animate-in fade-in slide-in-from-top-4 duration-300
        max-w-md w-full sm:w-auto
        ${bgColors[type] || bgColors.info}
      `}
    >
      <div className="shrink-0">
        {icons[type] || icons.info}
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-snug">
        {message}
      </p>
      <button className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
        <span className="sr-only">Close</span>
        ✕
      </button>
    </div>
  );
};
