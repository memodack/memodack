import type { IConductorService } from "./conductor.service";
import type { IEditorService } from "./editor.service";
import type { ISettingsService } from "./settings.service";
import type { ITranslationService } from "./translation.service";

export interface ITranslateCommandService {
  getCallback: () => Promise<void>;
}

export class TranslateCommandService implements ITranslateCommandService {
  static readonly id = "translate";
  static readonly name = "Translate";

  private editorService: IEditorService;
  private translationService: ITranslationService;
  private settingsService: ISettingsService;
  private conductorService: IConductorService;

  constructor(
    editorService: IEditorService,
    translationService: ITranslationService,
    settingsService: ISettingsService,
    conductorService: IConductorService,
  ) {
    this.editorService = editorService;
    this.translationService = translationService;
    this.settingsService = settingsService;
    this.conductorService = conductorService;
  }

  getCallback = async (): Promise<void> => {
    const selection = this.editorService.getSelection();

    if (!selection) {
      return;
    }

    const source = this.settingsService.getSource();
    const target = this.settingsService.getTarget();

    const translation = await this.translationService.translate(
      source,
      target,
      selection,
    );

    if (!translation) {
      return;
    }

    this.editorService.replaceSelection(`{${selection}|${translation}}`);

    await this.conductorService.playValueAndTranslation(selection, translation);
  };
}
