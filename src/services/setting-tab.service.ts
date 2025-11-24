import { type App, Notice, PluginSettingTab, Setting } from "obsidian";
import prettyBytes from "pretty-bytes";
import { inject, singleton } from "tsyringe";
import { ELanguage, EPlayVariant, EProvider, ETextTruncate, EVoiceOverSpeed, type TMemodackPlugin } from "../types";
import type { ICacheService } from "./cache.service";
import type { ISettingsService } from "./settings.service";
import type { ITesterService } from "./tester.service";

@singleton()
export class SettingTabService extends PluginSettingTab {
  private cacheSize: number = 0;

  private apiKeySettings!: Setting;
  private apiUrlSettings!: Setting;
  private checkSettings!: Setting;
  private nativeLanguageSettings!: Setting;
  private documentLanguageSettings!: Setting;
  private playbackSpeedSettings!: Setting;
  private playVariantSettings!: Setting;

  constructor(
    @inject("app") app: App,
    @inject("plugin") private readonly plugin: TMemodackPlugin,
    @inject("ICacheService") private readonly cacheService: ICacheService,
    @inject("ITesterService") private readonly testerService: ITesterService,
    @inject("ISettingsService")
    private readonly settingsService: ISettingsService,
  ) {
    super(app, plugin);

    this.getCacheSize();
  }

  display(): void {
    this.getCacheSize();

    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl).setName("General").setHeading();

