import { requestUrl } from "obsidian";
import { inject, singleton } from "tsyringe";
import type { ELanguage, ITranslationService } from "../types";
import type { ISettingsService } from "./settings.service";

@singleton()
export class CustomTranslationService implements ITranslationService {
  constructor(@inject("ISettingsService") readonly settingsService: ISettingsService) {}

  async translate(source: ELanguage, target: ELanguage, text: string): Promise<string | null> {
    const url = this.settingsService.getApiUrl();

    if (!url) {
      return null;
    }

    const response = await requestUrl({
      method: "POST",
      url: `${url}/translate`,
      contentType: "application/json",
      body: JSON.stringify({
        source,
        target,
        text,
      }),
    });

    const result = response.text;

    if (!result) {
      return null;
    }

    return result;
  }
}
