import { useState } from 'react';
import {type BaseSyntheticEvent} from 'react';
import { useMutation } from '@tanstack/react-query';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { loginUser } from '../../api/auth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log('Zalogowano! Token:', data.access_token);
    },
  });

  const handleSubmit = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    mutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {mutation.isError && (
        <div className="mb-4 rounded border border-red-900 bg-red-950/30 p-2 text-center text-[12px] text-red-500">
          {mutation.error.message}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <div className="mb-4 mt-3 cursor-pointer text-right text-[11px] tracking-[0.5px] text-[#6b5e42] hover:text-[#c9a84c]">
        Forgot your password?
      </div>
      
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Entering...' : 'Enter'}
      </Button>
    </form>
  );
}