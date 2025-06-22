import { useState, useEffect } from 'react';
import positionsApi, { Position } from '../../api/positionsApi';

export const usePositions = (accountId?: string) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await positionsApi.getPositions(accountId);
        setPositions(data);
      } catch (err) {
        setError('Failed to fetch positions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
  }, [accountId]);

  return { positions, isLoading, error };
};

export default usePositions;