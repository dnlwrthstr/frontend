import { Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Text, Spinner } from '@chakra-ui/react';
import { Position } from '../../api/positionsApi';

interface PositionsListProps {
  positions: Position[];
  isLoading: boolean;
  error: string | null;
}

const PositionsList = ({ positions, isLoading, error }: PositionsListProps) => {
  if (isLoading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>ISIN</Th>
          <Th>Name</Th>
          <Th isNumeric>Quantity</Th>
          <Th isNumeric>Market Value</Th>
          <Th isNumeric>Profit/Loss</Th>
        </Tr>
      </Thead>
      <Tbody>
        {positions.map(position => (
          <Tr key={position.id}>
            <Td>{position.isin}</Td>
            <Td>{position.name}</Td>
            <Td isNumeric>{position.quantity}</Td>
            <Td isNumeric>{new Intl.NumberFormat('en-US', { style: 'currency', currency: position.currency }).format(position.marketValue)}</Td>
            <Td isNumeric>
              <Text color={position.profitLoss >= 0 ? 'green.500' : 'red.500'}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: position.currency }).format(position.profitLoss)}
                <Badge ml={2} colorScheme={position.profitLoss >= 0 ? 'green' : 'red'}>
                  {position.profitLoss >= 0 ? '+' : ''}{position.profitLossPercentage.toFixed(2)}%
                </Badge>
              </Text>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default PositionsList;