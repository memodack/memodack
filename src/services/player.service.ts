import { inject, singleton } from "tsyringe";
import type { ISettingsService } from "./settings.service";

export interface IPlayerService {
  play(audioUrl: string): Promise<void>;
}

@singleton()
export class PlayerService implements IPlayerService {
  private audio = new Audio();

  constructor(
    @inject("ISettingsService")
    private readonly settingsService: ISettingsService,
  ) {}

  async play(audioUrl: string): Promise<void> {
    if (!audioUrl) {
      throw new Error("The audioUrl is required for audio playback.");
    }

    this.audio.volume = 0;
    this.audio.src = audioUrl;

    try {
      this.audio.volume = 1;
      this.audio.playbackRate = this.settingsService.getVoiceOverSpeed();

      await this.audio.play();

      await new Promise<void>((resolve) => {
        this.audio.addEventListener(
          "ended",
          () => {
            resolve();
          },
          { once: true },
        );
      });
    } catch (e) {
      const errorMessage = "Audio playback error.";

      if (e instanceof Error) {
        console.error(e.message || errorMessage);
        return;
      }

      console.error(errorMessage);
    }
  }
}
