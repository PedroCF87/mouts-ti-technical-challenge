import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export function useUsersQuery() {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['users', token],
    queryFn: () => getUsers(token),
    enabled: !!token
  })
}
