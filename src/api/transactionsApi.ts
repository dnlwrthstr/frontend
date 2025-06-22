import api from './apiClient';

export type TransactionType = 'BUY' | 'SELL' | 'DIVIDEND' | 'FEE';

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  type: TransactionType;
  isin?: string;
  name?: string;
  quantity?: number;
  price?: number;
  amount: number;
  currency: string;
}

export interface TransactionFilter {
  accountId?: string;
  type?: TransactionType;
  fromDate?: string;
  toDate?: string;
  isin?: string;
}

const transactionsApi = {
  getTransactions: (filter?: TransactionFilter) => {
    let url = '/transactions';
    
    if (filter) {
      const params = new URLSearchParams();
      
      if (filter.accountId) params.append('accountId', filter.accountId);
      if (filter.type) params.append('type', filter.type);
      if (filter.fromDate) params.append('fromDate', filter.fromDate);
      if (filter.toDate) params.append('toDate', filter.toDate);
      if (filter.isin) params.append('isin', filter.isin);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return api.get<Transaction[]>(url);
  },
  
  getTransaction: (id: string) => api.get<Transaction>(`/transactions/${id}`),
  
  getAccountTransactions: (accountId: string) => api.get<Transaction[]>(`/accounts/${accountId}/transactions`)
};

export default transactionsApi;