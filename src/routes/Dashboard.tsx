import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface AccountSummary {
  id: string;
  name: string;
  totalValue: number;
  currency: string;
  positionsCount: number;
}

const Dashboard = () => {
  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a call to the API
        // const response = await axios.get('/api/accounts');
        // setAccounts(response.data);
        
        // For now, we'll use mock data
        setAccounts([
          { id: '1', name: 'Main Account', totalValue: 125000, currency: 'USD', positionsCount: 15 },
          { id: '2', name: 'Retirement', totalValue: 450000, currency: 'USD', positionsCount: 8 },
          { id: '3', name: 'Savings', totalValue: 75000, currency: 'USD', positionsCount: 5 }
        ]);
      } catch (err) {
        setError('Failed to fetch accounts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {accounts.map(account => (
          <Card key={account.id}>
            <CardBody>
              <Stat>
                <StatLabel>{account.name}</StatLabel>
                <StatNumber>{new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.totalValue)}</StatNumber>
                <StatHelpText>{account.positionsCount} positions</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;