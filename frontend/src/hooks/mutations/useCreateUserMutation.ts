import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@/lib/api';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
      createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/');
    },
    onError: (error: any) => {
      alert(`Erro ao criar usuário: ${error.message}`);
    },
  });
}
