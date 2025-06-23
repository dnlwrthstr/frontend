import { Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Spinner, Select, Flex, Button } from '@chakra-ui/react';
import { Transaction, TransactionType } from '../../api/transactionsApi';
import { formatNumber, formatDate } from '../../shared/formatters';

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
    : transactions.filter(transaction => (transaction.type || transaction.transaction_type) === filter);

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
            <Th>Transaction ID</Th>
            <Th width="200px">Trade Date</Th>
            <Th>Transaction Type</Th>
            <Th>Security ID</Th>
            <Th>Security Type</Th>
            <Th isNumeric>Quantity</Th>
            <Th width="80px">Currency</Th>
            <Th isNumeric>Price</Th>
            <Th isNumeric>Amount</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredTransactions.map(transaction => (
            <Tr key={transaction.id}>
              <Td>{transaction.transaction_id || transaction.id}</Td>
              <Td>{formatDate(transaction.trade_date || transaction.date)}</Td>
              <Td>
                <Badge 
                  colorScheme={
                    (transaction.type || transaction.transaction_type) === 'BUY' ? 'blue' : 
                    (transaction.type || transaction.transaction_type) === 'SELL' ? 'green' : 
                    (transaction.type || transaction.transaction_type) === 'DIVIDEND' ? 'purple' : 
                    'red'
                  }
                >
                  {transaction.type || transaction.transaction_type}
                </Badge>
              </Td>
              <Td>{transaction.security_id || '-'}</Td>
              <Td>{transaction.security_type || '-'}</Td>
              <Td isNumeric>{transaction.quantity || '-'}</Td>
              <Td>{transaction.currency}</Td>
              <Td isNumeric>{transaction.price ? formatNumber(transaction.price) : '-'}</Td>
              <Td isNumeric>
                <Box color={transaction.amount >= 0 ? 'green.500' : 'red.500'}>
                  {formatNumber(transaction.amount)}
                </Box>
              </Td>
              <Td>
                <Button size="sm" colorScheme="blue" mr={2}>
                  View
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TransactionsList;
