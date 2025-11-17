import { inject, singleton } from "tsyringe";
import { type ELanguage, EProvider, type ITtsService } from "../types";
import type { ISettingsService } from "./settings.service";

@singleton()
export class TtsService implements ITtsService {
  constructor(
    @inject("ISettingsService") readonly settingsService: ISettingsService,
    @inject("GoogleTtsService")
    private readonly googleTtsService: ITtsService,
    @inject("CustomTtsService")
    private readonly customTtsService: ITtsService,
  ) {}

  async tts(language: ELanguage, value: string): Promise<string | null> {
    const provider = this.settingsService.getProvider();

    if (provider === EProvider.Google) {
      return this.googleTtsService.tts(language, value);
    }

    return this.customTtsService.tts(language, value);
  }
}
