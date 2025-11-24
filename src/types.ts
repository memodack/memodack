import type { Plugin } from "obsidian";

export type TMemodackPlugin = Plugin & { saveSettings: () => Promise<void> };

export enum EPlayVariant {
  Disabled = "disabled",
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

export enum EProvider {
  Google = "google",
  Custom = "custom",
}

export type TSettings = {
  provider: EProvider;
  apiKey: string;
  apiUrl: string;
  source: ELanguage;
  target: ELanguage;
  playVariant: EPlayVariant;
  voiceOverSpeed: EVoiceOverSpeed;
  translationDivider: boolean;
  textTruncate: ETextTruncate;
};

export enum ETextTruncate {
  Disabled = "disabled",
  Left = "left",
  Right = "right",
}

export interface ITranslationService {
  translate(source: ELanguage, target: ELanguage, text: string): Promise<string | null>;
}

export interface ITtsService {
  tts(language: ELanguage, value: string): Promise<string | null>;
}

export interface IWord {
  value: string;
  translation: string;
  text: string | null;
  imageUrl: string | null;
}

export interface IQuest {
  imageUrl: string | null;
  question: string;
  helpText: string | null;
  answers: string[];
  correctAnswerId: number;
}
