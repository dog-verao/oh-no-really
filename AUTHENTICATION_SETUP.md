# Authentication Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Configuration
DATABASE_URL=your_database_connection_string
```

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Add them to your `.env.local` file

## Database Schema

The authentication system works with your existing Prisma schema. Make sure your database is set up with the required tables:

- `User` - Stores user information
- `Account` - Stores workspace/account information
- `AccountUser` - Links users to accounts with roles

## Features

- **Sign In/Sign Up**: Clean, minimalist forms with Notion-inspired design
- **Account Creation**: Automatic account and workspace setup on registration
- **Session Management**: Persistent sessions with automatic refresh
- **Route Protection**: Middleware protects dashboard routes
- **User Profile**: Shows user info and sign-out option in sidebar

## Usage

1. Users can sign up at `/auth/signup`
2. Users can sign in at `/auth/signin`
3. Authenticated users are redirected to `/dashboard`
4. Unauthenticated users are redirected to sign-in page

## API Endpoints

- `POST /api/auth/setup-account` - Creates account and user records after Supabase auth
