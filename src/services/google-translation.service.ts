import { type RequestUrlResponsePromise, requestUrl } from "obsidian";
import { inject, singleton } from "tsyringe";
import type { ELanguage, ITranslationService } from "../types";
import type { ISettingsService } from "./settings.service";

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
export class GoogleTranslationService implements ITranslationService {
  constructor(@inject("ISettingsService") readonly settingsService: ISettingsService) {}

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
