import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Spinner, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, ModalFooter, Select, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import accountsApi, { Account, CreateAccountRequest } from '../api/accountsApi';
import portfoliosApi, { Portfolio } from '../api/portfoliosApi';
import custodiansApi from '../api/custodiansApi';

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newAccount, setNewAccount] = useState<CreateAccountRequest>({ 
    custodian_id: '1', 
    portfolio_id: '', 
    account_id: '', 
    name: '', 
    account_type: 'SECURITIES', 
    currency: 'USD' 
  });

  const fetchAccounts = async (portfolioId?: string) => {
    try {
      setLoading(true);

      // Fetch all custodians
      const custodians = await custodiansApi.getCustodians();

      // Fetch accounts for each custodian, filtered by portfolio if specified
      const accountPromises = custodians.map(custodian => 
        accountsApi.getAccounts(custodian.id, portfolioId)
      );

      // Wait for all account requests to complete
      const accountResults = await Promise.all(accountPromises);

      // Combine all accounts into a single array
      const allAccounts = accountResults.flat();

      // Set the accounts state
      setAccounts(allAccounts);
    } catch (err) {
      setError('Failed to fetch accounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        // Fetch all custodians
        const custodians = await custodiansApi.getCustodians();

        // Fetch portfolios for each custodian
        const portfolioPromises = custodians.map(custodian => 
          portfoliosApi.getPortfolios(custodian.id)
        );

        // Wait for all portfolio requests to complete
        const portfolioResults = await Promise.all(portfolioPromises);

        // Combine all portfolios into a single array
        const allPortfolios = portfolioResults.flat();

        setPortfolios(allPortfolios);

        // Set the first portfolio as selected by default if available
        if (allPortfolios.length > 0) {
          setSelectedPortfolio(allPortfolios[0].portfolio_id);
          setNewAccount(prev => ({ ...prev, portfolio_id: allPortfolios[0].portfolio_id }));
          fetchAccounts(allPortfolios[0].portfolio_id);
        } else {
          fetchAccounts();
        }
      } catch (err) {
        setError('Failed to fetch portfolios');
        console.error(err);
      }
    };

    fetchPortfolios();
  }, []);

  const handleCreateAccount = async () => {
    try {
      // Ensure the new account uses the selected portfolio
      const accountToCreate = {
        ...newAccount,
        portfolio_id: selectedPortfolio || (portfolios.length > 0 ? portfolios[0].portfolio_id : '')
      };

      const createdAccount = await accountsApi.createAccount(accountToCreate);
      setAccounts([...accounts, createdAccount]);

      onClose();
      setNewAccount({ 
        custodian_id: '1', 
        portfolio_id: selectedPortfolio || '', 
        account_id: '', 
        name: '', 
        account_type: 'SECURITIES', 
        currency: 'USD' 
      });
    } catch (err) {
      console.error('Failed to create account:', err);
    }
  };

  // Handle portfolio selection change
  const handlePortfolioChange = (portfolioId: string) => {
    setSelectedPortfolio(portfolioId);
    fetchAccounts(portfolioId);
    setNewAccount(prev => ({ ...prev, portfolio_id: portfolioId }));
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box>
      <Heading mb={6}>Accounts</Heading>

      <Flex mb={4} alignItems="center">
        <FormControl maxWidth="300px" mr={4}>
          <FormLabel>Select Portfolio</FormLabel>
          <Select 
            value={selectedPortfolio} 
            onChange={(e) => handlePortfolioChange(e.target.value)}
          >
            {portfolios.map(portfolio => (
              <option key={portfolio.id} value={portfolio.portfolio_id}>
                {portfolio.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button colorScheme="teal" onClick={onOpen}>
          Create New Account
        </Button>
      </Flex>

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
              <Td>{account.account_id}</Td>
              <Td>{account.account_type}</Td>
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
              <FormLabel>Portfolio</FormLabel>
              <Select
                value={newAccount.portfolio_id}
                onChange={(e) => setNewAccount({...newAccount, portfolio_id: e.target.value})}
              >
                {portfolios.map(portfolio => (
                  <option key={portfolio.id} value={portfolio.portfolio_id}>
                    {portfolio.name}
                  </option>
                ))}
              </Select>
            </FormControl>
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
                value={newAccount.account_id} 
                onChange={(e) => setNewAccount({...newAccount, account_id: e.target.value})} 
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Account Type</FormLabel>
              <Select
                value={newAccount.account_type} 
                onChange={(e) => setNewAccount({...newAccount, account_type: e.target.value})}
              >
                <option value="SECURITIES">Securities</option>
                <option value="RETIREMENT">Retirement</option>
                <option value="SAVINGS">Savings</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Currency</FormLabel>
              <Select
                value={newAccount.currency} 
                onChange={(e) => setNewAccount({...newAccount, currency: e.target.value})}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </Select>
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
