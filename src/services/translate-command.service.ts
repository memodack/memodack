import { inject, singleton } from "tsyringe";
import type { IConductorService } from "./conductor.service";
import type { IEditorService } from "./editor.service";
import type { ISettingsService } from "./settings.service";
import type { ITranslationService } from "./translation.service";

export interface ITranslateCommandService {
  getId(): string;
  getName(): string;
  getCallback: () => Promise<void>;
}

@singleton()
export class TranslateCommandService implements ITranslateCommandService {
  private id: string = "translate";
  private name: string = "Translate";

  constructor(
    @inject("IEditorService") private readonly editorService: IEditorService,
    @inject("ITranslationService")
    private readonly translationService: ITranslationService,
    @inject("ISettingsService")
    private readonly settingsService: ISettingsService,
    @inject("IConductorService")
    private readonly conductorService: IConductorService,
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

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
