import { requestUrl } from 'obsidian';

export interface ITranslationService {
  setApiKey(apiKey: string): void;
  setSource(source: string): void;
  setTarget(target: string): void;
  translate(text: string): Promise<string | null>;
}

export class TranslationService implements ITranslationService {
  private apiKey: string;
  private source: string;
  private target: string;

  constructor(apiKey: string, source: string, target: string) {
    this.apiKey = apiKey;
    this.source = source;
    this.target = target;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setSource(source: string): void {
    this.source = source;
  }

  setTarget(target: string): void {
    this.target = target;
  }

  async translate(text: string): Promise<string | null> {
    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;

      const requestBody = {
        q: text,
        source: this.source,
        target: this.target,
        format: 'text',
      };

      const response = await requestUrl({
        method: 'POST',
        url,
        contentType: 'application/json',
        body: JSON.stringify(requestBody),
      });

      const json = await response.json;

      if (!json?.data?.translations) {
        console.error('Missing the translations property.');
        return null;
      }

      return json.data.translations[0]?.translatedText || null;
    } catch (e) {
      const errorMessage = 'Failed to process translation.';

      if (e instanceof Error) {
        console.error(e.message || errorMessage);
        return null;
      }

      console.error(errorMessage);
      return null;
    }
  }
}
