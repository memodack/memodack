import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import {
  ELanguage,
  EPlayVariant,
  EVoiceOverSpeed,
  TMemodackPlugin,
} from '../types';

import { ICacheService } from './cache.service';
import { ISettingsService } from './settings.service';
import { ITranslationService } from './translation.service';
import { ITtsService } from './tts.service';
import prettyBytes from 'pretty-bytes';

export class SettingTabService extends PluginSettingTab {
  private readonly plugin: TMemodackPlugin;
  private readonly cacheService: ICacheService;
  private readonly translationService: ITranslationService;
  private readonly ttsService: ITtsService;
  private readonly settingsService: ISettingsService;
  private cacheSize: number = 0;

  constructor(
    app: App,
    plugin: TMemodackPlugin,
    cacheService: ICacheService,
    translationService: ITranslationService,
    ttsService: ITtsService,
    settingsService: ISettingsService,
  ) {
    super(app, plugin);

    this.plugin = plugin;
    this.cacheService = cacheService;
    this.translationService = translationService;
    this.ttsService = ttsService;
    this.settingsService = settingsService;

    this.getCacheSize();
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl).setName('Provider (Google)').setHeading();

    new Setting(containerEl)
      .setName('API Key')
      .setDesc('API key for translation and text-to-speech services.')
      .addText((text) => {
        text
          .setValue(this.settingsService.getApiKey())
          .onChange(async (value) => {
            this.settingsService.setApiKey(value);
            await this.plugin.saveSettings();
          })
          .inputEl.setAttribute('type', 'password');
      });

    new Setting(containerEl)
      .setName('Connection')
      .setDesc('Check access to services by API key.')
      .addButton((btn) =>
        btn
          .setButtonText('Check')
          .setCta()
          .onClick(async () => {
            await this.check();
          }),
      );

    new Setting(containerEl).setName('Language').setHeading();

    const options: Record<string, string> = {};

    Object.keys(ELanguage).forEach((key) => {
      options[ELanguage[key as keyof typeof ELanguage]] = key;
    });

    new Setting(containerEl)
      .setName('Native')
      .setDesc('This is the language you speak natively.')
      .addDropdown((dropdown) => {
        dropdown
          .addOptions(options)
          .setValue(this.settingsService.getTarget())
          .onChange(async (value) => {
            this.settingsService.setTarget(value as ELanguage);
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Document')
      .setDesc('This is the language of the document.')
      .addDropdown((dropdown) => {
        dropdown
          .addOptions(options)
          .setValue(this.settingsService.getSource())
          .onChange(async (value) => {
            this.settingsService.setSource(value as ELanguage);
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl).setName('Voiceover').setHeading();

    new Setting(containerEl)
      .setName('Playback speed')
      .setDesc('The speed at which the voiceover will be performed.')
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            [EVoiceOverSpeed.Normal]: 'Normal',
            [EVoiceOverSpeed.x2]: 'x2',
            [EVoiceOverSpeed.x3]: 'x3',
          })
          .setValue(this.settingsService.getVoiceOverSpeed().toString())
          .onChange(async (value): Promise<void> => {
            this.settingsService.setVoiceOverSpeed(parseInt(value));
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl).setName('Actions').setHeading();

    new Setting(containerEl)
      .setName('When pressed play')
      .setDesc('Will be voiced when you click on a part.')
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            [EPlayVariant.Nothing]: 'Nothing',
            [EPlayVariant.Value]: 'Value',
            [EPlayVariant.Translation]: 'Translation',
            [EPlayVariant.ValueAndTranslation]: 'Value + Translation',
            [EPlayVariant.TranslationAndValue]: 'Translation + Value',
          })
          .setValue(this.settingsService.getPlayVariant())
          .onChange(async (value): Promise<void> => {
            this.settingsService.setPlayVariant(value as EPlayVariant);
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl).setName('Optimization').setHeading();

    const cacheSetting = new Setting(containerEl)
      .setName('Cache')
      .setDesc(prettyBytes(this.cacheSize))
      .addButton((btn) =>
        btn
          .setButtonText('Clear')
          .setCta()
          .onClick(async () => {
            await this.cacheService.clear();
            cacheSetting.setDesc(prettyBytes(0));
          }),
      );
  }

  private async check(): Promise<void> {
    const apiKey = this.settingsService.getApiKey();

    if (!apiKey) {
      new Notice('No API key entered.');
      return;
    }

    await this.translationService.test();
    await this.ttsService.test();
  }

  private getCacheSize(): void {
    this.cacheService
      .getSize()
      .then((cacheSize) => {
        this.cacheSize = cacheSize;
      })
      .catch(() => {
        this.cacheSize = 0;
      });
  }
}
