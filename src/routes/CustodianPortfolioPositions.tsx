import { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  Spinner, 
  useDisclosure, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton, 
  FormControl, 
  FormLabel, 
  Input, 
  ModalFooter, 
  Text, 
  useToast, 
  TableContainer,
  Select,
  NumberInput,
  NumberInputField,
  Badge,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import custodiansApi, { Custodian, CreateCustodianRequest } from '../api/custodiansApi';
import portfoliosApi, { Portfolio, CreatePortfolioRequest } from '../api/portfoliosApi';
import positionsApi, { Position, PositionCreate } from '../api/positionsApi';
import accountsApi, { Account } from '../api/accountsApi';
import transactionsApi, { Transaction } from '../api/transactionsApi';
import PositionDetail from '../features/positions/PositionDetail';
import AccountsList from '../features/accounts/AccountsList';
import TransactionsList from '../features/transactions/TransactionsList';

const CustodianPortfolioPositions = () => {
  // State for navigation
  const [view, setView] = useState<'custodians' | 'portfolios' | 'positions'>('custodians');

  // State for data
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionFilter, setTransactionFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'DIVIDEND' | 'FEE'>('ALL');

  // State for selected items
  const [selectedCustodian, setSelectedCustodian] = useState<Custodian | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for modals
  const { isOpen: isCustodianModalOpen, onOpen: onCustodianModalOpen, onClose: onCustodianModalClose } = useDisclosure();
  const { isOpen: isPortfolioModalOpen, onOpen: onPortfolioModalOpen, onClose: onPortfolioModalClose } = useDisclosure();
  const { isOpen: isPositionModalOpen, onOpen: onPositionModalOpen, onClose: onPositionModalClose } = useDisclosure();
  const { isOpen: isPositionDetailModalOpen, onOpen: onPositionDetailModalOpen, onClose: onPositionDetailModalClose } = useDisclosure();

  // State for form data
  const [newCustodian, setNewCustodian] = useState<CreateCustodianRequest>({ 
    name: '', 
    code: '', 
    description: '', 
    contact_info: {
      email: '',
      phone: '',
      address: ''
    }, 
    api_credentials: {} 
  });

  const [newPortfolio, setNewPortfolio] = useState<CreatePortfolioRequest>({ 
    portfolio_id: '', 
    name: '', 
    description: '', 
    currency: 'USD',
    custodian_id: ''
  });

  const [newPosition, setNewPosition] = useState<PositionCreate>({
    portfolio_id: '',
    account_id: '',
    position_id: '',
    security_id: '',
    security_type: 'EQUITY',
    quantity: 0,
    market_value: 0,
    currency: 'USD',
  });

  const toast = useToast();

  // Fetch custodians
  const fetchCustodians = async () => {
    try {
      setLoading(true);
      const custodians = await custodiansApi.getCustodians();
      setCustodians(custodians);
      if (custodians.length === 0) {
        toast({
          title: "No custodians found",
          description: "There are no custodians in the system.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      setError('Failed to fetch custodians');
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch custodians. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch portfolios for a custodian
  const fetchPortfolios = async (custodian: Custodian) => {
    try {
      setLoading(true);
      const portfolios = await portfoliosApi.getPortfolios(custodian.id);
      setPortfolios(portfolios);
      if (portfolios.length === 0) {
        toast({
          title: "No portfolios found",
          description: `There are no portfolios for custodian ${custodian.name}.`,
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      setError('Failed to fetch portfolios');
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch portfolios. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch positions for a portfolio
  const fetchPositions = async (portfolio: Portfolio) => {
    try {
      setLoading(true);
      const positions = await positionsApi.getPositions(portfolio.custodian_id, portfolio.portfolio_id);
      setPositions(positions);
      if (positions.length === 0) {
        toast({
          title: "No positions found",
          description: `There are no positions for portfolio ${portfolio.name}.`,
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      setError('Failed to fetch positions');
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch positions. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch accounts for a portfolio
  const fetchAccounts = async (portfolio: Portfolio) => {
    try {
      const accounts = await accountsApi.getAccounts(portfolio.custodian_id, portfolio.portfolio_id);
      setAccounts(accounts);
      return accounts;
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
      return [];
    }
  };

  // Fetch transactions for a portfolio
  const fetchTransactions = async (portfolio: Portfolio) => {
    try {
      const transactions = await transactionsApi.getTransactions({
        custodianId: portfolio.custodian_id,
        portfolioId: portfolio.portfolio_id
      });
      setTransactions(transactions);
      return transactions;
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setTransactions([]);
      return [];
    }
  };

  // Handle custodian selection
  const handleCustodianSelect = async (custodian: Custodian) => {
    setSelectedCustodian(custodian);
    setSelectedPortfolio(null);
    await fetchPortfolios(custodian);
    setView('portfolios');
  };

  // Handle portfolio selection
  const handlePortfolioSelect = async (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    await fetchPositions(portfolio);
    await fetchAccounts(portfolio);
    await fetchTransactions(portfolio);
    setView('positions');
  };

  // Handle create custodian
  const handleCreateCustodian = async () => {
    try {
      const createdCustodian = await custodiansApi.createCustodian(newCustodian);
      setCustodians([...custodians, createdCustodian]);

      toast({
        title: "Custodian created",
        description: `Successfully created custodian: ${createdCustodian.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onCustodianModalClose();
      setNewCustodian({ 
        name: '', 
        code: '', 
        description: '', 
        contact_info: {
          email: '',
          phone: '',
          address: ''
        }, 
        api_credentials: {} 
      });
    } catch (err) {
      console.error('Failed to create custodian:', err);
      toast({
        title: "Error",
        description: "Failed to create custodian. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle create portfolio
  const handleCreatePortfolio = async () => {
    try {
      if (!selectedCustodian) {
        throw new Error('No custodian selected');
      }

      const createdPortfolio = await portfoliosApi.createPortfolio({
        ...newPortfolio,
        custodian_id: selectedCustodian.id
      });

      setPortfolios([...portfolios, createdPortfolio]);

      toast({
        title: "Portfolio created",
        description: `Successfully created portfolio: ${createdPortfolio.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onPortfolioModalClose();
      setNewPortfolio({ 
        portfolio_id: '', 
        name: '', 
        description: '', 
        currency: 'USD',
        custodian_id: selectedCustodian.id
      });
    } catch (err) {
      console.error('Failed to create portfolio:', err);
      toast({
        title: "Error",
        description: "Failed to create portfolio. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle create position
  const handleCreatePosition = async () => {
    try {
      if (!selectedCustodian || !selectedPortfolio) {
        throw new Error('No custodian or portfolio selected');
      }

      await positionsApi.createPosition({
        ...newPosition,
        portfolio_id: selectedPortfolio.portfolio_id
      }, selectedCustodian.id);

      // Refresh positions
      await fetchPositions(selectedPortfolio);

      toast({
        title: "Position created",
        description: "Successfully created position",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onPositionModalClose();
      setNewPosition({
        portfolio_id: selectedPortfolio.portfolio_id,
        account_id: '',
        position_id: '',
        security_id: '',
        security_type: 'EQUITY',
        quantity: 0,
        market_value: 0,
        currency: selectedPortfolio.currency,
      });
    } catch (err) {
      console.error('Failed to create position:', err);
      toast({
        title: "Error",
        description: "Failed to create position. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle number input changes for position form
  const handleNumberChange = (name: string, value: string) => {
    setNewPosition(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  // Initialize component
  useEffect(() => {
    fetchCustodians();
  }, []);

  // Render navigation breadcrumbs
  const renderBreadcrumbs = () => {
    return (
      <Breadcrumb mb={4}>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => {
            setView('custodians');
            setSelectedCustodian(null);
            setSelectedPortfolio(null);
          }}>
            Custodians
          </BreadcrumbLink>
        </BreadcrumbItem>

        {selectedCustodian && (
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => {
              setView('portfolios');
              setSelectedPortfolio(null);
            }}>
              {selectedCustodian.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {selectedPortfolio && (
          <BreadcrumbItem>
            <BreadcrumbLink>
              {selectedPortfolio.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </Breadcrumb>
    );
  };

  // Render custodians view
  const renderCustodiansView = () => {
    return (
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading size="lg">Custodians</Heading>
          <Button colorScheme="teal" onClick={onCustodianModalOpen}>
            Create New Custodian
          </Button>
        </Flex>

        {custodians.length === 0 ? (
          <Text>No custodians found.</Text>
        ) : (
          <TableContainer>
            <Table variant="simple" size="md" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Code</Th>
                  <Th>Description</Th>
                  <Th>Contact Info</Th>
                  <Th>Created At</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {custodians.map(custodian => (
                  <Tr key={custodian.id}>
                    <Td fontWeight="semibold">{custodian.name}</Td>
                    <Td>{custodian.code}</Td>
                    <Td>{custodian.description || 'N/A'}</Td>
                    <Td>
                      <Box>
                        <Text><strong>Email:</strong> {custodian.contact_info?.email || 'N/A'}</Text>
                        <Text><strong>Phone:</strong> {custodian.contact_info?.phone || 'N/A'}</Text>
                        <Text><strong>Address:</strong> {custodian.contact_info?.address || 'N/A'}</Text>
                      </Box>
                    </Td>
                    <Td>{new Date(custodian.created_at).toLocaleDateString()}</Td>
                    <Td>
                      <Button colorScheme="blue" size="sm" onClick={() => handleCustodianSelect(custodian)}>
                        View Portfolios
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  };

  // Render portfolios view
  const renderPortfoliosView = () => {
    if (!selectedCustodian) return null;

    return (
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading size="lg">Portfolios for {selectedCustodian.name}</Heading>
          <Button colorScheme="teal" onClick={onPortfolioModalOpen}>
            Create New Portfolio
          </Button>
        </Flex>

        {portfolios.length === 0 ? (
          <Text>No portfolios found for this custodian.</Text>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Portfolio ID</Th>
                  <Th>Name</Th>
                  <Th>Description</Th>
                  <Th>Currency</Th>
                  <Th>Created At</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {portfolios.map((portfolio) => (
                  <Tr key={portfolio.id}>
                    <Td>{portfolio.portfolio_id}</Td>
                    <Td>{portfolio.name}</Td>
                    <Td>{portfolio.description || '-'}</Td>
                    <Td>{portfolio.currency}</Td>
                    <Td>{new Date(portfolio.created_at).toLocaleString()}</Td>
                    <Td>
                      <Button colorScheme="blue" size="sm" onClick={() => handlePortfolioSelect(portfolio)}>
                        View Positions
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  };

  // Render positions view
  const renderPositionsView = () => {
    if (!selectedCustodian || !selectedPortfolio) return null;

    return (
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading size="lg">Portfolio: {selectedPortfolio.name}</Heading>
          <Button 
            colorScheme="teal" 
            onClick={() => {
              setNewPosition({
                ...newPosition,
                portfolio_id: selectedPortfolio.portfolio_id,
                currency: selectedPortfolio.currency
              });
              onPositionModalOpen();
            }}
          >
            Create New Position
          </Button>
        </Flex>

        <Tabs colorScheme="blue" variant="enclosed">
          <TabList>
            <Tab>Positions</Tab>
            <Tab>Accounts</Tab>
            <Tab>Transactions</Tab>
          </TabList>

          <TabPanels>
            {/* Positions Tab */}
            <TabPanel>
              {positions.length === 0 ? (
                <Text>No positions found for this portfolio.</Text>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Security Type</Th>
                      <Th>Security ID</Th>
                      <Th isNumeric>Quantity</Th>
                      <Th>Currency</Th>
                      <Th isNumeric>Market Value</Th>
                      <Th isNumeric>Profit/Loss</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {positions.map(position => (
                      <Tr key={position.id}>
                        <Td>{position.security_type}</Td>
                        <Td>{position.security_id}</Td>
                        <Td isNumeric>{position.quantity}</Td>
                        <Td>{position.currency}</Td>
                        <Td isNumeric>{new Intl.NumberFormat('en-US', { style: 'currency', currency: position.currency }).format(position.market_value || 0)}</Td>
                        <Td isNumeric>
                          <Text color={(position.unrealized_pl || 0) >= 0 ? 'green.500' : 'red.500'}>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: position.currency }).format(position.unrealized_pl || 0)}
                            <Badge ml={2} colorScheme={(position.unrealized_pl || 0) >= 0 ? 'green' : 'red'}>
                              {(position.unrealized_pl || 0) >= 0 ? '+' : ''}{position.profitLossPercentage?.toFixed(2) || '0.00'}%
                            </Badge>
                          </Text>
                        </Td>
                        <Td>
                          <Button 
                            size="sm" 
                            colorScheme="blue"
                            onClick={() => {
                              setSelectedPosition(position);
                              onPositionDetailModalOpen();
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
            </TabPanel>

            {/* Accounts Tab */}
            <TabPanel>
              <AccountsList 
                accounts={accounts} 
                isLoading={false} 
                error={null} 
              />
            </TabPanel>

            {/* Transactions Tab */}
            <TabPanel>
              <TransactionsList 
                transactions={transactions} 
                isLoading={false} 
                error={null} 
                filter={transactionFilter}
                onFilterChange={setTransactionFilter}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    );
  };

  // Render current view based on state
  const renderCurrentView = () => {
    switch (view) {
      case 'custodians':
        return renderCustodiansView();
      case 'portfolios':
        return renderPortfoliosView();
      case 'positions':
        return renderPositionsView();
      default:
        return renderCustodiansView();
    }
  };

  if (loading && custodians.length === 0) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box>
      {renderBreadcrumbs()}
      {renderCurrentView()}

      {/* Create Custodian Modal */}
      <Modal isOpen={isCustodianModalOpen} onClose={onCustodianModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Custodian</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input 
                value={newCustodian.name} 
                onChange={(e) => setNewCustodian({...newCustodian, name: e.target.value})} 
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Code</FormLabel>
              <Input 
                value={newCustodian.code} 
                onChange={(e) => setNewCustodian({...newCustodian, code: e.target.value})} 
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Input 
                value={newCustodian.description} 
                onChange={(e) => setNewCustodian({...newCustodian, description: e.target.value})}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input 
                value={newCustodian.contact_info?.email || ''} 
                onChange={(e) => setNewCustodian({
                  ...newCustodian, 
                  contact_info: {
                    ...newCustodian.contact_info,
                    email: e.target.value
                  }
                })}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Phone</FormLabel>
              <Input 
                value={newCustodian.contact_info?.phone || ''} 
                onChange={(e) => setNewCustodian({
                  ...newCustodian, 
                  contact_info: {
                    ...newCustodian.contact_info,
                    phone: e.target.value
                  }
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input 
                value={newCustodian.contact_info?.address || ''} 
                onChange={(e) => setNewCustodian({
                  ...newCustodian, 
                  contact_info: {
                    ...newCustodian.contact_info,
                    address: e.target.value
                  }
                })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateCustodian}>
              Create
            </Button>
            <Button variant="ghost" onClick={onCustodianModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create Portfolio Modal */}
      <Modal isOpen={isPortfolioModalOpen} onClose={onPortfolioModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Portfolio</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4}>
              <FormLabel>Portfolio ID</FormLabel>
              <Input 
                placeholder="Enter portfolio ID"
                value={newPortfolio.portfolio_id}
                onChange={(e) => setNewPortfolio({...newPortfolio, portfolio_id: e.target.value})}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input 
                placeholder="Enter portfolio name"
                value={newPortfolio.name}
                onChange={(e) => setNewPortfolio({...newPortfolio, name: e.target.value})}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Input 
                placeholder="Enter description"
                value={newPortfolio.description || ''}
                onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Currency</FormLabel>
              <Select
                value={newPortfolio.currency}
                onChange={(e) => setNewPortfolio({...newPortfolio, currency: e.target.value})}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CHF">CHF</option>
                <option value="JPY">JPY</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePortfolio}>
              Create
            </Button>
            <Button onClick={onPortfolioModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create Position Modal */}
      <Modal isOpen={isPositionModalOpen} onClose={onPositionModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Position</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Account</FormLabel>
              <Select
                name="account_id"
                value={newPosition.account_id}
                onChange={(e) => setNewPosition({...newPosition, account_id: e.target.value})}
                placeholder="Select account"
              >
                {accounts.map(account => (
                  <option key={account.id} value={account.account_id}>
                    {account.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Position ID</FormLabel>
              <Input
                name="position_id"
                value={newPosition.position_id}
                onChange={(e) => setNewPosition({...newPosition, position_id: e.target.value})}
                placeholder="Enter position ID"
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Security ID</FormLabel>
              <Input
                name="security_id"
                value={newPosition.security_id}
                onChange={(e) => setNewPosition({...newPosition, security_id: e.target.value})}
                placeholder="Enter security ID (e.g., AAPL)"
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Security Type</FormLabel>
              <Select
                name="security_type"
                value={newPosition.security_type}
                onChange={(e) => setNewPosition({...newPosition, security_type: e.target.value})}
              >
                <option value="EQUITY">EQUITY</option>
                <option value="BOND">BOND</option>
                <option value="FUND">FUND</option>
                <option value="ETF">ETF</option>
                <option value="OPTION">OPTION</option>
                <option value="FUTURE">FUTURE</option>
                <option value="CASH">CASH</option>
              </Select>
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Quantity</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  name="quantity"
                  value={newPosition.quantity}
                  onChange={(e) => handleNumberChange('quantity', e.target.value)}
                />
              </NumberInput>
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Market Value</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  name="market_value"
                  value={newPosition.market_value}
                  onChange={(e) => handleNumberChange('market_value', e.target.value)}
                />
              </NumberInput>
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Currency</FormLabel>
              <Select
                name="currency"
                value={newPosition.currency}
                onChange={(e) => setNewPosition({...newPosition, currency: e.target.value})}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CHF">CHF</option>
                <option value="JPY">JPY</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onPositionModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="green" 
              onClick={handleCreatePosition}
              isLoading={loading}
              isDisabled={!newPosition.account_id || !newPosition.position_id || !newPosition.security_id}
            >
              Create Position
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Position Detail Modal */}
      <Modal isOpen={isPositionDetailModalOpen} onClose={onPositionDetailModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Position Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPosition && <PositionDetail position={selectedPosition} />}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onPositionDetailModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CustodianPortfolioPositions;
