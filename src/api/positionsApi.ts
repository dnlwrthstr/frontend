import api from './apiClient';

export interface Position {
  id: string;
  custodian_id: string;
  portfolio_id: string;
  account_id: string;
  position_id: string;
  security_id: string;
  security_type: string;
  quantity: number;
  market_value: number;
  currency: string;
  cost_basis: number | null;
  unrealized_pl: number | null;
  as_of_date: string;
  created_at: string;
  updated_at: string;

  // Legacy fields for backward compatibility
  accountId?: string;
  isin?: string;
  name?: string;
  marketValue?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
}

const positionsApi = {
  getPositions: (custodianId: string = '1', accountId?: string) => {
    const url = accountId 
      ? `/v1/custodian/${custodianId}/positions?account_id=${accountId}` 
      : `/v1/custodian/${custodianId}/positions`;
    return api.get<Position[]>(url);
  },

  getPosition: (id: string, custodianId: string = '1') => api.get<Position>(`/v1/custodian/${custodianId}/positions/${id}`),

  getPositionsByIsin: (isin: string, custodianId: string = '1') => api.get<Position[]>(`/v1/custodian/${custodianId}/positions?isin=${isin}`)
};

export default positionsApi;
