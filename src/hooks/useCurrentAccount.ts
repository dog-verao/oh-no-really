'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';

interface Account {
  id: string;
  name: string;
  apiKey: string;
}

interface UseCurrentAccountReturn {
  account: Account | null;
  isLoading: boolean;
  error: Error | null;
}

export function useCurrentAccount(): UseCurrentAccountReturn {
  const { data: account, isLoading, error } = useQuery({
    queryKey: ['currentAccount'],
    queryFn: async (): Promise<Account | null> => {
      const supabase = createClient();

      // Get the current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return null;
      }

      // Get the user's account through the AccountUser relationship
      const response = await fetch('/api/auth/current-account', {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch current account');
      }

      const data = await response.json();
      return data.account;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    account: account || null,
    isLoading,
    error: error as Error | null,
  };
}
