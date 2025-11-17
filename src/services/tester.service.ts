import { Notice } from "obsidian";
import { inject, singleton } from "tsyringe";
import { ELanguage, type ITranslationService, type ITtsService } from "../types";

export interface ITesterService {
  testTranslationService(): Promise<void>;
  testTtsService(): Promise<void>;
}

@singleton()
export class TesterService implements ITesterService {
  constructor(
    @inject("ITranslationService") readonly translationService: ITranslationService,
    @inject("ITtsService") readonly ttsService: ITtsService,
  ) {}

  async testTranslationService(): Promise<void> {
    const service = "translation";

    try {
      const response = await this.translationService.translate(ELanguage.English, ELanguage.Ukrainian, "ping");

      if (!response) {
        this.errorNotice(service);
        return;
      }

      this.successNotice(service);
    } catch (_e) {
      this.errorNotice(service);
    }
  }

  async testTtsService(): Promise<void> {
    const service = "text-to-speech";

    try {
      const response = await this.ttsService.tts(ELanguage.English, "ping");

      if (!response) {
        this.errorNotice(service);
        return;
      }

      this.successNotice(service);
    } catch (_e) {
      this.errorNotice(service);
    }
  }

  private successNotice(service: string): void {
    new Notice(`The ${service} service is working.`);
  }

  private errorNotice(service: string): void {
    new Notice(`The ${service} service is not working.`);
  }
}
