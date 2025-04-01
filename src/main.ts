import { ActionsService, IActionsService } from './actions.service';
import { CacheService, ICacheService } from './cache.service';
import { CheckService, ICheckService } from './check.service';
import {
  DEFAULT_SETTINGS,
  ISettings,
  SettingTabService,
} from './setting-tab.service';
import { IPlayerService, PlayerService } from './player.service';
import { ITranslationService, TranslationService } from './translation.service';
import { ITtsService, TtsService } from './tts.service';
import { Plugin, addIcon } from 'obsidian';

import { AudioService } from './audio.service';
import { BlitzModalService } from './blitz-modal.service';
import { BlitzService } from './blitz.service';
import { HashService } from './hash.service';
import { MppService } from './mpp.service';
import { NumbersService } from './numbers.service';
import { PartsService } from './parts.service';
import { RibbonIconService } from './ribbon-icon.service';
import { ShuffleService } from './shuffle.service';
import { TranslateCommandService } from './translate-command.service';
import { icon } from './icon';

export default class MemodackPlugin extends Plugin {
  settings!: ISettings;

  cacheService!: ICacheService;
  playerService!: IPlayerService;
  ttsService!: ITtsService;
  actionsService!: IActionsService;
  translationService!: ITranslationService;
  checkService!: ICheckService;

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    await this.afterSaveSettings();
  }

  async onload(): Promise<void> {
    await this.loadSettings();

    addIcon(icon.id, icon.svg);

    const cacheDirectoryPath = this.manifest?.dir
      ? `${this.manifest.dir}/cache`
      : `${this.app.vault.configDir}/plugins/${this.manifest.id}/cache`;

    this.cacheService = new CacheService(this.app.vault, cacheDirectoryPath);
    this.playerService = new PlayerService();
    const settingTabService = new SettingTabService(this.app, this);
    this.ttsService = new TtsService(
      this.settings.apiKey,
      this.settings.source,
    );
    this.translationService = new TranslationService(
      this.settings.apiKey,
      this.settings.source,
      this.settings.target,
    );
    const hashService = new HashService();
    const audioService = new AudioService(
      this.cacheService,
      this.playerService,
      this.ttsService,
      hashService,
    );
    this.actionsService = new ActionsService(
      audioService,
      this.settings.playVariant,
      this.settings.source,
      this.settings.target,
    );
    const translateCommandService = new TranslateCommandService(
      this.translationService,
      this.actionsService,
    );
    const mppService = new MppService(this.actionsService);
    const partsService = new PartsService(this.app);
    const shuffleService = new ShuffleService();
    const numbersService = new NumbersService();
    const blitzService = new BlitzService(shuffleService, numbersService);
    const blitzModalService = new BlitzModalService(
      this.app,
      this.actionsService,
      blitzService,
    );
    const ribbonIconService = new RibbonIconService(
      this.app,
      partsService,
      blitzModalService,
    );
    this.checkService = new CheckService(
      this.translationService,
      this.ttsService,
    );

    this.addSettingTab(settingTabService);
    this.addCommand(translateCommandService);
    this.registerMarkdownPostProcessor(mppService.postProcessor);
    this.addRibbonIcon(
      ribbonIconService.id,
      ribbonIconService.title,
      ribbonIconService.callback,
    );
  }

  private async afterSaveSettings(): Promise<void> {
    this.playerService.setSpeed(
      parseInt(this.settings.voiceOverSpeed.replace(/\D/g, '')),
    );

    this.ttsService.setApiKey(this.settings.apiKey);
    this.ttsService.setSource(this.settings.source);

    this.translationService.setApiKey(this.settings.apiKey);
    this.translationService.setSource(this.settings.source);
    this.translationService.setTarget(this.settings.target);

    this.actionsService.setPlayVariant(this.settings.playVariant);
    this.actionsService.setSource(this.settings.source);
    this.actionsService.setTarget(this.settings.target);
  }
}
