import "reflect-metadata";
import { addIcon, Plugin } from "obsidian";
import { register } from "./register";
import type { TSettings } from "./types";

export default class MemodackPlugin extends Plugin {
  async loadSettings(): Promise<void> {
    const settings = (await this.loadData()) as TSettings;
    register.getSettingsService().setSettings(settings);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(register.getSettingsService().getSettings());
  }

  async onload(): Promise<void> {
    register.registerValues(this);
    register.registerServices();

    await this.loadSettings();

    addIcon(this.manifest.id, register.getRibbonIconService().getIcon());

    this.addSettingTab(register.getSettingTabService());

    this.addCommand({
      id: "translate",
      name: "Translate",
      icon: "languages",
      editorCallback: (editor) => {
        register.registerEditor(editor);
        return register.getTranslateCommandService().getCallback();
      },
    });

    this.registerMarkdownPostProcessor(register.getMppService().getPostProcessor);

    this.addRibbonIcon(this.manifest.id, this.manifest.name, register.getRibbonIconService().getCallback);
  }
}
