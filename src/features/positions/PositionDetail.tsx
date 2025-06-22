import React from 'react';
import { Box, Heading, Text, Grid, GridItem, Divider } from '@chakra-ui/react';
import { Position } from '../../api/positionsApi';
import { formatNumber, formatDate } from '../../shared/formatters';

interface PositionDetailProps {
  position: Position;
}

const PositionDetail: React.FC<PositionDetailProps> = ({ position }) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md">
      <Heading size="md" mb={4}>Position Details</Heading>
      <Divider mb={4} />

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <Text fontWeight="bold">ID:</Text>
          <Text>{position.id}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Position ID:</Text>
          <Text>{position.position_id}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Custodian ID:</Text>
          <Text>{position.custodian_id}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Portfolio ID:</Text>
          <Text>{position.portfolio_id}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Account ID:</Text>
          <Text>{position.account_id}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Security ID:</Text>
          <Text>{position.security_id}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Security Type:</Text>
          <Text>{position.security_type}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Quantity:</Text>
          <Text>{position.quantity}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Market Value:</Text>
          <Text>{formatNumber(position.market_value)}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Currency:</Text>
          <Text>{position.currency}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Cost Basis:</Text>
          <Text>{position.cost_basis ? formatNumber(position.cost_basis) : 'N/A'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Unrealized P/L:</Text>
          <Text color={position.unrealized_pl && position.unrealized_pl >= 0 ? 'green.500' : 'red.500'}>
            {position.unrealized_pl ? formatNumber(position.unrealized_pl) : 'N/A'}
          </Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">As of Date:</Text>
          <Text>{formatDate(position.as_of_date)}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Created At:</Text>
          <Text>{formatDate(position.created_at)}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Updated At:</Text>
          <Text>{formatDate(position.updated_at)}</Text>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default PositionDetail;
