import { Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Spinner, Select, Flex } from '@chakra-ui/react';
import { Transaction, TransactionType } from '../../api/transactionsApi';

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  filter: TransactionType | 'ALL';
  onFilterChange: (filter: TransactionType | 'ALL') => void;
}

const TransactionsList = ({ transactions, isLoading, error, filter, onFilterChange }: TransactionsListProps) => {
  if (isLoading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  const filteredTransactions = filter === 'ALL' 
    ? transactions 
    : transactions.filter(transaction => transaction.type === filter);

  return (
    <Box>
      <Flex mb={4}>
        <Select 
          width="200px" 
          value={filter} 
          onChange={(e) => onFilterChange(e.target.value as TransactionType | 'ALL')}
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

export default TransactionsList;