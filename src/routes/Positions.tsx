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
  useDisclosure
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import positionsApi, { Position } from '../api/positionsApi';
import custodiansApi from '../api/custodiansApi';
import PositionDetail from '../features/positions/PositionDetail';

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // First fetch custodians to get a custodian ID
        const custodians = await custodiansApi.getCustodians();

        // Use the first custodian's ID if available, otherwise use default
        const custodianId = custodians.length > 0 ? custodians[0].id : '1';

        // Then fetch positions using the custodian ID
        const positionsData = await positionsApi.getPositions(custodianId);
        setPositions(positionsData);
      } catch (err) {
        setError('Failed to fetch positions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box>
      <Heading mb={6}>Positions</Heading>
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
