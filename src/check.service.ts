import { ITranslationService } from './translation.service';
import { ITtsService } from './tts.service';
import { Notice } from 'obsidian';

export interface ICheckService {
  check(): Promise<void>;
}

export class CheckService implements ICheckService {
  private translationService: ITranslationService;
  private ttsService: ITtsService;

  constructor(
    translationService: ITranslationService,
    ttsService: ITtsService,
  ) {
    this.translationService = translationService;
    this.ttsService = ttsService;
  }

  async check(): Promise<void> {
    this.checkTranslation();
    this.checkTts();
  }

  async checkTranslation(): Promise<void> {
    try {
      const response = await this.translationService.translate('ping');

      if (!response) {
        new Notice('The translation service is not working.');
        return;
      }

      new Notice('The translation service is working.');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      new Notice('The translation service is not working.');
    }
  }

  async checkTts(): Promise<void> {
    try {
      const response = await this.ttsService.tts('ping');

      if (!response) {
        new Notice('The text-to-speech service is not working.');
        return;
      }

      new Notice('The text-to-speech service is working.');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      new Notice('The text-to-speech service is not working.');
    }
  }
}
