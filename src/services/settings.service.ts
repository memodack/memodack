import {
  ELanguage,
  EPlayVariant,
  EVoiceOverSpeed,
  type TSettings,
} from "../types";

export const defaultSettings: TSettings = {
  apiKey: "",
  source: ELanguage.English,
  target: ELanguage.Ukrainian,
  playVariant: EPlayVariant.ValueAndTranslation,
  voiceOverSpeed: EVoiceOverSpeed.x2,
  translationDivider: true,
};

export interface ISettingsService {
  getApiKey(): string;
  getSource(): ELanguage;
  getTarget(): ELanguage;
  getPlayVariant(): EPlayVariant;
  getVoiceOverSpeed(): EVoiceOverSpeed;
  getTranslationDivider(): boolean;

  setApiKey(value: string): void;
  setSource(value: ELanguage): void;
  setTarget(value: ELanguage): void;
  setPlayVariant(value: EPlayVariant): void;
  setVoiceOverSpeed(value: EVoiceOverSpeed): void;
  setTranslationDivider(value: boolean): void;

  getSettings(): TSettings;
  setSettings(newSettings: Partial<TSettings>): void;
}

export class SettingsService implements ISettingsService {
  private settings: TSettings;

  constructor(initialSettings?: Partial<TSettings>) {
    this.settings = { ...defaultSettings, ...initialSettings };
  }

  getApiKey(): string {
    return this.settings.apiKey;
  }

  setApiKey(value: string): void {
    this.settings.apiKey = value;
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
}

export const settingsService = new SettingsService();
