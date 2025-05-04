import { App, Notice, PluginSettingTab, Setting } from 'obsidian';

import MemodackPlugin from './main';
import { languages } from './languages';
import prettyBytes from 'pretty-bytes';

export type TPlayVariant =
  | 'nothing'
  | 'value'
  | 'translation'
  | 'value-and-translation'
  | 'translation-and-value';

export interface ISettings {
  source: string;
  target: string;
  playVariant: TPlayVariant;
  voiceOverSpeed: string;
  apiKey: string;
}

export const DEFAULT_SETTINGS: Partial<ISettings> = {
  source: 'en',
  target: 'uk',
  playVariant: 'translation-and-value',
  voiceOverSpeed: 'x1',
};

export class SettingTabService extends PluginSettingTab {
  plugin: MemodackPlugin;
  private cacheSize: number = 0;

  constructor(app: App, plugin: MemodackPlugin) {
    super(app, plugin);
    this.plugin = plugin;

    this.plugin.cacheService
      .getSize()
      .then((cacheSize) => {
        this.cacheSize = cacheSize;
      })
      .catch(() => {
        this.cacheSize = 0;
      });
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
          .setValue(this.plugin.settings.apiKey || '')
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value;
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

    new Setting(containerEl)
      .setName('Native')
      .setDesc('This is the language you speak natively.')
      .addDropdown((dropdown) => {
        dropdown
          .addOptions(languages)
          .setValue(this.plugin.settings.target)
          .onChange(async (value) => {
            this.plugin.settings.target = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Document')
      .setDesc('This is the language of the document.')
      .addDropdown((dropdown) => {
        dropdown
          .addOptions(languages)
          .setValue(this.plugin.settings.source)
          .onChange(async (value) => {
            this.plugin.settings.source = value;
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
            x1: 'Normal',
            x2: 'x2',
            x3: 'x3',
          })
          .setValue(this.plugin.settings.voiceOverSpeed)
          .onChange(async (value) => {
            this.plugin.settings.voiceOverSpeed = value;
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
            nothing: 'Nothing',
            value: 'Value',
            translation: 'Translation',
            'value-and-translation': 'Value + Translation',
            'translation-and-value': 'Translation + Value',
          })
          .setValue(this.plugin.settings.playVariant)
          .onChange(async (value): Promise<void> => {
            this.plugin.settings.playVariant = value as TPlayVariant;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl).setName('Optimization').setHeading();

    const cacheSetting = new Setting(containerEl)
      .setName('Cache')
      .setDesc(`${prettyBytes(this.cacheSize)}.`)
      .addButton((btn) =>
        btn
          .setButtonText('Clear')
          .setCta()
          .onClick(async () => {
            await this.plugin.cacheService.clear();
            cacheSetting.setDesc(prettyBytes(0));
          }),
      );
  }

  private async check(): Promise<void> {
    const apiKey = this.plugin.settings.apiKey;

    if (!apiKey) {
      new Notice('No API key entered.');
      return;
    }

    await this.plugin.checkService.check();
  }
}
