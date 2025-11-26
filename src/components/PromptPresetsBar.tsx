import { useState } from 'react';
import { PromptPreset } from '../types';
import './PromptPresetsBar.scss';

export interface PromptPresetsBarProps {
  presets: PromptPreset[];
  onSelectPreset: (preset: PromptPreset) => void;
  onManagePresets: () => void;
}

export function PromptPresetsBar({
  presets,
  onSelectPreset,
  onManagePresets,
}: PromptPresetsBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visiblePresets = isExpanded ? presets : presets.slice(0, 6);
  const hasMore = presets.length > 6;

  return (
    <div className="prompt-presets-bar">
      <div className="presets-container">
        {visiblePresets.map((preset) => (
          <button
            key={preset.id}
            className="preset-button"
            onClick={() => onSelectPreset(preset)}
            title={preset.prompt}
          >
            {preset.icon && <span className="preset-icon">{preset.icon}</span>}
            <span className="preset-name">{preset.name}</span>
          </button>
        ))}

        {hasMore && !isExpanded && (
          <button
            className="preset-button more-button"
            onClick={() => setIsExpanded(true)}
            title="Mehr Presets anzeigen"
          >
            <span className="preset-icon">⋯</span>
            <span className="preset-name">Mehr</span>
          </button>
        )}

        {isExpanded && (
          <button
            className="preset-button collapse-button"
            onClick={() => setIsExpanded(false)}
            title="Weniger anzeigen"
          >
            <span className="preset-icon">⌃</span>
            <span className="preset-name">Weniger</span>
          </button>
        )}
      </div>

      <button
        className="manage-presets-button"
        onClick={onManagePresets}
        title="Presets verwalten"
      >
        <span className="icon">⚙️</span>
      </button>
    </div>
  );
}
