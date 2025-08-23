import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Theme {
  id: string;
  name: string;
  config: {
    modal: {
      backgroundColor: string;
      borderRadius: string;
      titleColor: string;
    };
    button: {
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
    };
    secondaryButton: {
      backgroundColor: string;
      textColor: string;
      borderColor: string;
      borderRadius: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateThemeData {
  name: string;
  config: {
    modal: {
      backgroundColor: string;
      borderRadius: string;
      titleColor: string;
    };
    button: {
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
    };
    secondaryButton: {
      backgroundColor: string;
      textColor: string;
      borderColor: string;
      borderRadius: string;
    };
  };
}

export interface UpdateThemeData {
  id: string;
  name: string;
  config: {
    modal: {
      backgroundColor: string;
      borderRadius: string;
      titleColor: string;
    };
    button: {
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
    };
    secondaryButton: {
      backgroundColor: string;
      textColor: string;
      borderColor: string;
      borderRadius: string;
    };
  };
}

const getAllByAccountId = async (): Promise<Theme[]> => {
  const response = await fetch('/api/themes');

  if (!response.ok) {
    throw new Error('Failed to fetch themes');
  }

  return response.json();
};

const getThemeById = async (themeId: string): Promise<Theme> => {
  const response = await fetch(`/api/themes/${themeId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch theme');
  }

  const data = await response.json();
  return data;
};

const createTheme = async (data: CreateThemeData): Promise<Theme> => {
  const response = await fetch('/api/themes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create theme');
  }

  return response.json();
};

const updateTheme = async (data: UpdateThemeData): Promise<Theme> => {
  const response = await fetch(`/api/themes/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update theme');
  }

  return response.json();
};

const deleteTheme = async (themeId: string): Promise<void> => {
  const response = await fetch(`/api/themes/${themeId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete theme');
  }
};

// Custom hook for themes
export const useThemeQueries = (accountId: string) => {
  const queryClient = useQueryClient();

  const {
    data: themes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['themes', accountId],
    queryFn: () => getAllByAccountId(),
    enabled: !!accountId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateThemeData) => createTheme(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes', accountId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateThemeData) => updateTheme(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes', accountId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (themeId: string) => deleteTheme(themeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes', accountId] });
    },
  });

  return {
    // Query data
    themes: themes || [],
    isLoading,
    error,
    refetch,

    // Query functions
    getThemeById,

    // Mutation functions
    createTheme: createMutation.mutate,
    createThemeAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // Update functions
    updateTheme: updateMutation.mutate,
    updateThemeAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    // Delete functions
    deleteTheme: deleteMutation.mutate,
    deleteThemeAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
