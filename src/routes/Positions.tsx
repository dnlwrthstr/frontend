import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Text, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Position {
  id: string;
  isin: string;
  name: string;
  quantity: number;
  marketValue: number;
  currency: string;
  profitLoss: number;
  profitLossPercentage: number;
}

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a call to the API
        // const response = await axios.get('/api/positions');
        // setPositions(response.data);
        
        // For now, we'll use mock data
        setPositions([
          { id: '1', isin: 'US0378331005', name: 'Apple Inc.', quantity: 50, marketValue: 8750, currency: 'USD', profitLoss: 1250, profitLossPercentage: 16.67 },
          { id: '2', isin: 'US5949181045', name: 'Microsoft Corp.', quantity: 30, marketValue: 10200, currency: 'USD', profitLoss: 2200, profitLossPercentage: 27.5 },
          { id: '3', isin: 'US0231351067', name: 'Amazon.com Inc.', quantity: 15, marketValue: 5100, currency: 'USD', profitLoss: -300, profitLossPercentage: -5.56 },
          { id: '4', isin: 'US88160R1014', name: 'Tesla Inc.', quantity: 20, marketValue: 4800, currency: 'USD', profitLoss: 800, profitLossPercentage: 20 },
          { id: '5', isin: 'US30303M1027', name: 'Meta Platforms Inc.', quantity: 25, marketValue: 6250, currency: 'USD', profitLoss: -750, profitLossPercentage: -10.71 }
        ]);
      } catch (err) {
        setError('Failed to fetch positions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box>
      <Heading mb={6}>Positions</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ISIN</Th>
            <Th>Name</Th>
            <Th isNumeric>Quantity</Th>
            <Th isNumeric>Market Value</Th>
            <Th isNumeric>Profit/Loss</Th>
          </Tr>
        </Thead>
        <Tbody>
          {positions.map(position => (
            <Tr key={position.id}>
              <Td>{position.isin}</Td>
              <Td>{position.name}</Td>
              <Td isNumeric>{position.quantity}</Td>
              <Td isNumeric>{new Intl.NumberFormat('en-US', { style: 'currency', currency: position.currency }).format(position.marketValue)}</Td>
              <Td isNumeric>
                <Text color={position.profitLoss >= 0 ? 'green.500' : 'red.500'}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: position.currency }).format(position.profitLoss)}
                  <Badge ml={2} colorScheme={position.profitLoss >= 0 ? 'green' : 'red'}>
                    {position.profitLoss >= 0 ? '+' : ''}{position.profitLossPercentage.toFixed(2)}%
                  </Badge>
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Positions;