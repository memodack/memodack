import type { Editor } from "obsidian";
import { container } from "tsyringe";
import { PracticeModalService } from "./practice/practice-modal.service";
import { ProgressService } from "./practice/progress.service";
import { QuestsService } from "./practice/quests.service";
import { RandomService } from "./practice/random.service";
import { TextService } from "./practice/text.service";
import { AdapterService } from "./services/adapter.service";
import { AudioService } from "./services/audio.service";
import { CacheService } from "./services/cache.service";
import { ConductorService } from "./services/conductor.service";
import { CustomTranslationService } from "./services/custom-translation.service";
import { CustomTtsService } from "./services/custom-tts.service";
import { EditorService } from "./services/editor.service";
import { GoogleTranslationService } from "./services/google-translation.service";
import { GoogleTtsService } from "./services/google-tts.service";
import { ManifestService } from "./services/manifest.service";
import { type IMppService, MppService } from "./services/mpp.service";
import { PathsService } from "./services/paths.service";
import { PlayerService } from "./services/player.service";
import { type IRibbonIconService, RibbonIconService } from "./services/ribbon-icon.service";
import { SettingTabService } from "./services/setting-tab.service";
import { type ISettingsService, SettingsService } from "./services/settings.service";
import { TesterService } from "./services/tester.service";
import { type ITranslateCommandService, TranslateCommandService } from "./services/translate-command.service";
import { TranslationService } from "./services/translation.service";
import { TtsService } from "./services/tts.service";
import { VaultService } from "./services/vault.service";
import { WordsService } from "./services/words.service";
import { WorkspaceService } from "./services/workspace.service";
import type { TMemodackPlugin } from "./types";

export interface IRegister {
  registerValues(plugin: TMemodackPlugin): void;
  registerServices(): void;
  registerEditor(editor: Editor): void;
  getSettingsService(): ISettingsService;
  getMppService(): IMppService;
  getSettingTabService(): SettingTabService;
  getRibbonIconService(): IRibbonIconService;
  getTranslateCommandService(): ITranslateCommandService;
}

export class Register implements IRegister {
  registerValues(plugin: TMemodackPlugin): void {
    const values: Array<[string, unknown]> = [
      ["plugin", plugin],
      ["app", plugin.app],
      ["Vault", plugin.app.vault],
      ["PluginManifest", plugin.manifest],
      ["DataAdapter", plugin.app.vault.adapter],
      ["Workspace", plugin.app.workspace],
    ];

    values.forEach(([token, value]) => {
      container.register(token, { useValue: value });
    });
  }

  registerServices(): void {
    const services: Array<[string, any]> = [
      ["ISettingsService", SettingsService],
      ["IManifestService", ManifestService],
      ["IVaultService", VaultService],
      ["IWorkspaceService", WorkspaceService],
      ["IPathsService", PathsService],
      ["ICacheService", CacheService],
      ["IConductorService", ConductorService],
      ["IMppService", MppService],
      ["ITranslationService", TranslationService],
      ["IWordsService", WordsService],
      ["IPlayerService", PlayerService],
      ["IAudioService", AudioService],
      ["ITtsService", TtsService],
      ["SettingTabService", SettingTabService],
      ["IRibbonIconService", RibbonIconService],
      ["IAdapterService", AdapterService],
      ["ITextService", TextService],
      ["ITextService", TextService],
      ["GoogleTranslationService", GoogleTranslationService],
      ["CustomTranslationService", CustomTranslationService],
      ["GoogleTtsService", GoogleTtsService],
      ["CustomTtsService", CustomTtsService],
      ["ITesterService", TesterService],
      ["IPracticeModalService", PracticeModalService],
      ["IProgressService", ProgressService],
      ["IQuestsService", QuestsService],
      ["IRandomService", RandomService],
    ];

    services.forEach(([token, value]) => {
      container.registerSingleton(token, value);
    });

    container.register("ITranslateCommandService", TranslateCommandService);
    container.register("IEditorService", EditorService);
  }

  registerEditor(editor: Editor): void {
    container.register<Editor>("Editor", {
      useValue: editor,
    });
  }

  getSettingsService(): ISettingsService {
    return container.resolve<ISettingsService>("ISettingsService");
  }

  getMppService(): IMppService {
    return container.resolve<IMppService>("IMppService");
  }

  getSettingTabService(): SettingTabService {
    return container.resolve<SettingTabService>("SettingTabService");
  }

  getRibbonIconService(): IRibbonIconService {
    return container.resolve<IRibbonIconService>("IRibbonIconService");
  }

  getTranslateCommandService(): ITranslateCommandService {
    return container.resolve<ITranslateCommandService>("ITranslateCommandService");
  }
}

export const register = new Register();
