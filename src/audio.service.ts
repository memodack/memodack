import { ICacheService } from './cache.service';
import { IHashService } from './hash.service';
import { IPlayerService } from './player.service';
import { ITtsService } from './tts.service';

export interface IAudioService {
  play(args: { source: string; value: string }[]): Promise<void>;
}

export class AudioService implements IAudioService {
  private cacheService: ICacheService;
  private ttsService: ITtsService;
  private playerService: IPlayerService;
  private hashService: IHashService;

  constructor(
    cacheService: ICacheService,
    playerService: IPlayerService,
    ttsService: ITtsService,
    hashService: IHashService,
  ) {
    this.cacheService = cacheService;
    this.playerService = playerService;
    this.ttsService = ttsService;
    this.hashService = hashService;
  }

  async play(args: { source: string; value: string }[]): Promise<void> {
    if (!args.length) {
      return;
    }

    for (const { source, value } of args) {
      let audioUrl: string | null = null;

      const key = await this.hashService.sha256(`${source}:${value}`);

      audioUrl = await this.cacheService.get(key);

      if (!audioUrl) {
        this.ttsService.setSource(source);
        const audioUrl = await this.ttsService.tts(value);

        if (!audioUrl) {
          return;
        }

        await this.cacheService.add(key, audioUrl);
        await this.playerService.play(this.formatUrl(audioUrl));

        continue;
      }

      if (!audioUrl) {
        return;
      }

      await this.playerService.play(this.formatUrl(audioUrl));
    }
  }

  private formatUrl(audioUrl: string): string {
    return `data:audio/wav;base64,${audioUrl}`;
  }
}
