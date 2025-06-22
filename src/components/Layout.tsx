import { Box, Flex, Link, Heading, Spacer, Container } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh">
      <Flex as="nav" bg="teal.500" color="white" p={4} align="center">
        <Heading size="md">Custodian Service</Heading>
        <Spacer />
        <Box>
          <Link as={RouterLink} to="/" mr={4}>Dashboard</Link>
          <Link as={RouterLink} to="/positions" mr={4}>Positions</Link>
          <Link as={RouterLink} to="/transactions" mr={4}>Transactions</Link>
          <Link as={RouterLink} to="/accounts" mr={4}>Accounts</Link>
          <Link as={RouterLink} to="/custodians">Custodians</Link>
        </Box>
      </Flex>
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
