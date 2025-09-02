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

export default function OnboardingPage() {
  const saveToBackend = async (elements: CapturedElement[]) => {
    const response = await fetch('/api/selectors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectors: elements }),
    });

    if (!response.ok) {
      throw new Error('Failed to save');
    }
  };

  return (
    <ElementInspector
      title="Enter a URL to start inspecting"
      description="Load any website with the widget installed to begin selecting elements"
      onSave={saveToBackend}
      showBackButton={false}
    />
  );
}
