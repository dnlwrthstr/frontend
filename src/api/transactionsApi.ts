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
  // Additional fields from backend model
  transaction_id?: string;
  custodian_id?: string;
  portfolio_id?: string;
  security_id?: string;
  security_type?: string;
  trade_date?: string;
  settlement_date?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TransactionFilter {
  accountId?: string;
  portfolioId?: string;
  type?: TransactionType;
  fromDate?: string;
  toDate?: string;
  isin?: string;
  custodianId?: string;
}

const transactionsApi = {
  getTransactions: (filter?: TransactionFilter) => {
    const custodianId = filter?.custodianId || '1';
    let url = `/v1/custodian/${custodianId}/transactions`;

    if (filter) {
      const params = new URLSearchParams();

      if (filter.accountId) params.append('account_id', filter.accountId);
      if (filter.portfolioId) params.append('portfolio_id', filter.portfolioId);
      if (filter.type) params.append('type', filter.type);
      if (filter.fromDate) params.append('from_date', filter.fromDate);
      if (filter.toDate) params.append('to_date', filter.toDate);
      if (filter.isin) params.append('isin', filter.isin);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return api.get<Transaction[]>(url);
  },

  getTransaction: (id: string, custodianId: string = '1') => api.get<Transaction>(`/v1/custodian/${custodianId}/transactions/${id}`),

  getAccountTransactions: (accountId: string, custodianId: string = '1') => api.get<Transaction[]>(`/v1/custodian/${custodianId}/transactions?account_id=${accountId}`)
};

export default transactionsApi;
