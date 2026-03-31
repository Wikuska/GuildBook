import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { loginUser } from '../../api/auth';
import { loginSchema, type LoginFormData } from '../../validations/auth';
import { useAuthStore } from '../../store/authStore';

export function LoginForm() {
  const {register, handleSubmit, formState: {errors}} = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      useAuthStore.getState().setToken(data.access_token)
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      {mutation.isError && (
        <div className="mb-4 rounded border border-red-900 bg-red-950/30 p-2 text-center text-[12px] text-red-500">
          {mutation.error.message}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        {...register('email')} error={errors.email?.message}
      />
      
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        {...register('password')} error={errors.password?.message}
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