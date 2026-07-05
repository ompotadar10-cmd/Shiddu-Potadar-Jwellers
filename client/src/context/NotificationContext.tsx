import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showSuccess = (message: string) => addNotification('success', message);
  const showError = (message: string) => addNotification('error', message);
  const showInfo = (message: string) => addNotification('info', message);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      
      {/* Toast Portal/Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`p-4 rounded-lg shadow-xl border flex items-start gap-3 pointer-events-auto backdrop-blur-md ${
                notification.type === 'success'
                  ? 'bg-green-50/95 border-green-200 text-green-800'
                  : notification.type === 'error'
                  ? 'bg-red-50/95 border-red-200 text-red-800'
                  : 'bg-gold-50/95 border-gold-200 text-gold-800'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {notification.type === 'success' && <FiCheckCircle className="w-5 h-5 text-green-600" />}
                {notification.type === 'error' && <FiAlertCircle className="w-5 h-5 text-red-600" />}
                {notification.type === 'info' && <FiInfo className="w-5 h-5 text-gold-600" />}
              </div>
              <div className="flex-1 text-sm font-medium pr-2">
                {notification.message}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
