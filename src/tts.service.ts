import { requestUrl } from 'obsidian';

interface ITtsResponse {
  audioContent: string;
}

export interface ITtsService {
  setApiKey(apiKey: string): void;
  setSource(source: string): void;
  tts(value: string): Promise<string | null>;
}

export class TtsService implements ITtsService {
  private _apiKey: string | null = null;
  private _source: string | null = null;

  setApiKey(apiKey: string): void {
    this._apiKey = apiKey;
  }

  setSource(source: string): void {
    this._source = source;
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

  async tts(value: string): Promise<string | null> {
    try {
      const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`;

      const requestBody = {
        input: { text: value },
        voice: {
          languageCode: this.source,
          ssmlGender: 'NEUTRAL',
        },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const response = (await requestUrl({
        method: 'POST',
        url,
        contentType: 'application/json',
        body: JSON.stringify(requestBody),
      })) as { json: Promise<ITtsResponse> };

      const json = await response.json;

      return json.audioContent || null;
    } catch (e) {
      console.error(
        `Failed to process TTS. ${e instanceof Error ? e.message : ''}`,
      );
      return null;
    }
  }
}

export const ttsService = new TtsService();
