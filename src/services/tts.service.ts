import { Notice, RequestUrlResponsePromise, requestUrl } from 'obsidian';

import { ELanguage } from '../types';
import { ISettingsService } from './settings.service';

export interface ITtsService {
  tts(language: ELanguage, value: string): Promise<string | null>;
  test(): Promise<void>;
}

export interface ITtsResponse {
  audioContent: string;
}

export class TtsService implements ITtsService {
  private settingsService: ISettingsService;

  constructor(settingsService: ISettingsService) {
    this.settingsService = settingsService;
  }

  async tts(language: ELanguage, value: string): Promise<string | null> {
    try {
      const url = this.getUrl();

      if (!url) {
        return null;
      }

      const body = this.getBody(value, language);

      const response: { json: Promise<ITtsResponse> } = await this.request(
        url,
        body,
      );

      const json = await response.json;

      return json.audioContent || null;
    } catch (e) {
      console.error(
        `Failed to process TTS. ${e instanceof Error ? e.message : ''}`,
      );
      return null;
    }
  }

  async test(): Promise<void> {
    try {
      const response = await this.tts(ELanguage.English, 'ping');

      if (!response) {
        new Notice('The text-to-speech service is not working.');
        return;
      }

      new Notice('The text-to-speech service is working.');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      new Notice('The text-to-speech service is not working.');
    }
  }

  private getUrl(): string | null {
    const apiKey = this.settingsService.getApiKey();

    if (!apiKey) {
      return null;
    }

    return `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
  }

  private getBody(value: string, language: ELanguage): string {
    const body = {
      input: { text: value },
      voice: {
        languageCode: language,
        ssmlGender: 'NEUTRAL',
      },
      audioConfig: { audioEncoding: 'MP3' },
    };

    return JSON.stringify(body);
  }

  private request(url: string, body: string): RequestUrlResponsePromise {
    return requestUrl({
      method: 'POST',
      url,
      contentType: 'application/json',
      body,
    });
  }
}
