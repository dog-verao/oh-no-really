'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, Paper, ToggleButton, ToggleButtonGroup, Divider } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Title,
} from '@mui/icons-material';
import './TiptapEditor.css';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export const TiptapEditor = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  minHeight = 120
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
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
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const setHeading = (level: 1 | 2 | 3) => editor.chain().focus().toggleHeading({ level }).run();

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
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

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
      </Box>

      {/* Editor Content */}
      <Box sx={{ p: 2 }}>
        <EditorContent
          editor={editor}
          style={{
            outline: 'none',
            minHeight: minHeight - 80, // Account for padding and toolbar
          }}
        />
      </Box>
    </Paper>
  );
};
