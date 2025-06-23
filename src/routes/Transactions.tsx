import { 
  Box, 
  Heading, 
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
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  useToast,
  Card,
  CardBody,
  CardHeader
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import transactionsApi, { TransactionType } from '../api/transactionsApi';
import custodiansApi, { Custodian } from '../api/custodiansApi';

const Transactions = () => {
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [selectedCustodianId, setSelectedCustodianId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create transaction modal state
  const { 
    isOpen: isCreateModalOpen, 
    onOpen: onCreateModalOpen, 
    onClose: onCreateModalClose 
  } = useDisclosure();

  // Form state for new transaction
  const [newTransaction, setNewTransaction] = useState({
    transaction_type: 'BUY' as TransactionType,
    account_id: '',
    portfolio_id: '',
    security_id: '',
    security_type: '',
    quantity: 0,
    price: 0,
    amount: 0,
    currency: 'USD',
    trade_date: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchCustodians = async () => {
      try {
        setLoading(true);
        const custodianData = await custodiansApi.getCustodians();
        setCustodians(custodianData);

        // Set the first custodian as selected if available and no custodian is currently selected
        if (custodianData.length > 0 && !selectedCustodianId) {
          setSelectedCustodianId(custodianData[0].id);
        }
      } catch (err) {
        setError('Failed to fetch custodians');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustodians();
  }, [selectedCustodianId]);

  // Handle input changes for the new transaction form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle number input changes
  const handleNumberChange = (name: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setNewTransaction(prev => ({
      ...prev,
      [name]: numValue
    }));

    // If price or quantity changes, update amount
    if (name === 'price' || name === 'quantity') {
      const price = name === 'price' ? numValue : newTransaction.price;
      const quantity = name === 'quantity' ? numValue : newTransaction.quantity;
      const amount = price * quantity;

      setNewTransaction(prev => ({
        ...prev,
        amount: amount
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedCustodianId) {
      toast({
        title: 'Error',
        description: 'Please select a custodian',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create the transaction
      await transactionsApi.createTransaction(newTransaction, selectedCustodianId);

      // Show success message
      toast({
        title: 'Transaction created',
        description: 'The transaction was successfully created',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Close the modal and reset form
      onCreateModalClose();
      setNewTransaction({
        transaction_type: 'BUY' as TransactionType,
        account_id: '',
        portfolio_id: '',
        security_id: '',
        security_type: '',
        quantity: 0,
        price: 0,
        amount: 0,
        currency: 'USD',
        trade_date: new Date().toISOString().split('T')[0]
      });

    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create transaction',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box>
      <Flex mb={6} justifyContent="space-between" alignItems="center">
        <Heading>Transactions</Heading>
      </Flex>

      <Card>
        <CardHeader>
          <Heading size="md">Create a New Transaction</Heading>
        </CardHeader>
        <CardBody>
          <Box mb={4}>
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

          <Button 
            colorScheme="blue" 
            onClick={onCreateModalOpen}
            isDisabled={!selectedCustodianId}
            size="lg"
            width="100%"
          >
            Create New Transaction
          </Button>
        </CardBody>
      </Card>

      {/* Create Transaction Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={onCreateModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Transaction Type</FormLabel>
              <Select 
                name="transaction_type" 
                value={newTransaction.transaction_type} 
                onChange={handleInputChange}
              >
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
                <option value="DIVIDEND">Dividend</option>
                <option value="FEE">Fee</option>
              </Select>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Account ID</FormLabel>
              <Input 
                name="account_id" 
                value={newTransaction.account_id} 
                onChange={handleInputChange} 
                placeholder="Enter account ID"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Portfolio ID</FormLabel>
              <Input 
                name="portfolio_id" 
                value={newTransaction.portfolio_id} 
                onChange={handleInputChange} 
                placeholder="Enter portfolio ID"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Security ID</FormLabel>
              <Input 
                name="security_id" 
                value={newTransaction.security_id} 
                onChange={handleInputChange} 
                placeholder="Enter security ID"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Security Type</FormLabel>
              <Input 
                name="security_type" 
                value={newTransaction.security_type} 
                onChange={handleInputChange} 
                placeholder="Enter security type"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Quantity</FormLabel>
              <NumberInput min={0}>
                <NumberInputField 
                  name="quantity" 
                  value={newTransaction.quantity} 
                  onChange={(e) => handleNumberChange('quantity', e.target.value)} 
                />
              </NumberInput>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Price</FormLabel>
              <NumberInput min={0}>
                <NumberInputField 
                  name="price" 
                  value={newTransaction.price} 
                  onChange={(e) => handleNumberChange('price', e.target.value)} 
                />
              </NumberInput>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Amount (Calculated)</FormLabel>
              <NumberInput isReadOnly>
                <NumberInputField 
                  value={newTransaction.amount} 
                />
              </NumberInput>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Currency</FormLabel>
              <Select 
                name="currency" 
                value={newTransaction.currency} 
                onChange={handleInputChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CHF">CHF</option>
                <option value="GBP">GBP</option>
              </Select>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Trade Date</FormLabel>
              <Input 
                name="trade_date" 
                type="date" 
                value={newTransaction.trade_date} 
                onChange={handleInputChange} 
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCreateModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Creating..."
            >
              Create Transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Transactions;
