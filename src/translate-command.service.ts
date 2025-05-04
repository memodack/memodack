import { Command, Editor } from 'obsidian';
import { IActionsService, actionsService } from './actions.service';
import { ITranslationService, translationService } from './translation.service';

export class TranslateCommandService implements Command {
  id = 'translate';
  name = 'Translate';

  private translationService: ITranslationService;
  private actionService: IActionsService;

  constructor(
    translationService: ITranslationService,
    actionService: IActionsService,
  ) {
    this.translationService = translationService;
    this.actionService = actionService;
  }

  async editorCallback(editor: Editor): Promise<void> {
    const selection = editor.getSelection();
    const translation = await this.translationService.translate(selection);

    if (!translation) {
      return;
    }

    editor.replaceSelection(`{${selection}|${translation}}`);
    await this.actionService.playValueAndTranslation(selection, translation);
  }
}

export const translateCommandService = new TranslateCommandService(
  translationService,
  actionsService,
);
