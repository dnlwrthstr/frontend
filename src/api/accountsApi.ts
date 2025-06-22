import api from './apiClient';

export interface Account {
  id: string;
  name: string;
  number: string;
  type: string;
  balance: number;
  currency: string;
}

export interface CreateAccountRequest {
  name: string;
  number: string;
  type: string;
}

const accountsApi = {
  getAccounts: () => api.get<Account[]>('/accounts'),
  
  getAccount: (id: string) => api.get<Account>(`/accounts/${id}`),
  
  createAccount: (account: CreateAccountRequest) => api.post<Account>('/accounts', account),
  
  updateAccount: (id: string, account: Partial<Account>) => api.put<Account>(`/accounts/${id}`, account),
  
  deleteAccount: (id: string) => api.delete(`/accounts/${id}`)
};

export default accountsApi;