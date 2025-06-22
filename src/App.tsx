import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import Layout from './components/Layout';

// Lazy load route components for better performance
const Dashboard = lazy(() => import('./routes/Dashboard'));
const Positions = lazy(() => import('./routes/Positions'));
const Transactions = lazy(() => import('./routes/Transactions'));
const Accounts = lazy(() => import('./routes/Accounts'));

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
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/accounts" element={<Accounts />} />
          
          {/* Redirect to dashboard for any unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;