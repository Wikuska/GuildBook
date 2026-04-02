import { useState } from 'react';
import { AuthSidebar } from '../components/auth/AuthSidebar';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

export function AuthPage() {
  const token = useAuthStore((state) => state.token);
  // if (token) return <Navigate to='/feed' replace />
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 font-sans text-parchment">
      <div className="flex w-full max-w-225 min-h-150 overflow-hidden rounded-lg border-[0.5px] border-border-base bg-bg-deep">
        
        <AuthSidebar />
        
        <div className="flex flex-1 flex-col justify-center px-8 py-10 md:px-12">
          <div className="mb-8 flex border-b-[0.5px] border-border-base">
            <button
              onClick={() => setActiveTab('login')}
              className={`px-5 py-2 text-[13px] uppercase tracking-[1.5px] transition-colors duration-150 cursor-pointer ${
                activeTab === 'login'
                  ? 'border-b-2 border-gold text-gold'
                  : 'border-b-2 border-transparent text-sage hover:text-gold'
              }`}
            >
              Enter the guild
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-5 py-2 text-[13px] uppercase tracking-[1.5px] transition-colors duration-150 cursor-pointer ${
                activeTab === 'register'
                  ? 'border-b-2 border-gold text-gold'
                  : 'border-b-2 border-transparent text-sage hover:text-gold'
              }`}
            >
              New member
            </button>
          </div>

          {activeTab === 'login' ? <LoginForm /> : <RegisterForm onSuccess={() => setActiveTab('login')}/>}
          
        </div>
      </div>
    </div>
  );
}