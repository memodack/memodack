import type { Editor } from "obsidian";
import { container } from "tsyringe";
import { AdapterService } from "./services/adapter.service";
import { AudioService } from "./services/audio.service";
import { BlitzService } from "./services/blitz.service";
import { BlitzModalService } from "./services/blitz-modal.service";
import { CacheService } from "./services/cache.service";
import { ConductorService } from "./services/conductor.service";
import { EditorService } from "./services/editor.service";
import { ManifestService } from "./services/manifest.service";
import { type IMppService, MppService } from "./services/mpp.service";
import { PartsService } from "./services/parts.service";
import { PathsService } from "./services/paths.service";
import { PlayerService } from "./services/player.service";
import { ProgressBarService } from "./services/progress-bar.service";
import { type IRibbonIconService, RibbonIconService } from "./services/ribbon-icon.service";
import { SettingTabService } from "./services/setting-tab.service";
import { type ISettingsService, SettingsService } from "./services/settings.service";
import { type ITranslateCommandService, TranslateCommandService } from "./services/translate-command.service";
import { TranslationService } from "./services/translation.service";
import { TtsService } from "./services/tts.service";
import { VaultService } from "./services/vault.service";
import { WorkspaceService } from "./services/workspace.service";
import type { TMemodackPlugin } from "./types";

export function registerValues(plugin: TMemodackPlugin) {
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

export function registerServices() {
  const services: Array<[string, any]> = [
    ["ISettingsService", SettingsService],
    ["IEditorService", EditorService],
    ["IManifestService", ManifestService],
    ["IVaultService", VaultService],
    ["IWorkspaceService", WorkspaceService],
    ["IPathsService", PathsService],
    ["ICacheService", CacheService],
    ["IConductorService", ConductorService],
    ["IMppService", MppService],
    ["ITranslationService", TranslationService],
    ["ITranslateCommandService", TranslateCommandService],
    ["IPartsService", PartsService],
    ["IPlayerService", PlayerService],
    ["IAudioService", AudioService],
    ["ITtsService", TtsService],
    ["IProgressBarService", ProgressBarService],
    ["SettingTabService", SettingTabService],
    ["IBlitzModalService", BlitzModalService],
    ["IBlitzService", BlitzService],
    ["IRibbonIconService", RibbonIconService],
    ["IAdapterService", AdapterService],
  ];

  services.forEach(([token, value]) => {
    container.registerSingleton(token, value);
  });
}

export function registerEditor(editor: Editor): void {
  container.register<Editor>("Editor", {
    useValue: editor,
  });
}

export function getSettingsService(): ISettingsService {
  return container.resolve<ISettingsService>("ISettingsService");
}

export function getMppService(): IMppService {
  return container.resolve<IMppService>("IMppService");
}

export function getSettingTabService(): SettingTabService {
  return container.resolve<SettingTabService>("SettingTabService");
}

export function getRibbonIconService(): IRibbonIconService {
  return container.resolve<IRibbonIconService>("IRibbonIconService");
}

export function getTranslateCommandService(): ITranslateCommandService {
  return container.resolve<ITranslateCommandService>("ITranslateCommandService");
}
