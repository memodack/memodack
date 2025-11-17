import { requestUrl } from "obsidian";
import { inject, singleton } from "tsyringe";
import type { ELanguage, ITtsService } from "../types";
import type { ISettingsService } from "./settings.service";

export interface ICustomTtsResponse {
  audioContent: string;
}

@singleton()
export class CustomTtsService implements ITtsService {
  constructor(@inject("ISettingsService") readonly settingsService: ISettingsService) {}

  async tts(language: ELanguage, value: string): Promise<string | null> {
    try {
      const url = this.settingsService.getApiUrl();

      if (!url) {
        return null;
      }

      const response = await requestUrl({
        method: "POST",
        url: `${url}/tts`,
        contentType: "application/json",
        body: JSON.stringify({
          lang: language,
          text: value,
        }),
      });

      const result = response.text;

      if (!result) {
        return null;
      }

      return result;
    } catch (e) {
      console.error(`Failed to process TTS. ${e instanceof Error ? e.message : ""}`);
      return null;
    }
  }
}
