import { useState, useCallback, useEffect } from 'react';
import { PromptPreset } from '../types';

const STORAGE_KEY = 'prompt_presets';

const DEFAULT_PRESETS: PromptPreset[] = [
  {
    id: 'code-review',
    name: 'Code Review',
    prompt: 'Bitte führe ein Code-Review durch und gib konstruktives Feedback zu:\n\n{selection}',
    icon: '🔍',
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: 'explain-simple',
    name: 'Einfach Erklären',
    prompt: 'Erkläre das folgende in einfachen Worten:\n\n{selection}',
    icon: '💡',
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: 'summarize',
    name: 'Zusammenfassen',
    prompt: 'Fasse das folgende zusammen:\n\n{selection}',
    icon: '📝',
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: 'improve',
    name: 'Verbessern',
    prompt: 'Verbessere den folgenden Text:\n\n{selection}',
    icon: '✨',
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: 'translate-en',
    name: 'Zu Englisch',
    prompt: 'Übersetze das folgende zu Englisch:\n\n{selection}',
    icon: '🇬🇧',
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: 'translate-de',
    name: 'Zu Deutsch',
    prompt: 'Übersetze das folgende zu Deutsch:\n\n{selection}',
    icon: '🇩🇪',
    isDefault: true,
    createdAt: new Date(),
  },
];

export interface UsePromptPresetsReturn {
  presets: PromptPreset[];
  addPreset: (name: string, prompt: string, icon?: string) => void;
  updatePreset: (id: string, name: string, prompt: string, icon?: string) => void;
  deletePreset: (id: string) => void;
  applyPreset: (preset: PromptPreset, selection?: string) => string;
}

export function usePromptPresets(): UsePromptPresetsReturn {
  const [presets, setPresets] = useState<PromptPreset[]>([]);

  // Load presets from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const presetsWithDates = parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
        }));
        setPresets(presetsWithDates);
      } catch (error) {
        console.error('Failed to load presets:', error);
        setPresets(DEFAULT_PRESETS);
      }
    } else {
      setPresets(DEFAULT_PRESETS);
    }
  }, []);

  // Save presets to localStorage whenever they change
  const savePresets = useCallback((newPresets: PromptPreset[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPresets));
      setPresets(newPresets);
    } catch (error) {
      console.error('Failed to save presets:', error);
    }
  }, []);

  const addPreset = useCallback(
    (name: string, prompt: string, icon?: string) => {
      const newPreset: PromptPreset = {
        id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        prompt,
        icon,
        isDefault: false,
        createdAt: new Date(),
      };
      savePresets([...presets, newPreset]);
    },
    [presets, savePresets]
  );

  const updatePreset = useCallback(
    (id: string, name: string, prompt: string, icon?: string) => {
      const updated = presets.map((p) =>
        p.id === id ? { ...p, name, prompt, icon } : p
      );
      savePresets(updated);
    },
    [presets, savePresets]
  );

  const deletePreset = useCallback(
    (id: string) => {
      const preset = presets.find((p) => p.id === id);
      if (preset?.isDefault) {
        alert('Standard-Presets können nicht gelöscht werden.');
        return;
      }
      const filtered = presets.filter((p) => p.id !== id);
      savePresets(filtered);
    },
    [presets, savePresets]
  );

  const applyPreset = useCallback((preset: PromptPreset, selection?: string): string => {
    let result = preset.prompt;

    // Replace {selection} variable with actual selection
    if (selection) {
      result = result.replace(/{selection}/g, selection);
    } else {
      // If no selection, remove the {selection} placeholder
      result = result.replace(/{selection}/g, '');
    }

    return result.trim();
  }, []);

  return {
    presets,
    addPreset,
    updatePreset,
    deletePreset,
    applyPreset,
  };
}
