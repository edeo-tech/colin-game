import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { ReactQueryProvider } from './lib/react-query'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a2e',
            color: '#f0f0f0',
            border: '1px solid #252543',
          },
          success: {
            iconTheme: {
              primary: '#34d399',
              secondary: '#1a1a2e',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#1a1a2e',
            },
          },
        }}
      />
    </ReactQueryProvider>
  </StrictMode>,
)
