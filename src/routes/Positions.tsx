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
  Flex
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import positionsApi, { Position } from '../api/positionsApi';
import custodiansApi from '../api/custodiansApi';
import portfoliosApi, { Portfolio } from '../api/portfoliosApi';
import PositionDetail from '../features/positions/PositionDetail';

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

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
          fetchPositions(allPortfolios[0].portfolio_id);
        } else {
          // Then fetch positions without portfolio filter
          fetchPositions();
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
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
    </Box>
  );
};

export default Positions;
