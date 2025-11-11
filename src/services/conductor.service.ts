import { inject, singleton } from "tsyringe";
import { EPlayVariant } from "../types";
import type { IAudioService } from "./audio.service";
import type { ISettingsService } from "./settings.service";

export interface IConductorService {
  playValue(value: string): Promise<void>;
  playTranslation(translation: string): Promise<void>;
  playValueAndTranslation(value: string, translation: string): Promise<void>;
  playTranslationAndValue(translation: string, value: string): Promise<void>;
  play(value: string, translation: string): Promise<void>;
}

@singleton()
export class ConductorService implements IConductorService {
  constructor(
    @inject("ISettingsService")
    private readonly settingsService: ISettingsService,
    @inject("IAudioService") private readonly audioService: IAudioService,
  ) {}

  async playValue(value: string): Promise<void> {
    await this.audioService.play([
      {
        source: this.settingsService.getSource(),
        value,
      },
    ]);
  }

  async playTranslation(translation: string): Promise<void> {
    await this.audioService.play([
      {
        source: this.settingsService.getTarget(),
        value: translation,
      },
    ]);
  }

  async playValueAndTranslation(value: string, translation: string): Promise<void> {
    await this.audioService.play([
      {
        source: this.settingsService.getSource(),
        value: value,
      },
      {
        source: this.settingsService.getTarget(),
        value: translation,
      },
    ]);
  }

  async playTranslationAndValue(translation: string, value: string): Promise<void> {
    await this.audioService.play([
      {
        source: this.settingsService.getTarget(),
        value: translation,
      },
      {
        source: this.settingsService.getSource(),
        value: value,
      },
    ]);
  }

  async play(value: string, translation: string): Promise<void> {
    switch (this.settingsService.getPlayVariant()) {
      case EPlayVariant.Nothing:
        break;

      case EPlayVariant.Value:
        await this.playValue(value);
        break;

      case EPlayVariant.Translation:
        await this.playTranslation(translation);
        break;

      case EPlayVariant.ValueAndTranslation:
        await this.playValueAndTranslation(value, translation);
        break;

      case EPlayVariant.TranslationAndValue:
        await this.playTranslationAndValue(translation, value);
        break;
    }
  }
}
