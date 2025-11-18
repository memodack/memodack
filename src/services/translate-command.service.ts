import { inject, injectable } from "tsyringe";
import type { ITranslationService } from "../types";
import type { IConductorService } from "./conductor.service";
import type { IEditorService } from "./editor.service";
import type { ISettingsService } from "./settings.service";

export interface ITranslateCommandService {
  getCallback: () => Promise<void>;
}

@injectable()
export class TranslateCommandService implements ITranslateCommandService {
  constructor(
    @inject("IEditorService") private readonly editorService: IEditorService,
    @inject("ITranslationService")
    private readonly translationService: ITranslationService,
    @inject("ISettingsService")
    private readonly settingsService: ISettingsService,
    @inject("IConductorService")
    private readonly conductorService: IConductorService,
  ) {}

  getCallback = async (): Promise<void> => {
    const selection = this.editorService.getSelection();

    if (!selection) {
      return;
    }

    const source = this.settingsService.getSource();
    const target = this.settingsService.getTarget();

    const translation = await this.translationService.translate(source, target, selection);

    if (!translation) {
      return;
    }

    this.editorService.replaceSelection(`{${selection}|${translation}}`);

    await this.conductorService.playValueAndTranslation(selection, translation);
  };
}
