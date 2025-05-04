import { CheckService, ICheckService } from './check.service';
import {
  DEFAULT_SETTINGS,
  ISettings,
  SettingTabService,
} from './setting-tab.service';
import { Plugin, addIcon } from 'obsidian';

import { BlitzModalService } from './blitz-modal.service';
import { PartsService } from './parts.service';
import { RibbonIconService } from './ribbon-icon.service';
import { actionsService } from './actions.service';
import { blitzService } from './blitz.service';
import { cacheService } from './cache.service';
import { icon } from './icon';
import { mppService } from './mpp.service';
import { playerService } from './player.service';
import { translateCommandService } from './translate-command.service';
import { translationService } from './translation.service';
import { ttsService } from './tts.service';

export default class MemodackPlugin extends Plugin {
  settings!: ISettings;

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
    const partsService = new PartsService(this.app);

    ttsService.setApiKey(this.settings.apiKey);
    ttsService.setSource(this.settings.source);

    translationService.setApiKey(this.settings.apiKey);
    translationService.setSource(this.settings.source);
    translationService.setTarget(this.settings.target);

    actionsService.setPlayVariant(this.settings.playVariant);
    actionsService.setSource(this.settings.source);
    actionsService.setTarget(this.settings.target);

    const blitzModalService = new BlitzModalService(
      this.app,
      actionsService,
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

    actionsService.setPlayVariant(this.settings.playVariant);
    actionsService.setSource(this.settings.source);
    actionsService.setTarget(this.settings.target);
  }

  private getCacheDirectoryPath(): string {
    return this.manifest.dir
      ? `${this.manifest.dir}/cache`
      : `${this.app.vault.configDir}/plugins/${this.manifest.id}/cache`;
  }
}
