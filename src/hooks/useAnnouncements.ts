import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  themeId?: string;
  createdBy?: string;
  buttons?: Array<{
    label: string;
    type: 'primary' | 'secondary';
    behavior: 'close' | 'redirect';
    redirectUrl?: string;
  }>;
  draft: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  themeId?: string;
  createdBy?: string;
  buttons?: Array<{
    label: string;
    type: 'primary' | 'secondary';
    behavior: 'close' | 'redirect';
    redirectUrl?: string;
  }>;
}

export interface UpdateAnnouncementData {
  id: string;
  title: string;
  content: string;
  themeId?: string;
  buttons?: Array<{
    label: string;
    type: 'primary' | 'secondary';
    behavior: 'close' | 'redirect';
    redirectUrl?: string;
  }>;
}


export const getAllByAccountId = async (placement?: string): Promise<Announcement[]> => {
  const url = placement ? `/api/announcements?placement=${placement}` : '/api/announcements';
  console.log('Fetching announcements with URL:', url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch announcements');
  }

  return response.json();
};

const getAnnouncementById = async (announcementId: string): Promise<Announcement> => {
  const response = await fetch(`/api/announcements/${announcementId}`);

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
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update announcement');
  }

  return response.json();
};

const deleteAnnouncement = async (announcementId: string, accountId: string): Promise<void> => {
  const response = await fetch(`/api/announcements/${announcementId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete announcement');
  }
};

const publishAnnouncement = async (announcementId: string, accountId: string): Promise<Announcement> => {
  const response = await fetch(`/api/announcements/${announcementId}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to publish announcement');
  }

  return response.json();
};

// Custom hook for announcements
export const useAnnouncements = (accountId: string, placement?: string) => {
  const queryClient = useQueryClient();

  const {
    data: announcements,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['announcements', accountId, placement],
    queryFn: () => getAllByAccountId(placement),
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
    return getAnnouncementById(announcementId);
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateAnnouncementData) => createAnnouncement(data, accountId),
    onSuccess: () => {
      console.log('Invalidating queries for placement:', placement);
      queryClient.invalidateQueries({ queryKey: ['announcements', accountId, placement] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateAnnouncementData) => updateAnnouncement(data, accountId),
    onSuccess: () => {
      console.log('Invalidating queries for placement:', placement);
      queryClient.invalidateQueries({ queryKey: ['announcements', accountId, placement] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (announcementId: string) => deleteAnnouncement(announcementId, accountId),
    onSuccess: () => {
      console.log('Invalidating queries for placement:', placement);
      queryClient.invalidateQueries({ queryKey: ['announcements', accountId, placement] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (announcementId: string) => publishAnnouncement(announcementId, accountId),
    onSuccess: () => {
      console.log('Invalidating queries for placement:', placement);
      queryClient.invalidateQueries({ queryKey: ['announcements', accountId, placement] });
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

    // Delete functions
    deleteAnnouncement: deleteMutation.mutate,
    deleteAnnouncementAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,

    // Publish functions
    publishAnnouncement: publishMutation.mutate,
    publishAnnouncementAsync: publishMutation.mutateAsync,
    isPublishing: publishMutation.isPending,
    publishError: publishMutation.error,
  };
};
