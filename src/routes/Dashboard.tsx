import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import custodiansApi, { Custodian } from '../api/custodiansApi';
import accountsApi, { Account } from '../api/accountsApi';

const Dashboard = () => {
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch custodians
        const custodiansData = await custodiansApi.getCustodians();
        setCustodians(custodiansData);

        // Fetch accounts
        try {
          const accountsData = await accountsApi.getAccounts();
          setAccounts(accountsData);
        } catch (accountErr) {
          console.error('Failed to fetch accounts, using mock data instead:', accountErr);
          // Fallback to mock data if API call fails
          setAccounts([
            { id: '1', name: 'Main Account', number: 'ACC001', type: 'Checking', balance: 125000, currency: 'USD' },
            { id: '2', name: 'Retirement', number: 'ACC002', type: 'Savings', balance: 450000, currency: 'USD' },
            { id: '3', name: 'Savings', number: 'ACC003', type: 'Savings', balance: 75000, currency: 'USD' },
            { id: '4', name: 'Euro Account', number: 'ACC004', type: 'Checking', balance: 50000, currency: 'EUR' },
            { id: '5', name: 'Investment', number: 'ACC005', type: 'Investment', balance: 200000, currency: 'EUR' },
            { id: '6', name: 'Swiss Account', number: 'ACC006', type: 'Savings', balance: 100000, currency: 'CHF' }
          ]);
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

  // Group accounts by currency and calculate totals
  const accountsByCurrency = accounts.reduce((acc, account) => {
    if (!acc[account.currency]) {
      acc[account.currency] = {
        accounts: [],
        total: 0
      };
    }
    acc[account.currency].accounts.push(account);
    acc[account.currency].total += account.balance;
    return acc;
  }, {} as Record<string, { accounts: Account[], total: number }>);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>

      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>Custodians</Tab>
          <Tab>Accounts by Currency</Tab>
        </TabList>

        <TabPanels>
          {/* Custodians Panel */}
          <TabPanel>
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
                    </Tr>
                  </Thead>
                  <Tbody>
                    {custodians.map(custodian => (
                      <Tr key={custodian.id}>
                        <Td fontWeight="semibold">{custodian.name}</Td>
                        <Td>{custodian.code}</Td>
                        <Td>{custodian.description || 'N/A'}</Td>
                        <Td>{custodian.contact_info ? Object.keys(custodian.contact_info).length : 0} entries</Td>
                        <Td>{new Date(custodian.created_at).toLocaleDateString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Accounts by Currency Panel */}
          <TabPanel>
            {Object.keys(accountsByCurrency).length === 0 ? (
              <Text>No accounts found.</Text>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 1, lg: 1 }} spacing={6}>
                {Object.entries(accountsByCurrency).map(([currency, data]) => (
                  <Card key={currency}>
                    <CardBody>
                      <Heading size="md" mb={4}>
                        {currency} - Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(data.total)}
                      </Heading>
                      <TableContainer>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Name</Th>
                              <Th>Account Number</Th>
                              <Th>Type</Th>
                              <Th>Balance</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {data.accounts.map(account => (
                              <Tr key={account.id}>
                                <Td>{account.name}</Td>
                                <Td>{account.number}</Td>
                                <Td>{account.type}</Td>
                                <Td>{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(account.balance)}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Dashboard;
