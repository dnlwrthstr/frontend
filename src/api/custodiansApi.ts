import api from './apiClient';

export interface Custodian {
  id: string;
  name: string;
  code: string;
  description?: string;
  contact_info: Record<string, string>;
  api_credentials: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface CreateCustodianRequest {
  name: string;
  code: string;
  description?: string;
  contact_info?: Record<string, string>;
  api_credentials?: Record<string, string>;
}

const custodiansApi = {
  getCustodians: () => api.get<Custodian[]>('/v1/custodian/'),

  getCustodian: (id: string) => api.get<Custodian>(`/v1/custodian/${id}`),

  createCustodian: (custodian: CreateCustodianRequest) => api.post<Custodian>('/v1/custodian/', custodian),

  updateCustodian: (id: string, custodian: Partial<Custodian>) => api.put<Custodian>(`/v1/custodian/${id}`, custodian),

  deleteCustodian: (id: string) => api.delete(`/v1/custodian/${id}`)
};

export default custodiansApi;
