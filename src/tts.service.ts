import { requestUrl } from 'obsidian';

export interface ITtsService {
  setApiKey(apiKey: string): void;
  setSource(source: string): void;
  tts(value: string): Promise<string | null>;
}

export class TtsService implements ITtsService {
  private apiKey: string;
  private source: string;

  constructor(apiKey: string, source: string) {
    this.apiKey = apiKey;
    this.source = source;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setSource(source: string): void {
    this.source = source;
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

      const response = await requestUrl({
        method: 'POST',
        url,
        contentType: 'application/json',
        body: JSON.stringify(requestBody),
      });

      const json = await response.json;

      if (!json?.audioContent) {
        console.error('Missing the audioContent property.');
        return null;
      }

      return json.audioContent || null;
    } catch (e) {
      const errorMessage = 'Failed to process TTS.';

      if (e instanceof Error) {
        console.error(e.message || errorMessage);
        return null;
      }

      console.error(errorMessage);
      return null;
    }
  }
}
