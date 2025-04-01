import { IAudioService } from './audio.service';
import { TPlayVariant } from './setting-tab.service';

export interface IActionsService {
  setPlayVariant(playVariant: TPlayVariant): void;
  setSource(source: string): void;
  setTarget(target: string): void;
  play(value: string, translation: string): Promise<void>;
  playValue(value: string): Promise<void>;
  playTranslation(translation: string): Promise<void>;
  playValueAndTranslation(value: string, translation: string): Promise<void>;
  playTranslationAndValue(translation: string, value: string): Promise<void>;
}

export class ActionsService implements IActionsService {
  private audioService: IAudioService;
  private playVariant: TPlayVariant;
  private source: string;
  private target: string;

  constructor(
    audioService: IAudioService,
    playVariant: TPlayVariant,
    source: string,
    target: string,
  ) {
    this.audioService = audioService;
    this.playVariant = playVariant;
    this.source = source;
    this.target = target;
  }

  setPlayVariant(playVariant: TPlayVariant): void {
    this.playVariant = playVariant;
  }

  setSource(source: string): void {
    this.source = source;
  }

  setTarget(target: string): void {
    this.target = target;
  }

  async play(value: string, translation: string): Promise<void> {
    if (this.playVariant === 'nothing') {
      return;
    }

    if (this.playVariant === 'value') {
      this.playValue(value);
      return;
    }

    if (this.playVariant === 'translation') {
      this.playTranslation(translation);
      return;
    }

    if (this.playVariant === 'value-and-translation') {
      this.playValueAndTranslation(value, translation);
      return;
    }

    if (this.playVariant === 'translation-and-value') {
      this.playTranslationAndValue(translation, value);
      return;
    }
  }

  async playValue(value: string): Promise<void> {
    await this.audioService.play([
      {
        source: this.source,
        value,
      },
    ]);
  }

  async playTranslation(translation: string): Promise<void> {
    await this.audioService.play([
      {
        source: this.target,
        value: translation,
      },
    ]);
  }

  async playValueAndTranslation(
    value: string,
    translation: string,
  ): Promise<void> {
    await this.audioService.play([
      {
        source: this.source,
        value: value,
      },
      {
        source: this.target,
        value: translation,
      },
    ]);
  }

  async playTranslationAndValue(
    translation: string,
    value: string,
  ): Promise<void> {
    await this.audioService.play([
      {
        source: this.target,
        value: translation,
      },
      {
        source: this.source,
        value: value,
      },
    ]);
  }
}
