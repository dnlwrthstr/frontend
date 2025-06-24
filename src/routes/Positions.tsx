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
  Text, 
  Spinner, 
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
  Select,
  Flex,
  Input,
  NumberInput,
  NumberInputField,
  useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import positionsApi, { Position, PositionCreate } from '../api/positionsApi';
import custodiansApi from '../api/custodiansApi';
import portfoliosApi, { Portfolio } from '../api/portfoliosApi';
import accountsApi, { Account } from '../api/accountsApi';
import PositionDetail from '../features/positions/PositionDetail';

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [_custodians, setCustodians] = useState<any[]>([]);
  const [_selectedCustodian, setSelectedCustodian] = useState<string>('');

  // State for position creation form
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

  // Disclosures for modals
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isCreateOpen, 
    onOpen: onCreateOpen, 
    onClose: onCreateClose 
  } = useDisclosure();

  const toast = useToast();

  const fetchPositions = async (portfolioId?: string) => {
    try {
      setLoading(true);

      // Fetch all custodians
      const custodians = await custodiansApi.getCustodians();

      // Fetch positions for each custodian
      const positionPromises = custodians.map(custodian => 
        positionsApi.getPositions(custodian.id)
      );

      // Wait for all position requests to complete
      const positionResults = await Promise.all(positionPromises);

      // Combine all positions into a single array
      const allPositions = positionResults.flat();

      // Filter positions by portfolio if a portfolio is selected
      if (portfolioId) {
        setPositions(allPositions.filter(position => position.portfolio_id === portfolioId));
      } else {
        setPositions(allPositions);
      }
    } catch (err) {
      setError('Failed to fetch positions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch accounts for a specific portfolio
  const fetchAccounts = async (portfolioId: string, custodianId: string) => {
    try {
      const accounts = await accountsApi.getAccounts(custodianId, portfolioId);
      setAccounts(accounts);
      return accounts;
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
      return [];
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPosition(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle number input changes
  const handleNumberChange = (name: string, value: string) => {
    setNewPosition(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  // Handle portfolio selection in the create form
  const handleCreateFormPortfolioChange = async (portfolioId: string) => {
    const portfolio = portfolios.find(p => p.portfolio_id === portfolioId);
    if (portfolio) {
      const custodianId = portfolio.custodian_id;
      await fetchAccounts(portfolioId, custodianId);

      setNewPosition(prev => ({
        ...prev,
        portfolio_id: portfolioId,
        account_id: '',
        currency: portfolio.currency
      }));
    }
  };

  // Handle form submission
  const handleCreatePosition = async () => {
    try {
      setLoading(true);

      // Find the custodian ID for the selected portfolio
      const portfolio = portfolios.find(p => p.portfolio_id === newPosition.portfolio_id);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const custodianId = portfolio.custodian_id;

      // Create the position
      await positionsApi.createPosition(newPosition, custodianId);

      // Reset form and close modal
      setNewPosition({
        portfolio_id: '',
        account_id: '',
        position_id: '',
        security_id: '',
        security_type: 'EQUITY',
        quantity: 0,
        market_value: 0,
        currency: 'USD',
      });

      onCreateClose();

      // Refresh positions
      fetchPositions(selectedPortfolio);

      // Show success message
      toast({
        title: 'Position created',
        description: 'The position has been created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Failed to create position:', err);
      toast({
        title: 'Error',
        description: 'Failed to create position',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all custodians
        const custodians = await custodiansApi.getCustodians();
        setCustodians(custodians);

        if (custodians.length > 0) {
          setSelectedCustodian(custodians[0].id);
        }

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
          fetchPositions(allPortfolios[0].portfolio_id);

          // Also fetch accounts for the first portfolio
          if (custodians.length > 0) {
            await fetchAccounts(allPortfolios[0].portfolio_id, custodians[0].id);
          }
        } else {
          // Then fetch positions without portfolio filter
          fetchPositions();
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle portfolio selection change
  const handlePortfolioChange = (portfolioId: string) => {
    setSelectedPortfolio(portfolioId);
    fetchPositions(portfolioId);
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box>
      <Heading mb={6}>Positions</Heading>

      <Flex mb={4} alignItems="center" justifyContent="space-between">
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

        <Button 
          colorScheme="green" 
          onClick={() => {
            // Pre-select the current portfolio in the form
            if (selectedPortfolio) {
              const portfolio = portfolios.find(p => p.portfolio_id === selectedPortfolio);
              if (portfolio) {
                setNewPosition(prev => ({
                  ...prev,
                  portfolio_id: selectedPortfolio,
                  currency: portfolio.currency
                }));
                fetchAccounts(selectedPortfolio, portfolio.custodian_id);
              }
            }
            onCreateOpen();
          }}
        >
          Create Position
        </Button>
      </Flex>

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

      {/* Position Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Position Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPosition && <PositionDetail position={selectedPosition} />}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create Position Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Position</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Portfolio</FormLabel>
              <Select
                name="portfolio_id"
                value={newPosition.portfolio_id}
                onChange={(e) => handleCreateFormPortfolioChange(e.target.value)}
                placeholder="Select portfolio"
              >
                {portfolios.map(portfolio => (
                  <option key={portfolio.id} value={portfolio.portfolio_id}>
                    {portfolio.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Account</FormLabel>
              <Select
                name="account_id"
                value={newPosition.account_id}
                onChange={handleInputChange}
                placeholder="Select account"
                isDisabled={!newPosition.portfolio_id}
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
                onChange={handleInputChange}
                placeholder="Enter position ID"
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Security ID</FormLabel>
              <Input
                name="security_id"
                value={newPosition.security_id}
                onChange={handleInputChange}
                placeholder="Enter security ID (e.g., AAPL)"
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Security Type</FormLabel>
              <Select
                name="security_type"
                value={newPosition.security_type}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CHF">CHF</option>
                <option value="JPY">JPY</option>
              </Select>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Cost Basis</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  name="cost_basis"
                  value={newPosition.cost_basis || ''}
                  onChange={(e) => handleNumberChange('cost_basis', e.target.value)}
                />
              </NumberInput>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Unrealized P/L</FormLabel>
              <NumberInput>
                <NumberInputField
                  name="unrealized_pl"
                  value={newPosition.unrealized_pl || ''}
                  onChange={(e) => handleNumberChange('unrealized_pl', e.target.value)}
                />
              </NumberInput>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>As of Date</FormLabel>
              <Input
                name="as_of_date"
                type="date"
                value={newPosition.as_of_date || ''}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onCreateClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="green" 
              onClick={handleCreatePosition}
              isLoading={loading}
              isDisabled={!newPosition.portfolio_id || !newPosition.account_id || !newPosition.position_id || !newPosition.security_id}
            >
              Create Position
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Positions;
