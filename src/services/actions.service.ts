import { IAudioService, audioService } from './audio.service';

import { TPlayVariant } from '../types';

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
  private playVariant: TPlayVariant = 'nothing';
  private _source: string | null = null;
  private _target: string | null = null;

  constructor(audioService: IAudioService) {
    this.audioService = audioService;
  }

  setPlayVariant(playVariant: TPlayVariant): void {
    this.playVariant = playVariant;
  }

  setSource(source: string): void {
    this._source = source;
  }

  setTarget(target: string): void {
    this._target = target;
  }

  private get source(): string {
    if (!this._source) {
      throw new Error('The source is not set.');
    }

    return this._source;
  }

  private get target(): string {
    if (!this._target) {
      throw new Error('The target is not set.');
    }

    return this._target;
  }

  async play(value: string, translation: string): Promise<void> {
    switch (this.playVariant) {
      case 'nothing':
        break;

      case 'value':
        await this.playValue(value);
        break;

      case 'translation':
        await this.playTranslation(translation);
        break;

      case 'value-and-translation':
        await this.playValueAndTranslation(value, translation);
        break;

      case 'translation-and-value':
        await this.playTranslationAndValue(translation, value);
        break;
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

export const actionsService = new ActionsService(audioService);
