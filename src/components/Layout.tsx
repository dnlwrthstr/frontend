import { Box, Flex, Heading, Container } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh">
      <Flex as="nav" bg="teal.500" color="white" p={4} align="center">
        <Heading size="md">Custodian Service</Heading>
      </Flex>
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
