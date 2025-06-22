import { 
  Box, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge, 
  Spinner, 
  Select, 
  Flex, 
  Text, 
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import transactionsApi, { Transaction, TransactionType, TransactionFilter } from '../api/transactionsApi';
import custodiansApi, { Custodian } from '../api/custodiansApi';
import TransactionDetail from '../features/transactions/TransactionDetail';
import { formatDate, formatNumber } from '../shared/formatters';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [selectedCustodianId, setSelectedCustodianId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchCustodians = async () => {
      try {
        const custodianData = await custodiansApi.getCustodians();
        setCustodians(custodianData);

        // Set the first custodian as selected if available and no custodian is currently selected
        if (custodianData.length > 0 && !selectedCustodianId) {
          setSelectedCustodianId(custodianData[0].id);
        }
      } catch (err) {
        setError('Failed to fetch custodians');
        console.error(err);
      }
    };

    fetchCustodians();
  }, [selectedCustodianId]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedCustodianId) return;

      try {
        setLoading(true);

        // Create filter object for API call
        const apiFilter: TransactionFilter = {
          custodianId: selectedCustodianId
        };

        if (filter !== 'ALL') {
          apiFilter.type = filter;
        }

        const transactionsData = await transactionsApi.getTransactions(apiFilter);
        setTransactions(transactionsData);
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filter, selectedCustodianId]);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box>
      <Heading mb={6}>Transactions</Heading>

      <Flex mb={4} gap={4}>
        <Box>
          <Text mb={2} fontWeight="medium">Custodian</Text>
          <Select 
            width="250px" 
            value={selectedCustodianId} 
            onChange={(e) => setSelectedCustodianId(e.target.value)}
            isDisabled={custodians.length === 0}
          >
            {custodians.length === 0 ? (
              <option value="">No custodians available</option>
            ) : (
              custodians.map(custodian => (
                <option key={custodian.id} value={custodian.id}>
                  {custodian.name} ({custodian.code})
                </option>
              ))
            )}
          </Select>
        </Box>

        <Box>
          <Text mb={2} fontWeight="medium">Transaction Type</Text>
          <Select 
            width="200px" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as TransactionType | 'ALL')}
          >
            <option value="ALL">All Transactions</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
            <option value="DIVIDEND">Dividend</option>
            <option value="FEE">Fee</option>
          </Select>
        </Box>
      </Flex>

      {transactions.length === 0 ? (
        <Box p={4} textAlign="center" borderWidth="1px" borderRadius="lg">
          <Text fontSize="lg">No transactions found for the selected criteria.</Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            Try selecting a different custodian or transaction type.
          </Text>
        </Box>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Transaction ID</Th>
              <Th>Trade Date</Th>
              <Th>Transaction Type</Th>
              <Th>Security ID</Th>
              <Th>Security Type</Th>
              <Th isNumeric>Quantity</Th>
              <Th>Currency</Th>
              <Th isNumeric>Price</Th>
              <Th isNumeric>Amount</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map(transaction => (
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
                  <Button 
                    size="sm" 
                    colorScheme="blue"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      onOpen();
                    }}
                  >
                    View Details
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Transaction Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTransaction && <TransactionDetail transaction={selectedTransaction} />}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Transactions;
