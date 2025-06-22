import api from './apiClient';

export interface Position {
  id: string;
  accountId: string;
  isin: string;
  name: string;
  quantity: number;
  marketValue: number;
  currency: string;
  profitLoss: number;
  profitLossPercentage: number;
}

const positionsApi = {
  getPositions: (accountId?: string) => {
    const url = accountId ? `/accounts/${accountId}/positions` : '/positions';
    return api.get<Position[]>(url);
  },
  
  getPosition: (id: string) => api.get<Position>(`/positions/${id}`),
  
  getPositionsByIsin: (isin: string) => api.get<Position[]>(`/positions?isin=${isin}`)
};

export default positionsApi;