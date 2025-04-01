import { App, Modal } from 'obsidian';

import { IActionsService } from './actions.service';
import { IBlitzService } from './blitz.service';
import { IPart } from './parts.service';

export interface IBlitzModalService {
  setParts(parts: IPart[]): void;
}

export class BlitzModalService extends Modal implements IBlitzModalService {
  private actionsService: IActionsService;
  private blitzService: IBlitzService;
  private parts: IPart[] = [];

  constructor(
    app: App,

    actionsService: IActionsService,
    blitzService: IBlitzService,
  ) {
    super(app);
    this.actionsService = actionsService;
    this.blitzService = blitzService;
  }

  setParts(parts: IPart[]): void {
    this.parts = parts;
  }

  async onOpen(): Promise<void> {
    this.blitzService.create(this.parts);
    await this.createBlitz(0);
  }

  async onClose(): Promise<void> {
    this.setParts([]);
    const { contentEl } = this;
    contentEl.empty();
  }

  private async createBlitz(id: number): Promise<void> {
    const blitz = this.blitzService.getBlitz(id);

    if (!blitz) {
      this.close();
      return;
    }

    const { contentEl } = this;
    contentEl.empty();

    this.createQuestionElement(blitz.question);

    if (blitz.question !== blitz.text) {
      this.createTextElement(blitz.text);
    }

    this.actionsService.playValue(blitz.question);

    let nextButtonEl: HTMLButtonElement | undefined = undefined;
    let correctOptionEl: HTMLButtonElement | undefined = undefined;

    const answersButtons: HTMLButtonElement[] = [];

    const answersElement = contentEl.createEl('div');
    answersElement.addClass('memodack___blitz__answers');

    blitz.answers.forEach((item, index) => {
      const answerButtonElement = answersElement.createEl('button');

      if (blitz.correctAnswerId === index) {
        correctOptionEl = answerButtonElement;
      }

      answersButtons.push(answerButtonElement);

      answerButtonElement.setText(item);
      answerButtonElement.addEventListener('click', () => {
        answersButtons.forEach((item) => {
          item.disabled = true;
        });

        if (blitz.correctAnswerId === index) {
          answerButtonElement.addClass('correct');
          this.actionsService.playTranslation(item);
        } else {
          answerButtonElement.addClass('wrong');
          correctOptionEl?.addClass('correct');
          this.blitzService.repeatBlitz(id);
        }

        const blitzSize = this.blitzService.getSize();

        if (blitzSize === id) {
          this.close();
          return;
        }

        if (!nextButtonEl) {
          return;
        }

        nextButtonEl.disabled = false;
      });
    });

    this.createHrElement();

    const blitzNext = contentEl.createEl('div');
    blitzNext.addClass('memodack___blitz__next');

    nextButtonEl = blitzNext.createEl('button');
    nextButtonEl.setText('Next');
    nextButtonEl.disabled = true;

    nextButtonEl.addEventListener('click', () => {
      this.createBlitz(id + 1);
    });
  }

  private createQuestionElement(question: string): void {
    const { contentEl } = this;
    const questionH2Element = contentEl.createEl('h2');
    questionH2Element.setText(question);
    questionH2Element.addClass('memodack___blitz__question');
  }

  private createTextElement(text: string): void {
    const { contentEl } = this;
    const questionH2Element = contentEl.createEl('div');
    questionH2Element.setText(text);
    questionH2Element.addClass('memodack___blitz__text');
  }

  private createHrElement(): void {
    const { contentEl } = this;
    const hrElement = contentEl.createEl('hr');
    hrElement.addClass('memodack___blitz__hr');
  }
}
