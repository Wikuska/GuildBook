import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {AuthPage} from './pages/AuthPage'
import { FeedPage } from './pages/FeedPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import {Toaster, toast} from 'sonner'
import { ApiError } from './api/client';
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: Error) => {
        if (error instanceof ApiError && error.status < 500) return;
        toast.error('Connection failed', {
          id: 'global-network-error',
          description: 'The gates of the database are closed. Check your internet connection.', 
          duration: Infinity});
      }
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <Toaster position="bottom-right" richColors theme="dark" closeButton/>
        <Routes>
          <Route path='/auth' element={<AuthPage/>}/>
          <Route element={<ProtectedRoute />}>
            <Route path='/feed' element={<FeedPage />}/>
          </Route>
          <Route path='*' element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
