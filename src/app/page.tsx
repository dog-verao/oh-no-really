'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Box, CircularProgress, Typography } from '@mui/material'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard/announcements')
      } else {
        router.push('/auth/signin')
      }
    }
  }, [user, loading, router])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: '#1a1a1a',
          mb: 2,
        }}
      >
        Notifications.fyi
      </Typography>
      <CircularProgress size={24} />
    </Box>
  )
}
