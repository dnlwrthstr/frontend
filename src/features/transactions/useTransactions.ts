import { useState, useEffect } from 'react';
import transactionsApi, { Transaction, TransactionFilter, TransactionType } from '../../api/transactionsApi';

export const useTransactions = (initialFilter?: TransactionFilter) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [apiFilter, setApiFilter] = useState<TransactionFilter | undefined>(initialFilter);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await transactionsApi.getTransactions(apiFilter);
        setTransactions(data);
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [apiFilter]);

  const handleFilterChange = (newFilter: TransactionType | 'ALL') => {
    setFilter(newFilter);
    if (newFilter !== 'ALL') {
      setApiFilter(prev => ({ ...prev, type: newFilter }));
    } else {
      setApiFilter(prev => {
        if (!prev) return undefined;
        const { type, ...rest } = prev;
        return Object.keys(rest).length > 0 ? rest : undefined;
      });
    }
  };

  return { 
    transactions, 
    isLoading, 
    error, 
    filter, 
    onFilterChange: handleFilterChange,
    setApiFilter
  };
};

export default useTransactions;