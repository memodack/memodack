export interface IPlayerService {
  setSpeed(speed: number): void;
  play(audioUrl: string): Promise<void>;
}

export class PlayerService implements IPlayerService {
  private audio = new Audio();
  private speed = 1;

  setSpeed(speed: number): void {
    this.speed = speed;
  }

  async play(audioUrl: string): Promise<void> {
    if (!audioUrl) {
      throw new Error('The audioUrl is required for audio playback.');
    }

    this.audio.volume = 0;
    this.audio.src = audioUrl;

    try {
      await this.audio.play();
      this.audio.volume = 1;
      this.audio.playbackRate = this.speed;

      // Waiting for playback to finish
      await new Promise<void>((resolve, reject) => {
        this.audio.addEventListener('ended', () => resolve(), { once: true });
        this.audio.addEventListener(
          'error',
          () => reject(new Error('Audio playback error.')),
          { once: true },
        );
      });
    } catch (e) {
      const errorMessage = 'Audio playback error.';

      if (e instanceof Error) {
        console.error(e.message || errorMessage);
        return;
      }

      console.error(errorMessage);
    }
  }
}
