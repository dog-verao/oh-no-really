import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  themeId?: string;
  userId: string;
  draft: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  themeId?: string;
  accountId: string;
}

// Fetch announcements
const fetchAnnouncements = async (accountId: string): Promise<Announcement[]> => {
  const response = await fetch('/api/announcements', {
    headers: {
      'x-account-id': accountId,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch announcements');
  }

  return response.json();
};

// Create announcement
const createAnnouncement = async (data: CreateAnnouncementData): Promise<Announcement> => {
  const response = await fetch('/api/announcements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create announcement');
  }

  return response.json();
};

// Custom hook for announcements
export const useAnnouncements = (accountId: string) => {
  const queryClient = useQueryClient();

  // Query for fetching announcements
  const {
    data: announcements,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['announcements', accountId],
    queryFn: () => fetchAnnouncements(accountId),
    enabled: !!accountId, // Only run query if accountId is provided
  });

  // Mutation for creating announcements
  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      // Invalidate and refetch announcements after creating a new one
      queryClient.invalidateQueries({ queryKey: ['announcements', accountId] });
    },
  });

  return {
    // Query data
    announcements: announcements || [],
    isLoading,
    error,
    refetch,

    // Mutation functions
    createAnnouncement: createMutation.mutate,
    createAnnouncementAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
