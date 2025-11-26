import { Response } from 'express';
import { ApiKeyModel } from '../models/ApiKey';
import { AuthRequest } from '../middleware/auth';
import { AIValidator } from '../services/aiValidator';

export class ApiKeyController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
      }

      const apiKeys = await ApiKeyModel.findAllByUser(req.userId);
      res.json({ apiKeys });
    } catch (error) {
      console.error('Get API keys error:', error);
      res.status(500).json({ error: 'Fehler beim Abrufen der API-Schlüssel' });
    }
  }

  static async save(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
      }

      const { provider, apiKey } = req.body;

      if (!provider || !apiKey) {
        return res.status(400).json({ error: 'Provider und API-Schlüssel sind erforderlich' });
      }

      // Validate provider
      const validProviders = ['chatgpt', 'claude', 'deepseek'];
      if (!validProviders.includes(provider)) {
        return res.status(400).json({ error: 'Ungültiger Provider' });
      }

      // Save encrypted API key
      await ApiKeyModel.create(req.userId, provider, apiKey);

      res.json({ message: 'API-Schlüssel erfolgreich gespeichert' });
    } catch (error) {
      console.error('Save API key error:', error);
      res.status(500).json({ error: 'Fehler beim Speichern des API-Schlüssels' });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
      }

      const { provider } = req.params;

      if (!provider) {
        return res.status(400).json({ error: 'Provider ist erforderlich' });
      }

      await ApiKeyModel.delete(req.userId, provider);

      res.json({ message: 'API-Schlüssel erfolgreich gelöscht' });
    } catch (error) {
      console.error('Delete API key error:', error);
      res.status(500).json({ error: 'Fehler beim Löschen des API-Schlüssels' });
    }
  }

  static async validate(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
      }

      const { provider } = req.params;

      if (!provider) {
        return res.status(400).json({ error: 'Provider ist erforderlich' });
      }

      const apiKey = await ApiKeyModel.findByUserAndProvider(req.userId, provider);

      if (!apiKey) {
        return res.json({ valid: false, message: 'API-Schlüssel nicht gefunden' });
      }

      // Actually validate the API key with the provider
      const validation = await AIValidator.validateProvider(provider, apiKey);

      res.json(validation);
    } catch (error) {
      console.error('Validate API key error:', error);
      res.status(500).json({ error: 'Fehler bei der Validierung des API-Schlüssels' });
    }
  }
}
