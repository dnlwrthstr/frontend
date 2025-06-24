import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Spinner, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, ModalFooter, useToast, TableContainer, Select } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import portfoliosApi, { Portfolio, CreatePortfolioRequest } from '../api/portfoliosApi';
import custodiansApi, { Custodian } from '../api/custodiansApi';

const Portfolios = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [newPortfolio, setNewPortfolio] = useState<CreatePortfolioRequest>({ 
    portfolio_id: '', 
    name: '', 
    description: '', 
    currency: 'USD',
    custodian_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch custodians first
        const custodiansData = await custodiansApi.getCustodians();
        setCustodians(custodiansData);

        if (custodiansData.length === 0) {
          toast({
            title: "No custodians found",
            description: "You need to create a custodian before creating portfolios.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
          setLoading(false);
          return;
        }

        // Set default custodian for new portfolio
        setNewPortfolio(prev => ({
          ...prev,
          custodian_id: custodiansData[0].id
        }));

        // Fetch portfolios for all custodians
        const portfolioPromises = custodiansData.map(custodian => 
          portfoliosApi.getPortfolios(custodian.id)
        );

        const portfolioResults = await Promise.all(portfolioPromises);
        const allPortfolios = portfolioResults.flat();

        setPortfolios(allPortfolios);

        if (allPortfolios.length === 0) {
          toast({
            title: "No portfolios found",
            description: "There are no portfolios in the system.",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Portfolios loaded",
            description: `Successfully loaded ${allPortfolios.length} portfolios.`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleCreatePortfolio = async () => {
    try {
      const createdPortfolio = await portfoliosApi.createPortfolio(newPortfolio);
      setPortfolios([...portfolios, createdPortfolio]);

      toast({
        title: "Portfolio created",
        description: `Successfully created portfolio: ${createdPortfolio.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setNewPortfolio({ 
        portfolio_id: '', 
        name: '', 
        description: '', 
        currency: 'USD',
        custodian_id: custodians.length > 0 ? custodians[0].id : ''
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

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box>
      <Heading mb={6}>Portfolios</Heading>

      <Button colorScheme="teal" mb={4} onClick={onOpen}>
        Create New Portfolio
      </Button>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Portfolio ID</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Currency</Th>
              <Th>Custodian</Th>
              <Th>Created At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {portfolios.map((portfolio) => (
              <Tr key={portfolio.id}>
                <Td>{portfolio.id}</Td>
                <Td>{portfolio.portfolio_id}</Td>
                <Td>{portfolio.name}</Td>
                <Td>{portfolio.description || '-'}</Td>
                <Td>{portfolio.currency}</Td>
                <Td>
                  {custodians.find(c => c.id === portfolio.custodian_id)?.name || portfolio.custodian_id}
                </Td>
                <Td>{new Date(portfolio.created_at).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Create Portfolio Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
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

            <FormControl mb={4}>
              <FormLabel>Custodian</FormLabel>
              <Select
                value={newPortfolio.custodian_id}
                onChange={(e) => setNewPortfolio({...newPortfolio, custodian_id: e.target.value})}
              >
                {custodians.map(custodian => (
                  <option key={custodian.id} value={custodian.id}>
                    {custodian.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePortfolio}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Portfolios;