    new Setting(containerEl)
      .setName("Provider")
      .setDesc("Select the service provider to use.")
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            [EProvider.Google]: "Google",
            [EProvider.Custom]: "Custom",
          })
          .setValue(this.settingsService.getProvider())
          .onChange(async (value): Promise<void> => {
            this.settingsService.setProvider(value as EProvider);
            await this.plugin.saveSettings();

            this.controlProviderRequirements(value as EProvider);

            this.checkProviderApiAccess(value as EProvider);
          });
      });

    this.apiKeySettings = new Setting(containerEl)
      .setName("API Key")
      .setDesc("API key for translation and text-to-speech services.")
      .addText((text) => {
        text
          .setValue(this.settingsService.getApiKey())
          .onChange(async (value) => {
            this.settingsService.setApiKey(value);
            await this.plugin.saveSettings();

            this.controlApiAccessRequirements(this.apiKeyCondition(value));
          })
          .inputEl.setAttribute("type", "password");
      });

    this.apiUrlSettings = new Setting(containerEl)
      .setName("API URL")
      .setDesc("A custom API URL for your own server.")
      .addText((text) => {
        text.setValue(this.settingsService.getApiUrl()).onChange(async (value) => {
          this.settingsService.setApiUrl(value);
          await this.plugin.saveSettings();

          this.controlApiAccessRequirements(this.apiUrlCondition(value));
        });
      });

    this.checkSettings = new Setting(containerEl)
      .setName("Connection")
      .setDesc("Check access to services by API key.")
      .addButton((btn) =>
        btn
          .setButtonText("Check")
          .setCta()
          .onClick(async () => {
            await this.check();
          }),
      );

    new Setting(containerEl).setName("Language").setHeading();

    const options: Record<string, string> = {};

    Object.keys(ELanguage).forEach((key) => {
      options[ELanguage[key as keyof typeof ELanguage]] = key;
    });

    this.nativeLanguageSettings = new Setting(containerEl)
      .setName("Native")
      .setDesc("This is the language you speak natively.")
      .addDropdown((dropdown) => {
        dropdown
          .addOptions(options)
          .setValue(this.settingsService.getTarget())
          .onChange(async (value) => {
            this.settingsService.setTarget(value as ELanguage);
            await this.plugin.saveSettings();
          });
      });

    this.documentLanguageSettings = new Setting(containerEl)
      .setName("Document")
      .setDesc("This is the language of the document.")
      .addDropdown((dropdown) => {
        dropdown
          .addOptions(options)
          .setValue(this.settingsService.getSource())
          .onChange(async (value) => {
            this.settingsService.setSource(value as ELanguage);
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl).setName("Voiceover").setHeading();

    this.playbackSpeedSettings = new Setting(containerEl)
      .setName("Playback")
      .setDesc("The speed at which the voiceover will be performed.")
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            [EVoiceOverSpeed.Normal]: "Normal",
            [EVoiceOverSpeed.x2]: "x2",
            [EVoiceOverSpeed.x3]: "x3",
          })
          .setValue(this.settingsService.getVoiceOverSpeed().toString())
          .onChange(async (value): Promise<void> => {
            this.settingsService.setVoiceOverSpeed(parseInt(value, 10));
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl).setName("Actions").setHeading();

    this.playVariantSettings = new Setting(containerEl)
      .setName("Pressing")
      .setDesc("Will be voiced when you click on a part.")
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            [EPlayVariant.Disabled]: "Disabled",
            [EPlayVariant.Value]: "Value",
            [EPlayVariant.Translation]: "Translation",
            [EPlayVariant.ValueAndTranslation]: "Value + Translation",
            [EPlayVariant.TranslationAndValue]: "Translation + Value",
          })
          .setValue(this.settingsService.getPlayVariant())
          .onChange(async (value): Promise<void> => {
            this.settingsService.setPlayVariant(value as EPlayVariant);
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl).setName("Extra").setHeading();

    new Setting(containerEl)
      .setName("Divider")
      .setDesc('Split translation values using the ";" symbol.')
      .addToggle((toggle) =>
        toggle.setValue(this.settingsService.getTranslationDivider()).onChange(async (value) => {
          this.settingsService.setTranslationDivider(value);
          await this.plugin.saveSettings();
        }),
      );

    new Setting(containerEl)
      .setName("Truncate")
      .setDesc("Cut a part of the answer in practice mode.")
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            [ETextTruncate.Disabled]: "Disabled",
            [ETextTruncate.Left]: "Left",
            [ETextTruncate.Right]: "Right",
          })
          .setValue(this.settingsService.getTextTruncate())
          .onChange(async (value): Promise<void> => {
            this.settingsService.setTextTruncate(value as ETextTruncate);
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl).setName("Optimization").setHeading();

    const cacheSetting = new Setting(containerEl)
      .setName("Cache")
      .setDesc(prettyBytes(this.cacheSize))
      .addButton((btn) =>
        btn
          .setButtonText("Clear")
          .setCta()
          .onClick(async () => {
            await this.cacheService.clear();
            cacheSetting.setDesc(prettyBytes(0));
          }),
      );

    const provider = this.settingsService.getProvider();
    this.checkProviderApiAccess(provider);

    this.controlProviderRequirements(this.settingsService.getProvider());
  }

  private async check(): Promise<void> {
    const provider = this.settingsService.getProvider();

    if (provider === EProvider.Google) {
      const apiKey = this.settingsService.getApiKey();

      if (!apiKey?.length) {
        new Notice("No API key provided.");
        return;
      }
    } else {
      const apiUrl = this.settingsService.getApiUrl();

      if (!apiUrl?.length) {
        new Notice("No API URL provided.");
        return;
      }
    }

    await this.testerService.testTranslationService();
    await this.testerService.testTtsService();
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

  private controlProviderRequirements(provider: EProvider): void {
    if (provider === EProvider.Google) {
      this.apiKeySettings.settingEl.style.display = "";
      this.apiUrlSettings.settingEl.style.display = "none";

      return;
    }

    this.apiKeySettings.settingEl.style.display = "none";
    this.apiUrlSettings.settingEl.style.display = "";
  }

  private controlApiAccessRequirements(value: boolean): void {
    [
      this.checkSettings,
      this.nativeLanguageSettings,
      this.documentLanguageSettings,
      this.playbackSpeedSettings,
      this.playVariantSettings,
    ].forEach((item) => {
      item.setDisabled(!value);
    });
  }

  private checkProviderApiAccess(provider: EProvider): void {
    if (provider === EProvider.Google) {
      const apiKey = this.settingsService.getApiKey();
      this.controlApiAccessRequirements(this.apiKeyCondition(apiKey));
      return;
    } else {
      const apiUrl = this.settingsService.getApiUrl();
      this.controlApiAccessRequirements(this.apiUrlCondition(apiUrl));
    }
  }

  private apiKeyCondition(value: string): boolean {
    return value.length >= 39;
  }

  private apiUrlCondition(value: string): boolean {
    return value.length >= 7;
  }
}
