import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Spinner, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, ModalFooter, Text, useToast, TableContainer } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import custodiansApi, { Custodian, CreateCustodianRequest } from '../api/custodiansApi';

const Custodians = () => {
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [newCustodian, setNewCustodian] = useState<CreateCustodianRequest>({ 
    name: '', 
    code: '', 
    description: '', 
    contact_info: {}, 
    api_credentials: {} 
  });

  useEffect(() => {
    const fetchCustodians = async () => {
      try {
        setLoading(true);
        const custodians = await custodiansApi.getCustodians();
        setCustodians(custodians);
        if (custodians.length === 0) {
          toast({
            title: "No custodians found",
            description: "There are no custodians in the system.",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Custodians loaded",
            description: `Successfully loaded ${custodians.length} custodians.`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (err) {
        setError('Failed to fetch custodians');
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to fetch custodians. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustodians();
  }, [toast]);

  const handleCreateCustodian = async () => {
    try {
      const createdCustodian = await custodiansApi.createCustodian(newCustodian);
      setCustodians([...custodians, createdCustodian]);

      toast({
        title: "Custodian created",
        description: `Successfully created custodian: ${createdCustodian.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setNewCustodian({ 
        name: '', 
        code: '', 
        description: '', 
        contact_info: {}, 
        api_credentials: {} 
      });
    } catch (err) {
      console.error('Failed to create custodian:', err);
      toast({
        title: "Error",
        description: "Failed to create custodian. Please try again.",
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
      <Heading mb={6}>Custodians</Heading>

      <Button colorScheme="teal" mb={4} onClick={onOpen}>
        Create New Custodian
      </Button>

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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Custodian</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input 
                value={newCustodian.name} 
                onChange={(e) => setNewCustodian({...newCustodian, name: e.target.value})} 
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Code</FormLabel>
              <Input 
                value={newCustodian.code} 
                onChange={(e) => setNewCustodian({...newCustodian, code: e.target.value})} 
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input 
                value={newCustodian.description} 
                onChange={(e) => setNewCustodian({...newCustodian, description: e.target.value})}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateCustodian}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Custodians;
