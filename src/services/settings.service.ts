import { singleton } from "tsyringe";
import { ELanguage, EPlayVariant, EProvider, ETextTruncate, EVoiceOverSpeed, type TSettings } from "../types";

export const defaultSettings: TSettings = {
  provider: EProvider.Google,
  apiKey: "",
  apiUrl: "http://localhost:8000",
  source: ELanguage.English,
  target: ELanguage.Ukrainian,
  playVariant: EPlayVariant.ValueAndTranslation,
  voiceOverSpeed: EVoiceOverSpeed.x2,
  translationDivider: true,
  textTruncate: ETextTruncate.Right,
};

export interface ISettingsService {
  getProvider(): EProvider;
  getApiKey(): string;
  getApiUrl(): string;
  getSource(): ELanguage;
  getTarget(): ELanguage;
  getPlayVariant(): EPlayVariant;
  getVoiceOverSpeed(): EVoiceOverSpeed;
  getTranslationDivider(): boolean;
  getTextTruncate(): ETextTruncate;

  setProvider(value: EProvider): void;
  setApiKey(value: string): void;
  setApiUrl(value: string): void;
  setSource(value: ELanguage): void;
  setTarget(value: ELanguage): void;
  setPlayVariant(value: EPlayVariant): void;
  setVoiceOverSpeed(value: EVoiceOverSpeed): void;
  setTranslationDivider(value: boolean): void;
  setTextTruncate(value: ETextTruncate): void;

  getSettings(): TSettings;
  setSettings(newSettings: Partial<TSettings>): void;
}

@singleton()
export class SettingsService implements ISettingsService {
  private settings: TSettings = { ...defaultSettings };

  getProvider(): EProvider {
    return this.settings.provider;
  }

  setProvider(value: EProvider): void {
    this.settings.provider = value;
  }

  getApiKey(): string {
    return this.settings.apiKey;
  }

  setApiKey(value: string): void {
    this.settings.apiKey = value;
  }

  getApiUrl(): string {
    return this.settings.apiUrl;
  }

  setApiUrl(value: string): void {
    this.settings.apiUrl = value;
  }

  getSource(): ELanguage {
    return this.settings.source;
  }

  setSource(value: ELanguage): void {
    this.settings.source = value;
  }

  getTarget(): ELanguage {
    return this.settings.target;
  }

  setTarget(value: ELanguage): void {
    this.settings.target = value;
  }

  getPlayVariant(): EPlayVariant {
    return this.settings.playVariant;
  }

  setPlayVariant(value: EPlayVariant): void {
    this.settings.playVariant = value;
  }

  getVoiceOverSpeed(): number {
    return this.settings.voiceOverSpeed;
  }

  setVoiceOverSpeed(value: number): void {
    this.settings.voiceOverSpeed = value;
  }

  getSettings(): TSettings {
    return { ...this.settings };
  }

  setSettings(newSettings: Partial<TSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  getTranslationDivider(): boolean {
    return this.settings.translationDivider;
  }

  setTranslationDivider(value: boolean): void {
    this.settings.translationDivider = value;
  }

  getTextTruncate(): ETextTruncate {
    return this.settings.textTruncate;
  }

  setTextTruncate(value: ETextTruncate): void {
    this.settings.textTruncate = value;
  }
}
