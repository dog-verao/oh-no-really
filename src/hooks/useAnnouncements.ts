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
}

export interface UpdateAnnouncementData {
  id: string;
  title: string;
  content: string;
  themeId?: string;
}


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

const getAnnouncementById = async (announcementId: string, accountId: string): Promise<Announcement> => {
  const response = await fetch(`/api/announcements/${announcementId}`, {
    headers: {
      'x-account-id': accountId,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch announcement');
  }

  const data = await response.json();
  return data;
};

const createAnnouncement = async (data: CreateAnnouncementData, accountId: string): Promise<Announcement> => {
  const response = await fetch('/api/announcements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-account-id': accountId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create announcement');
  }

  return response.json();
};

const updateAnnouncement = async (data: UpdateAnnouncementData, accountId: string): Promise<Announcement> => {
  const response = await fetch(`/api/announcements/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-account-id': accountId,
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

  // Function to get individual announcement with caching
  const getAnnouncementWithCache = async (announcementId: string): Promise<Announcement> => {
    // Check if we have it in the announcements list first
    const existingAnnouncement = announcements?.find(ann => ann.id === announcementId);
    if (existingAnnouncement) {
      return existingAnnouncement;
    }

    // If not found in cache, fetch from API
    return getAnnouncementById(announcementId, accountId);
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateAnnouncementData) => createAnnouncement(data, accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', accountId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateAnnouncementData) => updateAnnouncement(data, accountId),
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

    // Query functions
    getAnnouncementById: getAnnouncementWithCache,

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
