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
  getAccounts: (custodianId: string = '1') => api.get<Account[]>(`/v1/custodian/${custodianId}/accounts`),

  getAccount: (id: string, custodianId: string = '1') => api.get<Account>(`/v1/custodian/${custodianId}/accounts/${id}`),

  createAccount: (account: CreateAccountRequest, custodianId: string = '1') => api.post<Account>(`/v1/custodian/${custodianId}/accounts`, account),

  updateAccount: (id: string, account: Partial<Account>, custodianId: string = '1') => api.put<Account>(`/v1/custodian/${custodianId}/accounts/${id}`, account),

  deleteAccount: (id: string, custodianId: string = '1') => api.delete(`/v1/custodian/${custodianId}/accounts/${id}`)
};

export default accountsApi;
