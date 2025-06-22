import { Box, Alert, AlertIcon, AlertTitle, CloseButton, VStack } from '@chakra-ui/react';
import { useNotifications } from '../shared/hooks';

const Notifications = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <Box
      position="fixed"
      top="20px"
      right="20px"
      zIndex="toast"
      maxWidth="400px"
    >
      <VStack spacing={2} align="stretch">
        {notifications.map(notification => (
          <Alert
            key={notification.id}
            status={notification.type}
            variant="solid"
            borderRadius="md"
          >
            <AlertIcon />
            <AlertTitle>{notification.message}</AlertTitle>
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => removeNotification(notification.id)}
            />
          </Alert>
        ))}
      </VStack>
    </Box>
  );
};

export default Notifications;