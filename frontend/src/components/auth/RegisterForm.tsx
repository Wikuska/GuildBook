import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { RaceSelector } from './RaceSelector';
import { registerUser } from '../../api/auth';
import { registerSchema, type RegisterFormData } from '../../validations/auth';
import { ApiError } from '../../api/client';

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({onSuccess} : RegisterFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { race_id: 0 }
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: onSuccess,
    });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...payload } = data;
    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      {(mutation.isError && mutation.error instanceof ApiError && mutation.error.status < 500) && (
        <div className="mb-2 rounded border border-red-900 bg-red-950/30 p-2 text-[12px] text-red-500">
          {mutation.error.message}
        </div>
      )}
      
      <div className="flex gap-4">
        <Input label="Username" {...register('username')} error={errors.username?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      </div>

      <div className="flex gap-4">
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
        <Input label="Confirm Password" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
      </div>

      <RaceSelector
        selectedRaceId={watch('race_id')}
        onSelectRace={(id) => setValue('race_id', id, { shouldValidate: true })}
        error={errors.race_id?.message}
      />

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Joining...' : 'Join the guild'}
      </Button>
    </form>
  );
}