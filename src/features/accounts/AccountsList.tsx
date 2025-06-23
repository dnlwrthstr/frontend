import { Box, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react';
import { Account } from '../../api/accountsApi';

interface AccountsListProps {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  onSelectAccount?: (accountId: string) => void;
}

const AccountsList = ({ accounts, isLoading, error, onSelectAccount }: AccountsListProps) => {
  if (isLoading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
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
          <Tr 
            key={account.id} 
            cursor={onSelectAccount ? 'pointer' : 'default'}
            onClick={() => onSelectAccount && onSelectAccount(account.id)}
            _hover={onSelectAccount ? { bg: 'gray.50' } : undefined}
          >
            <Td>{account.name}</Td>
            <Td>{account.account_id}</Td>
            <Td>{account.account_type}</Td>
            <Td isNumeric>{new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default AccountsList;
