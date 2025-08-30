'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    accountName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (authData.user) {
        // Create account and user records in your database
        const response = await fetch('/api/auth/setup-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: authData.user.id,
            name: formData.name,
            accountName: formData.accountName,
            email: formData.email,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to create account')
          return
        }

        // Redirect to dashboard
        router.push('/modal')
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
          maxWidth: 450,
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
            Create your account
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '14px',
            }}
          >
            Get started with Notifications.fyi
          </Typography>
        </Box>

        <form onSubmit={handleSignUp}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, fontSize: '14px' }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Full Name"
            value={formData.name}
            onChange={handleInputChange('name')}
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
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange('email')}
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
            label="Account Name"
            value={formData.accountName}
            onChange={handleInputChange('accountName')}
            required
            helperText="This will be your workspace name"
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
              '& .MuiFormHelperText-root': {
                fontSize: '12px',
                color: '#666',
              },
            }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange('password')}
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
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
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
              'Create account'
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
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
