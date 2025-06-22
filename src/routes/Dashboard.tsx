import { useEffect, useState, useCallback } from 'react';
import custodiansApi, { Custodian } from '../api/custodiansApi';
import accountsApi, { Account } from '../api/accountsApi';
import positionsApi, { Position } from '../api/positionsApi';
import portfoliosApi, { Portfolio } from '../api/portfoliosApi';

// Extend the Position interface to include securityType
interface PositionWithType extends Position {
  securityType: string;
}

const Dashboard = () => {
  const [, setCustodians] = useState<Custodian[]>([]);
  const [, setPortfolios] = useState<Portfolio[]>([]);
  const [, setAccounts] = useState<Account[]>([]);
  const [, setPositions] = useState<PositionWithType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  // Centralized error handler
  const addError = (message: string) => {
    console.error(message);
    setErrors(prevErrors => [...prevErrors, message]);
  };

  // Helper function: Fetch custodians
  const fetchCustodians = async () => {
    try {
      const custodiansData = await custodiansApi.getCustodians();
      setCustodians(custodiansData);
      return custodiansData;
    } catch (err) {
      addError('Failed to fetch custodians');
      return [];
    }
  };

  // Helper function: Fetch portfolios for all custodians
  const fetchPortfolios = async (custodiansData: Custodian[]) => {
    try {
      const portfolioPromises = custodiansData.map(custodian =>
        portfoliosApi.getPortfolios(custodian.id).catch(portfolioErr => {
          addError(`Failed to fetch portfolios for custodian ${custodian.name}: ${portfolioErr.message}`);
          return []; // Return an empty array to avoid breaking Promise.all
        })
      );

      const allPortfolios = (await Promise.all(portfolioPromises)).flat();
      setPortfolios(allPortfolios);
    } catch (err) {
      addError('Failed to fetch portfolios');
    }
  };

  // Helper function: Fetch accounts
  const fetchAccounts = async (custodiansData: Custodian[] = []) => {
    try {
      // Use the first custodian's ID if available, otherwise use default
      const custodianId = custodiansData.length > 0 ? custodiansData[0].id : '1';
      const accountsData = await accountsApi.getAccounts(custodianId);
      setAccounts(accountsData);
    } catch (err) {
      addError('Failed to fetch accounts');
    }
  };

  // Helper function: Fetch positions and classify by security types
  const fetchPositions = async (custodiansData: Custodian[] = []) => {
    try {
      // Use the first custodian's ID if available, otherwise use default
      const custodianId = custodiansData.length > 0 ? custodiansData[0].id : '1';

      // Add retry logic for fetching positions
      const MAX_RETRIES = 3;
      let retries = 0;
      let positionsData;

      while (retries < MAX_RETRIES) {
        try {
          positionsData = await positionsApi.getPositions(custodianId);
          break; // Success, exit the retry loop
        } catch (fetchErr: any) {
          retries++;
          console.warn(`Attempt ${retries}/${MAX_RETRIES} to fetch positions failed: ${fetchErr.message}`);

          if (retries >= MAX_RETRIES) {
            throw fetchErr; // Max retries reached, propagate the error
          }

          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
        }
      }

      if (!positionsData) {
        throw new Error('Failed to fetch positions data after multiple attempts');
      }

      // Derive security type from ISIN
      const deriveSecurityType = (isin: string): string => {
        if (isin.startsWith('IE') || isin.startsWith('LU')) return 'ETF';
        if (isin.includes('Bond') || isin.includes('Bund')) return 'Bond';
        return 'Equity';
      };

      const positionsWithType = positionsData.map(position => ({
        ...position,
        securityType: (position as PositionWithType).securityType || deriveSecurityType(position.isin),
      }));

      setPositions(positionsWithType);
    } catch (err: any) {
      const errorMessage = err.message ? `Failed to fetch positions: ${err.message}` : 'Failed to fetch positions';
      addError(errorMessage);
      console.error('Position fetching error details:', err);
    }
  };

  // Main data-fetching logic
  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrors([]); // Reset errors before fetching

    try {
      const custodiansData = await fetchCustodians();
      await fetchPortfolios(custodiansData); // Pass custodians to fetch portfolios
      await fetchAccounts(custodiansData); // Pass custodians to fetch accounts
      await fetchPositions(custodiansData); // Pass custodians to fetch positions
    } catch (err) {
      addError('An unexpected error occurred during data fetching');
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger data fetching on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Render error messages if any
  if (errors.length > 0) {
    return (
      <div>
        {errors.map((error, index) => (
          <p key={index} style={{ color: 'red' }}>{error}</p>
        ))}
      </div>
    );
  }

  // Render loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the regular UI (e.g., tables, charts)
  return <div>Dashboard Content</div>;
};

export default Dashboard;
