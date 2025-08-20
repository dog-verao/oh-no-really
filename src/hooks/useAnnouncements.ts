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

export interface UpdateAnnouncementData {
  id: string;
  title: string;
  content: string;
  themeId?: string;
  accountId: string;
}

// TODO: account id should come from the auth context, not passed in as a parameter, we need to ensure row level security is enforced
const getAllByAccountId = async (accountId: string): Promise<Announcement[]> => {
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

const getAnnouncementById = async (announcementId: string): Promise<Announcement> => {
  const response = await fetch(`/api/announcements/${announcementId}`);

  if (!response.ok) {
    console.error('Failed to fetch announcement:', response.status, response.statusText);
    throw new Error('Failed to fetch announcement');
  }

  const data = await response.json();
  return data;
};

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

const updateAnnouncement = async (data: UpdateAnnouncementData): Promise<Announcement> => {
  const response = await fetch(`/api/announcements/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update announcement');
  }

  return response.json();
};

// Custom hook for announcements
export const useAnnouncements = (accountId: string) => {
  const queryClient = useQueryClient();

  const {
    data: announcements,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['announcements', accountId],
    queryFn: () => getAllByAccountId(accountId),
    enabled: !!accountId,
  });



  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', accountId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', accountId] });
    },
  });

  return {
    // Query data
    announcements: announcements || [],
    isLoading,
    error,
    refetch,

    getAnnouncementById,

    // Mutation functions
    createAnnouncement: createMutation.mutate,
    createAnnouncementAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // Update functions
    updateAnnouncement: updateMutation.mutate,
    updateAnnouncementAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
