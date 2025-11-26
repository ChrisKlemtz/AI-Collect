import { useState } from 'react';
import { PromptPreset } from '../types';
import './PromptPresetsModal.scss';

export interface PromptPresetsModalProps {
  isOpen: boolean;
  presets: PromptPreset[];
  onClose: () => void;
  onAdd: (name: string, prompt: string, icon?: string) => void;
  onUpdate: (id: string, name: string, prompt: string, icon?: string) => void;
  onDelete: (id: string) => void;
}

export function PromptPresetsModal({
  isOpen,
  presets,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
}: PromptPresetsModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formName, setFormName] = useState('');
  const [formPrompt, setFormPrompt] = useState('');
  const [formIcon, setFormIcon] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (preset: PromptPreset) => {
    setEditingId(preset.id);
    setFormName(preset.name);
    setFormPrompt(preset.prompt);
    setFormIcon(preset.icon || '');
    setShowAddForm(false);
  };

  const handleStartAdd = () => {
    setEditingId(null);
    setFormName('');
    setFormPrompt('');
    setFormIcon('');
    setShowAddForm(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formPrompt.trim()) {
      alert('Name und Prompt sind erforderlich.');
      return;
    }

    if (editingId) {
      onUpdate(editingId, formName, formPrompt, formIcon || undefined);
    } else {
      onAdd(formName, formPrompt, formIcon || undefined);
    }

    setEditingId(null);
    setShowAddForm(false);
    setFormName('');
    setFormPrompt('');
    setFormIcon('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormName('');
    setFormPrompt('');
    setFormIcon('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Möchtest du dieses Preset wirklich löschen?')) {
      onDelete(id);
      if (editingId === id) {
        handleCancel();
      }
    }
  };

  return (
    <div className="presets-modal-overlay" onClick={onClose}>
      <div className="presets-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Prompt-Presets verwalten</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="presets-list">
            <div className="presets-list-header">
              <h3>Gespeicherte Presets</h3>
              <button className="add-button" onClick={handleStartAdd}>
                + Neues Preset
              </button>
            </div>

            {presets.map((preset) => (
              <div
                key={preset.id}
                className={`preset-item ${editingId === preset.id ? 'editing' : ''}`}
              >
                {editingId === preset.id ? (
                  <div className="preset-edit-form">
                    <div className="form-row">
                      <input
                        type="text"
                        className="form-input icon-input"
                        placeholder="Icon (z.B. 🔥)"
                        value={formIcon}
                        onChange={(e) => setFormIcon(e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-input name-input"
                        placeholder="Name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                      />
                    </div>
                    <textarea
                      className="form-textarea"
                      placeholder="Prompt-Text (verwende {selection} für ausgewählten Text)"
                      value={formPrompt}
                      onChange={(e) => setFormPrompt(e.target.value)}
                      rows={4}
                    />
                    <div className="form-actions">
                      <button className="save-button" onClick={handleSave}>
                        Speichern
                      </button>
                      <button className="cancel-button" onClick={handleCancel}>
                        Abbrechen
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="preset-info">
                      {preset.icon && <span className="preset-icon">{preset.icon}</span>}
                      <div className="preset-details">
                        <div className="preset-name">
                          {preset.name}
                          {preset.isDefault && (
                            <span className="default-badge">Standard</span>
                          )}
                        </div>
                        <div className="preset-prompt-preview">{preset.prompt}</div>
                      </div>
                    </div>
                    <div className="preset-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleStartEdit(preset)}
                        title="Bearbeiten"
                      >
                        ✏️
                      </button>
                      {!preset.isDefault && (
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(preset.id)}
                          title="Löschen"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {showAddForm && (
            <div className="add-preset-form">
              <h3>Neues Preset erstellen</h3>
              <div className="form-row">
                <input
                  type="text"
                  className="form-input icon-input"
                  placeholder="Icon (z.B. 🔥)"
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                />
                <input
                  type="text"
                  className="form-input name-input"
                  placeholder="Name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <textarea
                className="form-textarea"
                placeholder="Prompt-Text (verwende {selection} für ausgewählten Text)"
                value={formPrompt}
                onChange={(e) => setFormPrompt(e.target.value)}
                rows={4}
              />
              <div className="form-actions">
                <button className="save-button" onClick={handleSave}>
                  Erstellen
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <p className="help-text">
            💡 Tipp: Verwende <code>{'{selection}'}</code> in deinem Prompt, um
            ausgewählten Text einzufügen.
          </p>
        </div>
      </div>
    </div>
  );
}
