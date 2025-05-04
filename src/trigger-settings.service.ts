import { IActionsService, actionsService } from './actions.service';
import { IPlayerService, playerService } from './player.service';
import { ITranslationService, translationService } from './translation.service';
import { ITtsService, ttsService } from './tts.service';

import { TPlayVariant } from './setting-tab.service';

type TArgs = {
  apiKey?: string;
  source?: string;
  target?: string;
  voiceOverSpeed?: string;
  playVariant?: TPlayVariant;
};

export interface ITriggerSettingsService {
  trigger(args: TArgs): void;
}

export class TriggerSettingsService implements ITriggerSettingsService {
  private readonly playerService: IPlayerService;
  private readonly ttsService: ITtsService;
  private readonly translationService: ITranslationService;
  private readonly actionsService: IActionsService;

  constructor(
    playerService: IPlayerService,
    ttsService: ITtsService,
    translationService: ITranslationService,
    actionsService: IActionsService,
  ) {
    this.playerService = playerService;
    this.ttsService = ttsService;
    this.translationService = translationService;
    this.actionsService = actionsService;
  }

  trigger(args: TArgs): void {
    if (args.apiKey) {
      this.triggerApiKey(args.apiKey);
    }

    if (args.source) {
      this.triggerSource(args.source);
    }

    if (args.target) {
      this.triggerTarget(args.target);
    }

    if (args.voiceOverSpeed) {
      this.triggerVoiceOverSpeed(
        parseInt(args.voiceOverSpeed.replace(/\D/g, '')),
      );
    }

    if (args.playVariant) {
      this.triggerPlayVariant(args.playVariant);
    }
  }

  private triggerApiKey(apiKey: string): void {
    this.ttsService.setApiKey(apiKey);
    this.translationService.setApiKey(apiKey);
  }

  private triggerSource(source: string): void {
    this.ttsService.setSource(source);
    this.translationService.setSource(source);
    this.actionsService.setSource(source);
  }

  private triggerTarget(target: string): void {
    this.translationService.setTarget(target);
    this.actionsService.setTarget(target);
  }

  private triggerVoiceOverSpeed(voiceOverSpeed: number): void {
    this.playerService.setSpeed(voiceOverSpeed);
  }

  private triggerPlayVariant(playVariant: TPlayVariant): void {
    this.actionsService.setPlayVariant(playVariant);
  }
}

export const triggerSettingsService = new TriggerSettingsService(
  playerService,
  ttsService,
  translationService,
  actionsService,
);
