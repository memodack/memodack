import "reflect-metadata";
import { addIcon, Plugin } from "obsidian";
import {
  getMppService,
  getRibbonIconService,
  getSettingsService,
  getSettingTabService,
  getTranslateCommandService,
  registerEditor,
  registerServices,
  registerValues,
} from "./register";
import type { TSettings } from "./types";

export default class MemodackPlugin extends Plugin {
  async loadSettings(): Promise<void> {
    const settings = (await this.loadData()) as TSettings;
    getSettingsService().setSettings(settings);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(getSettingsService().getSettings());
  }

  async onload(): Promise<void> {
    registerValues(this);
    registerServices();

    await this.loadSettings();

    addIcon(this.manifest.id, getRibbonIconService().getIcon());

    this.addSettingTab(getSettingTabService());

    this.addCommand({
      id: getTranslateCommandService().getId(),
      name: getTranslateCommandService().getName(),
      editorCallback: (editor) => {
        registerEditor(editor);
        return getTranslateCommandService().getCallback();
      },
    });

    this.registerMarkdownPostProcessor(getMppService().getPostProcessor);

    this.addRibbonIcon(this.manifest.id, this.manifest.name, getRibbonIconService().getCallback);
  }
}
