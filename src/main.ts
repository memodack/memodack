import { ActionsService, IActionsService } from './actions.service';
import { CheckService, ICheckService } from './check.service';
import {
  DEFAULT_SETTINGS,
  ISettings,
  SettingTabService,
} from './setting-tab.service';
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
import { cacheService } from './cache.service';
import { icon } from './icon';
import { playerService } from './player.service';
import { translationService } from './translation.service';
import { ttsService } from './tts.service';

export default class MemodackPlugin extends Plugin {
  settings!: ISettings;

  actionsService!: IActionsService;
  checkService!: ICheckService;

  async loadSettings(): Promise<void> {
    const loadedData = (await this.loadData()) as ISettings;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    this.afterSaveSettings();
  }

  async onload(): Promise<void> {
    await this.loadSettings();

    addIcon(icon.id, icon.svg);

    cacheService.setVault(this.app.vault);
    cacheService.setDirectoryPath(this.getCacheDirectoryPath());

    const settingTabService = new SettingTabService(
      this.app,
      this,
      cacheService,
    );

    ttsService.setApiKey(this.settings.apiKey);
    ttsService.setSource(this.settings.source);

    translationService.setApiKey(this.settings.apiKey);
    translationService.setSource(this.settings.source);
    translationService.setTarget(this.settings.target);

    const hashService = new HashService();
    const audioService = new AudioService(
      cacheService,
      playerService,
      ttsService,
      hashService,
    );
    this.actionsService = new ActionsService(
      audioService,
      this.settings.playVariant,
      this.settings.source,
      this.settings.target,
    );
    const translateCommandService = new TranslateCommandService(
      translationService,
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
    this.checkService = new CheckService(translationService, ttsService);

    this.addSettingTab(settingTabService);
    this.addCommand(translateCommandService);
    this.registerMarkdownPostProcessor(mppService.postProcessor);
    this.addRibbonIcon(
      ribbonIconService.id,
      ribbonIconService.title,
      ribbonIconService.callback,
    );
  }

  private afterSaveSettings(): void {
    playerService.setSpeed(
      parseInt(this.settings.voiceOverSpeed.replace(/\D/g, '')),
    );

    ttsService.setApiKey(this.settings.apiKey);
    ttsService.setSource(this.settings.source);

    translationService.setApiKey(this.settings.apiKey);
    translationService.setSource(this.settings.source);
    translationService.setTarget(this.settings.target);

    this.actionsService.setPlayVariant(this.settings.playVariant);
    this.actionsService.setSource(this.settings.source);
    this.actionsService.setTarget(this.settings.target);
  }

  private getCacheDirectoryPath(): string {
    return this.manifest.dir
      ? `${this.manifest.dir}/cache`
      : `${this.app.vault.configDir}/plugins/${this.manifest.id}/cache`;
  }
}
