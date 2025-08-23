'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/announcements')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'white',
          borderRadius: 2,
          padding: 4,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              mb: 1,
            }}
          >
            Welcome back
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '14px',
            }}
          >
            Sign in to your Notifications.fyi account
          </Typography>
        </Box>

        <form onSubmit={handleSignIn}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, fontSize: '14px' }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#bdbdbd',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
              '& .MuiInputLabel-root': {
                fontSize: '14px',
              },
            }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#bdbdbd',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
              '& .MuiInputLabel-root': {
                fontSize: '14px',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              backgroundColor: '#1a1a1a',
              '&:hover': {
                backgroundColor: '#333',
              },
              '&:disabled': {
                backgroundColor: '#e0e0e0',
                color: '#999',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '14px',
            }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
