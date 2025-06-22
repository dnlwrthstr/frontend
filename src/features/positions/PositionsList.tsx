import { Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Text, Spinner } from '@chakra-ui/react';
import { Position } from '../../api/positionsApi';
import { formatNumber } from '../../shared/formatters';

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
          <Th>Security Type</Th>
          <Th>Security ID</Th>
          <Th isNumeric>Quantity</Th>
          <Th width="80px">Currency</Th>
          <Th isNumeric>Market Value</Th>
          <Th isNumeric>Profit/Loss</Th>
        </Tr>
      </Thead>
      <Tbody>
        {positions.map(position => (
          <Tr key={position.id}>
            <Td>{position.security_type}</Td>
            <Td>{position.security_id}</Td>
            <Td isNumeric>{position.quantity}</Td>
            <Td>{position.currency}</Td>
            <Td isNumeric>{formatNumber(position.market_value || 0)}</Td>
            <Td isNumeric>
              <Text color={(position.unrealized_pl || 0) >= 0 ? 'green.500' : 'red.500'}>
                {formatNumber(position.unrealized_pl || 0)}
                <Badge ml={2} colorScheme={(position.unrealized_pl || 0) >= 0 ? 'green' : 'red'}>
                  {(position.unrealized_pl || 0) >= 0 ? '+' : ''}{position.profitLossPercentage?.toFixed(2) || '0.00'}%
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
