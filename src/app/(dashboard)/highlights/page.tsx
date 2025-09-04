'use client';

import { ElementInspectorProvider } from '@/providers/ElementInspectorProvider';
import ElementInspector from '../../components/Inspector/ElementInspector';

interface CapturedElement {
  id: string;
  label: string;
  selector: string;
  tagName: string;
  text: string;
  timestamp: number;
}

export default function HighlightsPage() {
  const saveToBackend = async (elements: CapturedElement[]) => {
    const response = await fetch('/api/highlights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ highlights: elements }),
    });

    if (!response.ok) {
      throw new Error('Failed to save');
    }
  };

  return (
    <ElementInspectorProvider>
      <ElementInspector
        title="Select elements to highlight"
        description="Choose elements on your page that should be highlighted to draw attention"
        onSave={saveToBackend}
        showBackButton={false}
        isHighlightPage={true}
      />
    </ElementInspectorProvider>
  );
}
