import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { NotificationsProvider } from './shared/NotificationsProvider'
import Notifications from './components/Notifications'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <NotificationsProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
          <Notifications />
        </BrowserRouter>
      </NotificationsProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
