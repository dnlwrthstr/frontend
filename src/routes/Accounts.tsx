import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Spinner, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, ModalFooter } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Account {
  id: string;
  name: string;
  number: string;
  type: string;
  balance: number;
  currency: string;
}

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newAccount, setNewAccount] = useState({ name: '', number: '', type: 'SECURITIES' });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a call to the API
        // const response = await axios.get('/api/accounts');
        // setAccounts(response.data);
        
        // For now, we'll use mock data
        setAccounts([
          { id: '1', name: 'Main Account', number: '1234567890', type: 'SECURITIES', balance: 125000, currency: 'USD' },
          { id: '2', name: 'Retirement', number: '0987654321', type: 'RETIREMENT', balance: 450000, currency: 'USD' },
          { id: '3', name: 'Savings', number: '5678901234', type: 'SAVINGS', balance: 75000, currency: 'USD' }
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

  const handleCreateAccount = async () => {
    try {
      // In a real app, this would be a call to the API
      // await axios.post('/api/accounts', newAccount);
      
      // For now, we'll just add it to the local state
      const newId = (accounts.length + 1).toString();
      setAccounts([...accounts, { 
        id: newId, 
        ...newAccount, 
        balance: 0, 
        currency: 'USD' 
      }]);
      
      onClose();
      setNewAccount({ name: '', number: '', type: 'SECURITIES' });
    } catch (err) {
      console.error('Failed to create account:', err);
    }
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box>
      <Heading mb={6}>Accounts</Heading>
      
      <Button colorScheme="teal" mb={4} onClick={onOpen}>
        Create New Account
      </Button>
      
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Account Number</Th>
            <Th>Type</Th>
            <Th isNumeric>Balance</Th>
          </Tr>
        </Thead>
        <Tbody>
          {accounts.map(account => (
            <Tr key={account.id}>
              <Td>{account.name}</Td>
              <Td>{account.number}</Td>
              <Td>{account.type}</Td>
              <Td isNumeric>{new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Account Name</FormLabel>
              <Input 
                value={newAccount.name} 
                onChange={(e) => setNewAccount({...newAccount, name: e.target.value})} 
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Account Number</FormLabel>
              <Input 
                value={newAccount.number} 
                onChange={(e) => setNewAccount({...newAccount, number: e.target.value})} 
              />
            </FormControl>
            <FormControl>
              <FormLabel>Account Type</FormLabel>
              <Input 
                as="select" 
                value={newAccount.type} 
                onChange={(e) => setNewAccount({...newAccount, type: e.target.value})}
              >
                <option value="SECURITIES">Securities</option>
                <option value="RETIREMENT">Retirement</option>
                <option value="SAVINGS">Savings</option>
              </Input>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateAccount}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Accounts;