import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for handling async operations with loading and error states
 * @param asyncFn The async function to execute
 * @param immediate Whether to execute the function immediately
 * @returns Object containing execute function, loading state, error state, and value
 */
export function useAsync<T, P extends any[]>(
  asyncFn: (...args: P) => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // The execute function wraps asyncFn and
  // handles setting state based on the promise result
  const execute = useCallback(
    async (...args: P) => {
      setStatus('pending');
      setValue(null);
      setError(null);

      try {
        const response = await asyncFn(...args);
        setValue(response);
        setStatus('success');
        return response;
      } catch (error) {
        setError(error as Error);
        setStatus('error');
        throw error;
      }
    },
    [asyncFn]
  );

  // Call execute if immediate is true
  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as P));
    }
  }, [execute, immediate]);

  return { execute, status, value, error, isLoading: status === 'pending' };
}

/**
 * Hook for handling notifications
 * @returns Object containing notifications array and functions to add and remove notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: number;
  }>>([]);

  const addNotification = useCallback(
    (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
      const id = Date.now().toString();
      setNotifications(prev => [
        ...prev,
        { id, message, type, timestamp: Date.now() }
      ]);
      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setNotifications(prev => 
        prev.filter(notification => now - notification.timestamp < 5000)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return { notifications, addNotification, removeNotification };
}
