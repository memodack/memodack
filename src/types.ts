import type { Plugin } from "obsidian";

export type TMemodackPlugin = Plugin & { saveSettings: () => Promise<void> };

export enum EPlayVariant {
  Nothing = "nothing",
  Value = "value",
  Translation = "translation",
  ValueAndTranslation = "value-and-translation",
  TranslationAndValue = "translation-and-value",
}

export enum EVoiceOverSpeed {
  Normal = 1,
  x2 = 2,
  x3 = 3,
}

export enum ELanguage {
  Ukrainian = "uk",
  English = "en",
  MandarinChinese = "zh-CN",
  Hindi = "hi",
  Spanish = "es",
  StandardArabic = "ar",
  French = "fr",
  Bengali = "bn",
  Portuguese = "pt",
  Urdu = "ur",
  Indonesian = "id",
  German = "de",
  Japanese = "ja",
}

export type TSettings = {
  apiKey: string;
  source: ELanguage;
  target: ELanguage;
  playVariant: EPlayVariant;
  voiceOverSpeed: EVoiceOverSpeed;
  translationDivider: boolean;
};
