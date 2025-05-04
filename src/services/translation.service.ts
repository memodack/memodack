import { requestUrl } from 'obsidian';

interface ITransactionResponse {
  data: {
    translations: [
      {
        translatedText: string;
      },
    ];
  };
}

export interface ITranslationService {
  setApiKey(apiKey: string): void;
  setSource(source: string): void;
  setTarget(target: string): void;
  translate(text: string): Promise<string | null>;
}

export class TranslationService implements ITranslationService {
  private _apiKey: string | null = null;
  private _source: string | null = null;
  private _target: string | null = null;

  setApiKey(apiKey: string): void {
    this._apiKey = apiKey;
  }

  setSource(source: string): void {
    this._source = source;
  }

  setTarget(target: string): void {
    this._target = target;
  }

  private get apiKey(): string {
    if (!this._apiKey) {
      throw new Error(' The api key is not set.');
    }

    return this._apiKey;
  }

  private get source(): string {
    if (!this._source) {
      throw new Error(' The source is not set.');
    }

    return this._source;
  }

  private get target(): string {
    if (!this._target) {
      throw new Error(' The target is not set.');
    }

    return this._target;
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

      const response = (await requestUrl({
        method: 'POST',
        url,
        contentType: 'application/json',
        body: JSON.stringify(requestBody),
      })) as { json: Promise<ITransactionResponse> };

      const json = await response.json;

      return json.data.translations[0].translatedText || null;
    } catch (e) {
      console.error(
        `Failed to process translation. ${e instanceof Error ? e.message : ''}`,
      );
      return null;
    }
  }
}

export const translationService = new TranslationService();
