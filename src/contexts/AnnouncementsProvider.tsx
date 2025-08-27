'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Theme } from '@/hooks/useThemeQueries';

interface Button {
  label: string;
  type: 'primary' | 'secondary';
  behavior: 'close' | 'redirect';
  redirectUrl?: string;
}

interface AnnouncementFormData {
  title: string;
  content: string;
  themeId: string | null;
  placement: 'modal' | 'toast' | 'tooltip';
  buttons: Button[];
}

interface AnnouncementsContextType {
  // Form data
  formData: AnnouncementFormData;
  updateFormData: (updates: Partial<AnnouncementFormData>) => void;

  // Theme management
  theme: Theme | null;
  isLoadingTheme: boolean;

  // API operations
  createAnnouncement: (data: AnnouncementFormData) => Promise<void>;
  updateAnnouncement: (id: string, data: AnnouncementFormData) => Promise<void>;
  loadAnnouncement: (id: string) => Promise<void>;

  // Loading states
  isCreating: boolean;
  isUpdating: boolean;
  isLoading: boolean;

  // Errors
  error: Error | null;

  // Reset form
  resetForm: () => void;
}

const AnnouncementsContext = createContext<AnnouncementsContextType | undefined>(undefined);

// Default theme configuration
const defaultTheme: Theme = {
  id: 'default_theme',
  name: 'Default Theme',
  config: {
    modal: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      titleColor: '#1a1a1a',
    },
    button: {
      backgroundColor: '#007bff',
      textColor: '#ffffff',
      borderRadius: '8px',
    },
    secondaryButton: {
      backgroundColor: '#ffffff',
      textColor: '#6c757d',
      borderColor: '#6c757d',
      borderRadius: '8px',
    },
  },
  accountId: 'account_1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
} as Theme;

const defaultFormData: AnnouncementFormData = {
  title: '',
  content: '',
  themeId: null,
  placement: 'modal',
  buttons: [{ label: 'Got it', type: 'primary', behavior: 'close' }],
};

interface AnnouncementsProviderProps {
  children: ReactNode;
  accountId: string;
}

export function AnnouncementsProvider({ children, accountId }: AnnouncementsProviderProps) {
  const [formData, setFormData] = useState<AnnouncementFormData>(defaultFormData);
  const [theme, setTheme] = useState<Theme | null>(defaultTheme);
  const [isLoadingTheme, setIsLoadingTheme] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load theme when themeId changes
  useEffect(() => {
    const loadTheme = async () => {
      if (!formData.themeId) {
        setTheme(defaultTheme);
        return;
      }

      setIsLoadingTheme(true);
      try {
        const response = await fetch(`/api/themes/${formData.themeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch theme');
        }
        const themeData = await response.json();
        setTheme(themeData);
      } catch (error) {
        console.error('Failed to load theme:', error);
        setTheme(defaultTheme);
      } finally {
        setIsLoadingTheme(false);
      }
    };

    loadTheme();
  }, [formData.themeId]);

  const updateFormData = useCallback((updates: Partial<AnnouncementFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const createAnnouncement = useCallback(async (data: AnnouncementFormData) => {
    setIsCreating(true);
    setError(null);
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          themeId: data.themeId || undefined,
          placement: data.placement,
          buttons: data.buttons,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create announcement');
      }

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create announcement');
      setError(error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateAnnouncement = useCallback(async (id: string, data: AnnouncementFormData) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          themeId: data.themeId || undefined,
          placement: data.placement,
          buttons: data.buttons,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update announcement');
      }

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update announcement');
      setError(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const loadAnnouncement = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/announcements/${id}`);
      if (!response.ok) {
        throw new Error('Failed to load announcement');
      }

      const announcement = await response.json();

      // Update form data with loaded announcement
      setFormData({
        title: announcement.title,
        content: announcement.message,
        themeId: announcement.themeId || null,
        placement: announcement.placement || 'modal',
        buttons: announcement.buttons || [{ label: 'Got it', type: 'primary', behavior: 'close' }],
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load announcement');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setError(null);
  }, []);

  const value: AnnouncementsContextType = {
    formData,
    updateFormData,
    theme,
    isLoadingTheme,
    createAnnouncement,
    updateAnnouncement,
    loadAnnouncement,
    isCreating,
    isUpdating,
    isLoading,
    error,
    resetForm,
  };

  return (
    <AnnouncementsContext.Provider value={value}>
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  const context = useContext(AnnouncementsContext);
  if (context === undefined) {
    throw new Error('useAnnouncements must be used within an AnnouncementsProvider');
  }
  return context;
}
