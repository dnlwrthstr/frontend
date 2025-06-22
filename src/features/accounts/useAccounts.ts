import { useState, useEffect } from 'react';
import accountsApi, { Account, CreateAccountRequest } from '../../api/accountsApi';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await accountsApi.getAccounts();
      setAccounts(data);
    } catch (err) {
      setError('Failed to fetch accounts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const createAccount = async (newAccount: CreateAccountRequest) => {
    try {
      const createdAccount = await accountsApi.createAccount(newAccount);
      setAccounts(prev => [...prev, createdAccount]);
      return createdAccount;
    } catch (err) {
      console.error('Failed to create account:', err);
      throw err;
    }
  };

  const updateAccount = async (id: string, accountData: Partial<Account>) => {
    try {
      const updatedAccount = await accountsApi.updateAccount(id, accountData);
      setAccounts(prev => prev.map(account => account.id === id ? updatedAccount : account));
      return updatedAccount;
    } catch (err) {
      console.error('Failed to update account:', err);
      throw err;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await accountsApi.deleteAccount(id);
      setAccounts(prev => prev.filter(account => account.id !== id));
    } catch (err) {
      console.error('Failed to delete account:', err);
      throw err;
    }
  };

  return { 
    accounts, 
    isLoading, 
    error, 
    createAccount,
    updateAccount,
    deleteAccount,
    refreshAccounts: fetchAccounts
  };
};

export default useAccounts;