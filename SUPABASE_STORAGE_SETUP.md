# Supabase Storage Setup Guide

## Overview

This project uses Supabase Storage to handle image uploads for announcements. Images are stored in a bucket called `announcements` and are organized by user ID.

## Setup Instructions

### 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Set the following:
   - **Name**: `announcements`
   - **Public bucket**: ✅ Checked (so images can be accessed publicly)
   - **File size limit**: 5MB (or your preferred limit)
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`

### 2. Configure Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies:

#### Policy 1: Allow authenticated users to upload images
```sql
CREATE POLICY "Users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'announcements' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 2: Allow public read access to images
```sql
CREATE POLICY "Public read access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'announcements');
```

#### Policy 3: Allow users to delete their own images
```sql
CREATE POLICY "Users can delete their own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'announcements' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Environment Variables

Make sure your `.env.local` file includes:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How It Works

### File Organization
- Images are stored in the format: `{user_id}/{timestamp}.{extension}`
- Example: `user123/1703123456789.jpg`

### Upload Process
1. User drags and drops or pastes an image into the editor
2. File is validated (type and size)
3. File is uploaded to Supabase Storage
4. Public URL is returned and image is inserted into the editor

### Security Features
- **Authentication**: Only authenticated users can upload
- **File type validation**: Only images (JPEG, PNG, GIF, WebP) allowed
- **File size limit**: 5MB maximum
- **User isolation**: Users can only access their own uploaded images
- **Public read access**: Images can be viewed by anyone (for announcements)

## API Endpoint

The upload functionality uses the `/api/upload` endpoint which:
- Validates the uploaded file
- Checks user authentication
- Uploads to Supabase Storage
- Returns the public URL

## Usage in Editor

Users can now:
- **Drag and drop** images directly into the editor
- **Paste** images from clipboard
- Images are automatically uploaded and inserted

## Troubleshooting

### Common Issues

1. **"Failed to upload file" error**
   - Check if the storage bucket exists
   - Verify storage policies are set correctly
   - Check file size and type restrictions

2. **"Unauthorized" error**
   - Ensure user is authenticated
   - Check if the user has proper permissions

3. **Images not displaying**
   - Verify the bucket is public
   - Check if the public URL is being generated correctly

### Testing

To test the upload functionality:
1. Create an announcement
2. Drag an image file into the editor
3. The image should upload and appear in the editor
4. Check the Supabase Storage dashboard to see the uploaded file
