import api from './apiClient';

export interface Account {
  id: string;
  custodian_id: string;
  portfolio_id: string;
  account_id: string;
  name: string;
  account_type: string;
  currency: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAccountRequest {
  custodian_id: string;
  portfolio_id: string;
  account_id: string;
  name: string;
  account_type: string;
  currency: string;
  balance?: number;
}

const accountsApi = {
  getAccounts: (custodianId: string = '1', portfolioId?: string) => api.get<Account[]>(`/v1/custodian/${custodianId}/accounts${portfolioId ? `?portfolio_id=${portfolioId}` : ''}`),

  getAccount: (id: string, custodianId: string = '1') => api.get<Account>(`/v1/custodian/${custodianId}/accounts/${id}`),

  createAccount: (account: CreateAccountRequest, custodianId: string = '1') => api.post<Account>(`/v1/custodian/${custodianId}/accounts`, account),

  updateAccount: (id: string, account: Partial<Account>, custodianId: string = '1') => api.put<Account>(`/v1/custodian/${custodianId}/accounts/${id}`, account),

  deleteAccount: (id: string, custodianId: string = '1') => api.delete(`/v1/custodian/${custodianId}/accounts/${id}`)
};

export default accountsApi;
