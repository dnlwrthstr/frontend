import React from 'react';
import { Box, Heading, Text, Grid, GridItem, Divider } from '@chakra-ui/react';
import { Transaction } from '../../api/transactionsApi';
import { formatNumber, formatDate } from '../../shared/formatters';

interface TransactionDetailProps {
  transaction: Transaction;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction }) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md">
      <Heading size="md" mb={4}>Transaction Details</Heading>
      <Divider mb={4} />

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <Text fontWeight="bold">ID:</Text>
          <Text>{transaction.id}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Transaction ID:</Text>
          <Text>{transaction.transaction_id || '-'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Custodian ID:</Text>
          <Text>{transaction.custodian_id || '-'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Portfolio ID:</Text>
          <Text>{transaction.portfolio_id || '-'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Account ID:</Text>
          <Text>{transaction.accountId || transaction.account_id || '-'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Transaction Type:</Text>
          <Text>{transaction.type || transaction.transaction_type || '-'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Security ID:</Text>
          <Text>{transaction.security_id || '-'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Security Type:</Text>
          <Text>{transaction.security_type || '-'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Quantity:</Text>
          <Text>{transaction.quantity || '-'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Price:</Text>
          <Text>{transaction.price ? formatNumber(transaction.price) : '-'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Amount:</Text>
          <Text color={transaction.amount >= 0 ? 'green.500' : 'red.500'}>
            {formatNumber(transaction.amount)}
          </Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Currency:</Text>
          <Text>{transaction.currency}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Trade Date:</Text>
          <Text>{formatDate(transaction.trade_date || transaction.date, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Settlement Date:</Text>
          <Text>{transaction.settlement_date ? formatDate(transaction.settlement_date, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }) : '-'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Description:</Text>
          <Text>{transaction.description || '-'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Created At:</Text>
          <Text>{transaction.created_at ? formatDate(transaction.created_at, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }) : '-'}</Text>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Updated At:</Text>
          <Text>{transaction.updated_at ? formatDate(transaction.updated_at, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }) : '-'}</Text>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default TransactionDetail;
