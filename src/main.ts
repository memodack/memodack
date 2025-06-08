import { Plugin, addIcon } from 'obsidian';

import { AdapterService } from './services/adapter.service';
import { AudioService } from './services/audio.service';
import { BlitzModalService } from './services/blitz-modal.service';
import { CacheService } from './services/cache.service';
import { ConductorService } from './services/conductor.service';
import { EditorService } from './services/editor.service';
import { ManifestService } from './services/manifest.service';
import { MppService } from './services/mpp.service';
import { PartsService } from './services/parts.service';
import { PathsService } from './services/paths.service';
import { PlayerService } from './services/player.service';
import { RibbonIconService } from './services/ribbon-icon.service';
import { SettingTabService } from './services/setting-tab.service';
import { TSettings } from './types';
import { TranslateCommandService } from './services/translate-command.service';
import { TranslationService } from './services/translation.service';
import { TtsService } from './services/tts.service';
import { VaultService } from './services/vault.service';
import { WorkspaceService } from './services/workspace.service';
import { blitzService } from './services/blitz.service';
import { progressBarService } from './services/progress-bar.service';
import { settingsService } from './services/settings.service';

export default class MemodackPlugin extends Plugin {
  async loadSettings(): Promise<void> {
    const settings = (await this.loadData()) as TSettings;
    settingsService.setSettings(settings);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(settingsService.getSettings());
  }

  async onload(): Promise<void> {
    await this.loadSettings();

    addIcon(RibbonIconService.id, RibbonIconService.svg);

    /**
     * Initialize VaultService
     */
    const manifestService = new ManifestService(this.manifest);

    /**
     * Initialize VaultService
     */
    const vaultService = new VaultService(this.app.vault);

    /**
     * Initialize AdapterService
     */
    const adapterService = new AdapterService(this.app.vault.adapter);

    /**
     * Initialize PathsService
     */
    const pathsService = new PathsService(manifestService, vaultService);

    /**
     * Initialize WorkspaceService
     */
    const workspaceService = new WorkspaceService(this.app.workspace);

    /**
     * Initialize PartsService
     */
    const partsService = new PartsService(vaultService, workspaceService);

    /**
     * Initialize TtsService
     */
    const ttsService = new TtsService(settingsService);

    /**
     * Initialize PlayerService
     */
    const playerService = new PlayerService(settingsService);

    /**
     * Initialize CacheService
     */
    const cacheService = new CacheService(
      pathsService,
      vaultService,
      adapterService,
    );

    /**
     * Initialize AudioService
     */
    const audioService = new AudioService(
      ttsService,
      cacheService,
      playerService,
    );

    /**
     * Initialize ConductorService
     */
    const conductorService = new ConductorService(
      settingsService,
      audioService,
    );

    /**
     * Initialize BlitzModalService
     */
    const blitzModalService = new BlitzModalService(
      this.app,
      blitzService,
      progressBarService,
      conductorService,
    );

    /**
     * Initialize RibbonIconService
     */
    const ribbonIconService = new RibbonIconService(
      workspaceService,
      partsService,
      blitzModalService,
    );

    /**
     * Initialize TranslationService
     */
    const translationService = new TranslationService(settingsService);

    /**
     * Initialize SettingTabService
     */
    const settingTabService = new SettingTabService(
      this.app,
      this,
      cacheService,
      translationService,
      ttsService,
    );

    this.addSettingTab(settingTabService);

    this.addCommand({
      id: TranslateCommandService.id,
      name: TranslateCommandService.name,
      editorCallback: (editor) => {
        /**
         * Initialize EditorService
         */
        const editorService = new EditorService(editor);

        /**
         * Initialize TranslateCommandService
         */
        const translateCommandService = new TranslateCommandService(
          editorService,
          translationService,
          settingsService,
          conductorService,
        );

        return translateCommandService.getCallback();
      },
    });

    /**
     * Initialize MppService
     */
    const mppService = new MppService(conductorService);

    this.registerMarkdownPostProcessor(mppService.getPostProcessor);

    this.addRibbonIcon(
      RibbonIconService.id,
      RibbonIconService.title,
      ribbonIconService.getCallback,
    );
  }
}
