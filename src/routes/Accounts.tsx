import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Spinner, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, ModalFooter } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import accountsApi, { Account, CreateAccountRequest } from '../api/accountsApi';

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newAccount, setNewAccount] = useState<CreateAccountRequest>({ name: '', number: '', type: 'SECURITIES' });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const accounts = await accountsApi.getAccounts();
        setAccounts(accounts);
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
      const createdAccount = await accountsApi.createAccount(newAccount);
      setAccounts([...accounts, createdAccount]);

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
