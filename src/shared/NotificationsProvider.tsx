import { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from './hooks';

// Create a context for notifications
interface NotificationsContextType {
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => string;
  removeNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Provider component
interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
  const { addNotification, removeNotification } = useNotifications();

  return (
    <NotificationsContext.Provider value={{ addNotification, removeNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Hook to use the notifications context
export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }
  return context;
};