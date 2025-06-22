import api from './apiClient';

export interface Portfolio {
  id: string;
  portfolio_id: string;
  name: string;
  description?: string;
  currency: string;
  custodian_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePortfolioRequest {
  portfolio_id: string;
  name: string;
  description?: string;
  currency: string;
  custodian_id: string;
}

const portfoliosApi = {
  getPortfolios: (custodianId: string = '1') => {
    return api.get<Portfolio[]>(`/v1/custodian/${custodianId}/portfolios`);
  },

  getPortfolio: (id: string, custodianId: string = '1') => api.get<Portfolio>(`/v1/custodian/${custodianId}/portfolios/${id}`),

  createPortfolio: (portfolio: CreatePortfolioRequest) => {
    const url = `/v1/custodian/${portfolio.custodian_id}/portfolios`;
    return api.post<Portfolio>(url, portfolio);
  },

  updatePortfolio: (id: string, portfolio: Partial<Portfolio>) => {
    const custodianId = portfolio.custodian_id || '1';
    return api.put<Portfolio>(`/v1/custodian/${custodianId}/portfolios/${id}`, portfolio);
  },

  deletePortfolio: (id: string, custodianId: string = '1') => api.delete(`/v1/custodian/${custodianId}/portfolios/${id}`)
};

export default portfoliosApi;
