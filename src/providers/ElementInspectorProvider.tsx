import { createContext, useState, ReactNode } from "react";

interface ElementInspectorProviderProps {
  children: ReactNode;
}

type ComponentWithId = { id: string; component: ReactNode };

interface ElementInspectorContextType {
  components?: ComponentWithId[];
  addComponent: (component: ComponentWithId) => void;
  removeComponentById: (id: string) => void;
}

export const ElementInspectorContext = createContext<ElementInspectorContextType | undefined>(undefined);

export function ElementInspectorProvider({ children }: ElementInspectorProviderProps) {
  const [components, setComponents] = useState<ComponentWithId[]>([]);

  const addComponent = (component: ComponentWithId) => {
    setComponents((prev) => [...prev, component]);
  };

  const removeComponentById = (id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
  };

  return <ElementInspectorContext.Provider value={{ components, addComponent, removeComponentById }}>{children}</ElementInspectorContext.Provider>;
}