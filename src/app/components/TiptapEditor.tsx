'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import ResizeImage from 'tiptap-extension-resize-image';
import YouTube from '@tiptap/extension-youtube';

import { Box, Paper, ToggleButton, ToggleButtonGroup, Divider, IconButton, Tooltip } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Title,
  CheckBox,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Image as ImageIcon,
  VideoLibrary,
} from '@mui/icons-material';
import { ImageUploadModal } from './ImageUploadModal';
import './TiptapEditor.css';
import { useState } from 'react';
import { VideoUploadModal } from './VideoUploadModal';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
}

export const TiptapEditor = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  minHeight = 120,
  maxHeight
}: TiptapEditorProps) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      ResizeImage.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      YouTube.configure({
        controls: false,
        nocookie: true,
        HTMLAttributes: {
          class: 'editor-video',
        },
      }),

      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),

    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none',
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
    enableCoreExtensions: true,
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleTaskList = () => editor.chain().focus().toggleTaskList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const setHeading = (level: 1 | 2 | 3) => editor.chain().focus().toggleHeading({ level }).run();
  const setTextAlign = (align: 'left' | 'center' | 'right') => editor.chain().focus().setTextAlign(align).run();

  const handleImageUpload = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
  };

  const handleVideoUpload = (videoUrl: string) => {
    // Follow the example exactly - pass the original YouTube URL
    editor.commands.setYoutubeVideo({
      src: videoUrl,
      width: 560,
      height: 315,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        minHeight,
        '&:hover': {
          borderColor: 'action.hover',
        },
        '&:focus-within': {
          borderColor: 'primary.main',
          borderWidth: '2px',
        },
      }}
    >
      {/* Toolbar */}
      <Box sx={{
        p: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        gap: 0.5,
        flexWrap: 'wrap'
      }}>
        {/* Text Formatting */}
        <ToggleButtonGroup size="small" sx={{ '& .MuiToggleButton-root': { px: 1 } }}>
          <ToggleButton
            value="bold"
            selected={editor.isActive('bold')}
            onClick={toggleBold}
            size="small"
          >
            <FormatBold fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="italic"
            selected={editor.isActive('italic')}
            onClick={toggleItalic}
            size="small"
          >
            <FormatItalic fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Headings */}
        <ToggleButtonGroup size="small" sx={{ '& .MuiToggleButton-root': { px: 1 } }}>
          <ToggleButton
            value="h1"
            selected={editor.isActive('heading', { level: 1 })}
            onClick={() => setHeading(1)}
            size="small"
          >
            <Title fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="h2"
            selected={editor.isActive('heading', { level: 2 })}
            onClick={() => setHeading(2)}
            size="small"
          >
            <Title fontSize="small" sx={{ fontSize: '0.75rem' }} />
          </ToggleButton>
          <ToggleButton
            value="h3"
            selected={editor.isActive('heading', { level: 3 })}
            onClick={() => setHeading(3)}
            size="small"
          >
            <Title fontSize="small" sx={{ fontSize: '0.625rem' }} />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Lists */}
        <ToggleButtonGroup size="small" sx={{ '& .MuiToggleButton-root': { px: 1 } }}>
          <ToggleButton
            value="bulletList"
            selected={editor.isActive('bulletList')}
            onClick={toggleBulletList}
            size="small"
          >
            <FormatListBulleted fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="orderedList"
            selected={editor.isActive('orderedList')}
            onClick={toggleOrderedList}
            size="small"
          >
            <FormatListNumbered fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="taskList"
            selected={editor.isActive('taskList')}
            onClick={toggleTaskList}
            size="small"
          >
            <CheckBox fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Text Alignment */}
        <ToggleButtonGroup size="small" sx={{ '& .MuiToggleButton-root': { px: 1 } }}>
          <ToggleButton
            value="left"
            selected={editor.isActive({ textAlign: 'left' })}
            onClick={() => setTextAlign('left')}
            size="small"
          >
            <FormatAlignLeft fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="center"
            selected={editor.isActive({ textAlign: 'center' })}
            onClick={() => setTextAlign('center')}
            size="small"
          >
            <FormatAlignCenter fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="right"
            selected={editor.isActive({ textAlign: 'right' })}
            onClick={() => setTextAlign('right')}
            size="small"
          >
            <FormatAlignRight fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Other Formatting */}
        <ToggleButtonGroup size="small" sx={{ '& .MuiToggleButton-root': { px: 1 } }}>
          <ToggleButton
            value="blockquote"
            selected={editor.isActive('blockquote')}
            onClick={toggleBlockquote}
            size="small"
          >
            <FormatQuote fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="code"
            selected={editor.isActive('code')}
            onClick={toggleCode}
            size="small"
          >
            <Code fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Media */}
        <Tooltip title="Add Image">
          <IconButton
            size="small"
            onClick={() => setImageModalOpen(true)}
            sx={{ px: 1 }}
          >
            <ImageIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Video">
          <IconButton
            size="small"
            onClick={() => setVideoModalOpen(true)}
            sx={{ px: 1 }}
          >
            <VideoLibrary fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Editor Content */}
      <Box sx={{
        p: 2,
        maxHeight: maxHeight ? maxHeight - 80 : 'none',
        overflowY: maxHeight ? 'auto' : 'visible'
      }}>
        <EditorContent
          editor={editor}
          style={{
            outline: 'none',
            minHeight: minHeight - 80, // Account for padding and toolbar
          }}
        />
      </Box>

      <ImageUploadModal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onUpload={handleImageUpload}
      />
      <VideoUploadModal
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onVideoAdd={handleVideoUpload}
      />
    </Paper>
  );
};
