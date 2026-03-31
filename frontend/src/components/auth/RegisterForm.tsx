import { useState } from 'react';
import {type BaseSyntheticEvent} from 'react';
import { useMutation } from '@tanstack/react-query';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { RaceSelector } from './RaceSelector';
import { registerUser } from '../../api/auth';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    race_id: 0
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert('Welcome to the Guild! You can now log in.');
    }
  });

  const handleSubmit = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    if (formData.race_id === 0) {
      alert("Please choose your race!");
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {mutation.isError && (
        <div className="mb-2 rounded border border-red-900 bg-red-950/30 p-2 text-[12px] text-red-500">
          {mutation.error.message}
        </div>
      )}
      
      <div className="flex gap-4">
        <Input 
          label="Username" 
          value={formData.username}
          onChange={e => setFormData({...formData, username: e.target.value})} 
          required 
        />
        <Input 
          label="Email" 
          type="email" 
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})} 
          required 
        />
      </div>

      <div className="flex gap-4">
        <Input 
          label="Password" 
          type="password" 
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})} 
          required 
        />
        <Input 
          label="Confirm Password" 
          type="password" 
          value={formData.confirmPassword}
          onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
          required 
        />
      </div>

      <RaceSelector 
        selectedRaceId={formData.race_id} 
        onSelectRace={(id) => setFormData({...formData, race_id: id})} 
      />

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Joining...' : 'Join the guild'}
      </Button>
    </form>
  );
}