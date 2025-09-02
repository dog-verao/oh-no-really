'use client';

import ElementInspector from '../../components/ElementInspector';

interface CapturedElement {
  id: string;
  label: string;
  selector: string;
  tagName: string;
  text: string;
  timestamp: number;
}

export default function TagsPage() {
  const saveToBackend = async (elements: CapturedElement[]) => {
    const response = await fetch('/api/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: elements }),
    });

    if (!response.ok) {
      throw new Error('Failed to save');
    }
  };

  return (
    <ElementInspector
      title="Select elements to tag"
      description="Choose elements on your page that should be tagged for categorization"
      onSave={saveToBackend}
      showBackButton={false}
    />
  );
}
