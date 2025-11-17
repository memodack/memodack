import { inject, singleton } from "tsyringe";
import { type ELanguage, EProvider, type ITranslationService } from "../types";
import type { ISettingsService } from "./settings.service";

@singleton()
export class TranslationService implements ITranslationService {
  constructor(
    @inject("ISettingsService")
    private readonly settingsService: ISettingsService,
    @inject("GoogleTranslationService")
    private readonly googleTranslationService: ITranslationService,
    @inject("CustomTranslationService")
    private readonly customTranslationService: ITranslationService,
  ) {}

  async translate(source: ELanguage, target: ELanguage, text: string): Promise<string | null> {
    const provider = this.settingsService.getProvider();

    if (provider === EProvider.Google) {
      return this.googleTranslationService.translate(source, target, text);
    }

    return this.customTranslationService.translate(source, target, text);
  }
}
