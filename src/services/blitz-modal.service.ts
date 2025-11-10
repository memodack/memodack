import { type App, Modal } from "obsidian";

import type { IBlitzService } from "./blitz.service";
import type { IConductorService } from "./conductor.service";
import type { IPart } from "./parts.service";
import type { IProgressBarService } from "./progress-bar.service";

export interface IBlitzModalService {
  setParts(parts: IPart[]): void;
}

export class BlitzModalService extends Modal implements IBlitzModalService {
  private blitzService: IBlitzService;
  private progressBarService: IProgressBarService;
  private conductorService: IConductorService;
  private parts: IPart[] = [];

  constructor(
    app: App,
    blitzService: IBlitzService,
    progressBarService: IProgressBarService,
    conductorService: IConductorService,
  ) {
    super(app);
    this.blitzService = blitzService;
    this.progressBarService = progressBarService;
    this.conductorService = conductorService;
  }

  setParts(parts: IPart[]): void {
    this.parts = parts;
  }

  onOpen(): void {
    this.blitzService.create(this.parts);

    const id = 0;

    this.progressBarService.create(this.contentEl, this.parts.length, id);
    this.createBlitz(id);
  }

  onClose(): void {
    this.setParts([]);
    const { contentEl } = this;
    contentEl.empty();
  }

  private createBlitz(id: number): void {
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

    void this.conductorService.playValue(blitz.question);

    let nextButtonEl: HTMLButtonElement | undefined;
    let correctOptionEl: HTMLButtonElement | undefined;

    const answersButtons: HTMLButtonElement[] = [];

    const answersElement = contentEl.createEl("div");
    answersElement.addClass("memodack___blitz__answers");

    blitz.answers.forEach((item, index) => {
      const answerButtonElement = answersElement.createEl("button");

      if (blitz.correctAnswerId === index) {
        correctOptionEl = answerButtonElement;
      }

      answersButtons.push(answerButtonElement);

      answerButtonElement.setText(item);
      answerButtonElement.addEventListener("click", () => {
        answersButtons.forEach((item) => {
          item.disabled = true;
        });

        if (blitz.correctAnswerId === index) {
          answerButtonElement.addClass("correct");
          void this.conductorService.playTranslation(item);
        } else {
          answerButtonElement.addClass("wrong");
          correctOptionEl?.addClass("correct");
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

    answersElement.appendChild(this.progressBarService.getElement());
    this.progressBarService.setValue(this.blitzService.getProgress());

    const blitzNext = contentEl.createEl("div");
    blitzNext.addClass("memodack___blitz__next");

    nextButtonEl = blitzNext.createEl("button");
    nextButtonEl.setText("Next");
    nextButtonEl.disabled = true;

    nextButtonEl.addEventListener("click", () => {
      this.createBlitz(id + 1);
    });
  }

  private createQuestionElement(question: string): void {
    const { contentEl } = this;
    const questionH2Element = contentEl.createEl("h2");
    questionH2Element.setText(question);
    questionH2Element.addClass("memodack___blitz__question");
  }

  private createTextElement(text: string): void {
    const { contentEl } = this;
    const questionH2Element = contentEl.createEl("div");
    questionH2Element.setText(text);
    questionH2Element.addClass("memodack___blitz__text");
  }
}
