import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Spinner, Select, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'FEE';
  isin?: string;
  name?: string;
  quantity?: number;
  price?: number;
  amount: number;
  currency: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a call to the API
        // const response = await axios.get('/api/transactions');
        // setTransactions(response.data);

        // For now, we'll use mock data
        setTransactions([
          { id: '1', date: '2023-06-15', type: 'BUY', isin: 'US0378331005', name: 'Apple Inc.', quantity: 10, price: 175, amount: -1750, currency: 'USD' },
          { id: '2', date: '2023-06-10', type: 'SELL', isin: 'US5949181045', name: 'Microsoft Corp.', quantity: 5, price: 340, amount: 1700, currency: 'USD' },
          { id: '3', date: '2023-06-05', type: 'DIVIDEND', isin: 'US0231351067', name: 'Amazon.com Inc.', amount: 45, currency: 'USD' },
          { id: '4', date: '2023-06-01', type: 'FEE', amount: -15, currency: 'USD' },
          { id: '5', date: '2023-05-25', type: 'BUY', isin: 'US88160R1014', name: 'Tesla Inc.', quantity: 8, price: 240, amount: -1920, currency: 'USD' }
        ]);
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = filter === 'ALL' 
    ? transactions 
    : transactions.filter(transaction => transaction.type === filter);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box>
      <Heading mb={6}>Transactions</Heading>

      <Flex mb={4}>
        <Select 
          width="200px" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Transactions</option>
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
          <option value="DIVIDEND">Dividend</option>
          <option value="FEE">Fee</option>
        </Select>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Type</Th>
            <Th>Security</Th>
            <Th isNumeric>Quantity</Th>
            <Th isNumeric>Price</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredTransactions.map(transaction => (
            <Tr key={transaction.id}>
              <Td>{new Date(transaction.date).toLocaleDateString()}</Td>
              <Td>
                <Badge 
                  colorScheme={
                    transaction.type === 'BUY' ? 'blue' : 
                    transaction.type === 'SELL' ? 'green' : 
                    transaction.type === 'DIVIDEND' ? 'purple' : 
                    'red'
                  }
                >
                  {transaction.type}
                </Badge>
              </Td>
              <Td>{transaction.name || '-'}</Td>
              <Td isNumeric>{transaction.quantity || '-'}</Td>
              <Td isNumeric>{transaction.price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: transaction.currency }).format(transaction.price) : '-'}</Td>
              <Td isNumeric>
                <Box color={transaction.amount >= 0 ? 'green.500' : 'red.500'}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: transaction.currency }).format(transaction.amount)}
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Transactions;
