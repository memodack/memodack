import {
  BlitzModalService,
  DEFAULT_SETTINGS,
  ISettings,
  PartsService,
  RibbonIconService,
  SettingTabService,
  actionsService,
  blitzService,
  cacheService,
  checkService,
  mppService,
  translateCommandService,
  triggerSettingsService,
} from './services';
import { Plugin, addIcon } from 'obsidian';

import { icon } from './icon';

export default class MemodackPlugin extends Plugin {
  settings!: ISettings;

  async loadSettings(): Promise<void> {
    const loadedData = (await this.loadData()) as ISettings;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    this.triggerSettings();
  }

  async onload(): Promise<void> {
    await this.loadSettings();

    this.triggerSettings();

    addIcon(icon.id, icon.svg);

    cacheService.setVault(this.app.vault);
    cacheService.setDirectoryPath(this.getCacheDirectoryPath());

    const settingTabService = new SettingTabService(
      this.app,
      this,
      cacheService,
      checkService,
    );

    const partsService = new PartsService(this.app);

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

    this.addSettingTab(settingTabService);
    this.addCommand(translateCommandService);
    this.registerMarkdownPostProcessor(mppService.postProcessor);
    this.addRibbonIcon(
      ribbonIconService.id,
      ribbonIconService.title,
      ribbonIconService.callback,
    );
  }

  private triggerSettings(): void {
    triggerSettingsService.trigger({
      voiceOverSpeed: this.settings.voiceOverSpeed,
      apiKey: this.settings.apiKey,
      source: this.settings.source,
      target: this.settings.target,
      playVariant: this.settings.playVariant,
    });
  }

  private getCacheDirectoryPath(): string {
    return this.manifest.dir
      ? `${this.manifest.dir}/cache`
      : `${this.app.vault.configDir}/plugins/${this.manifest.id}/cache`;
  }
}
