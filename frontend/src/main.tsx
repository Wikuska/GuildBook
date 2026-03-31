import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {AuthPage} from './pages/AuthPage'
import { FeedPage } from './pages/FeedPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import './index.css'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
