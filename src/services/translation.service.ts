import { Notice, type RequestUrlResponsePromise, requestUrl } from "obsidian";
import { inject, singleton } from "tsyringe";
import { ELanguage } from "../types";
import type { ISettingsService } from "./settings.service";

export interface ITranslationService {
  translate(source: ELanguage, target: ELanguage, text: string): Promise<string | null>;
  test(): Promise<void>;
}

export interface ITransactionResponse {
  data: {
    translations: [
      {
        translatedText: string;
      },
    ];
  };
}

@singleton()
export class TranslationService implements ITranslationService {
  constructor(
    @inject("ISettingsService")
    private readonly settingsService: ISettingsService,
  ) {}

  async translate(source: ELanguage, target: ELanguage, text: string): Promise<string | null> {
    try {
      const url = this.getUrl();

      if (!url) {
        return null;
      }

      const body = this.getBody(source, target, text);

      const response: { json: Promise<ITransactionResponse> } = await this.request(url, body);

      const json = await response.json;

      return json.data.translations[0].translatedText || null;
    } catch (e) {
      console.error(`Failed to process translation. ${e instanceof Error ? e.message : ""}`);
      return null;
    }
  }

  async test(): Promise<void> {
    try {
      const response = await this.translate(ELanguage.English, ELanguage.Ukrainian, "ping");

      if (!response) {
        new Notice("The translation service is not working.");
        return;
      }

      new Notice("The translation service is working.");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      new Notice("The translation service is not working.");
    }
  }

  private getUrl(): string | null {
    const apiKey = this.settingsService.getApiKey();

    if (!apiKey) {
      return null;
    }

    return `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  }

  private getBody(source: ELanguage, target: ELanguage, text: string): string {
    const body = {
      q: text,
      source,
      target,
      format: "text",
    };

    return JSON.stringify(body);
  }

  private request(url: string, body: string): RequestUrlResponsePromise {
    return requestUrl({
      method: "POST",
      url,
      contentType: "application/json",
      body,
    });
  }
}
