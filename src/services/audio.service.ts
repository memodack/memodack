import { inject, singleton } from "tsyringe";
import type { ELanguage } from "../types";
import type { ICacheService } from "./cache.service";
import type { IPlayerService } from "./player.service";
import type { ITtsService } from "./tts.service";

type TPlayArgs = { source: ELanguage; value: string }[];

export interface IAudioService {
  play(args: TPlayArgs): Promise<void>;
}

@singleton()
export class AudioService implements IAudioService {
  constructor(
    @inject("ITtsService")
    private readonly ttsService: ITtsService,
    @inject("ICacheService")
    private readonly cacheService: ICacheService,
    @inject("IPlayerService")
    private readonly playerService: IPlayerService,
  ) {}

  async play(args: TPlayArgs): Promise<void> {
    if (!args.length) {
      return;
    }

    for (const { source, value } of args) {
      let audioUrl: string | null = null;

      const key = await this.getHash(`${source}:${value}`);

      audioUrl = await this.cacheService.get(key);

      if (!audioUrl) {
        const audioUrl = await this.ttsService.tts(source, value);

        if (!audioUrl) {
          return;
        }

        await this.cacheService.add(key, audioUrl);
        await this.playerService.play(this.getFormattedUrl(audioUrl));

        continue;
      }

      if (!audioUrl) {
        return;
      }

      await this.playerService.play(this.getFormattedUrl(audioUrl));
    }
  }

  private getFormattedUrl(audioUrl: string): string {
    return `data:audio/wav;base64,${audioUrl}`;
  }

  private async getHash(data: string): Promise<string> {
    // Convert the string to a byte array
    const msgBuffer = new TextEncoder().encode(data);

    // Compute the hash
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

    // Convert the hash to a byte array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convert the byte array to a hexadecimal string
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    return hashHex;
  }
}
