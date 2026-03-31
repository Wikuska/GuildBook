import { useState } from 'react';
import { AuthSidebar } from '../components/auth/AuthSidebar';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050403] p-4 font-sans text-[#d4c4a0]">
      <div className="flex w-full max-w-225 min-h-150 overflow-hidden rounded-lg border-[0.5px] border-[#2a2520] bg-[#0e0c0a]">
        
        <AuthSidebar />
        
        <div className="flex flex-1 flex-col justify-center px-8 py-10 md:px-12">
          <div className="mb-8 flex border-b-[0.5px] border-[#2a2520]">
            <button
              onClick={() => setActiveTab('login')}
              className={`px-5 py-2 text-[13px] uppercase tracking-[1.5px] transition-colors duration-150 ${
                activeTab === 'login'
                  ? 'border-b-2 border-[#c9a84c] text-[#c9a84c]'
                  : 'border-b-2 border-transparent text-[#6b5e42] hover:text-[#c9a84c]'
              }`}
            >
              Enter the guild
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-5 py-2 text-[13px] uppercase tracking-[1.5px] transition-colors duration-150 ${
                activeTab === 'register'
                  ? 'border-b-2 border-[#c9a84c] text-[#c9a84c]'
                  : 'border-b-2 border-transparent text-[#6b5e42] hover:text-[#c9a84c]'
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