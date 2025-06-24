import { lazy, Suspense } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import Layout from './components/Layout';

// Lazy load the main component for better performance
const CustodianPortfolioPositions = lazy(() => import('./routes/CustodianPortfolioPositions'));

// Loading fallback
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
    <Spinner size="xl" />
  </Box>
);

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingFallback />}>
        <CustodianPortfolioPositions />
      </Suspense>
    </Layout>
  );
}

export default App;
