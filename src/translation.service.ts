import { requestUrl } from 'obsidian';

export interface ITranslationService {
  translate(
    source: string,
    target: string,
    text: string,
  ): Promise<string | null>;
}

export class TranslationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async translate(
    source: string,
    target: string,
    text: string,
  ): Promise<string | null> {
    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;

      const requestBody = {
        q: text,
        source: source,
        target: target,
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
