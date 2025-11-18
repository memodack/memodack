import { type App, Modal } from "obsidian";
import { inject, singleton } from "tsyringe";
import { ETextTruncate } from "../types";
import type { IBlitzService } from "./blitz.service";
import type { IConductorService } from "./conductor.service";
import type { IPart } from "./parts.service";
import type { IProgressBarService } from "./progress-bar.service";
import type { ISettingsService } from "./settings.service";
import type { ITextService } from "./text.service";

export interface IBlitzModalService {
  setParts(parts: IPart[]): void;
  open(): void;
}

@singleton()
export class BlitzModalService extends Modal implements IBlitzModalService {
  private parts: IPart[] = [];

  constructor(
    @inject("app") app: App,
    @inject("IBlitzService") private readonly blitzService: IBlitzService,
    @inject("IProgressBarService")
    private readonly progressBarService: IProgressBarService,
    @inject("IConductorService")
    private readonly conductorService: IConductorService,
    @inject("ITextService") private readonly textService: ITextService,
    @inject("ISettingsService") private readonly settingsService: ISettingsService,
  ) {
    super(app);
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

    /**
     * Image
     */
    const imageUrl = blitz?.imageUrl;

    if (imageUrl) {
      this.createImageElement(imageUrl);
    }

    /**
     * Question
     */
    this.createQuestionElement(blitz.question);

    if (blitz.question !== blitz.text && blitz.text) {
      this.createTextElement(blitz.text);
    }

    void this.conductorService.playValue(blitz.question);

    let nextButtonEl: HTMLButtonElement | undefined;
    let correctOptionEl: HTMLButtonElement | undefined;

    /**
     * Answers
     */
    const answersButtons: HTMLButtonElement[] = [];

    const answersElement = contentEl.createEl("div");
    answersElement.addClass("memodack___blitz__answers");

    blitz.answers.forEach((item, index) => {
      const answerButtonElement = answersElement.createEl("button");

      if (blitz.correctAnswerId === index) {
        correctOptionEl = answerButtonElement;
      }

      answersButtons.push(answerButtonElement);

      /**
       * Text truncate
       */
      const textTruncatePosition = this.settingsService.getTextTruncate();

      let answerText = item;

      if (textTruncatePosition === ETextTruncate.Disabled) {
        answerButtonElement.setText(answerText);
      } else {
        const dividerSymbol = ";";

        if (answerText.includes(dividerSymbol)) {
          answerText = answerText
            .split(dividerSymbol)
            .map((t) => this.textService.truncate(t, textTruncatePosition))
            .join(`${dividerSymbol} `);
          answerButtonElement.setText(answerText);
        } else {
          answerText = answerText
            .split(" ")
            .map((t) => this.textService.truncate(t, textTruncatePosition))
            .join(" ");

          answerButtonElement.setText(answerText);
        }
      }

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

  private createImageElement(src: string) {
    const { contentEl } = this;
    const img = contentEl.createEl("img");
    img.setAttr("src", src);
    img.addClass("memodack___blitz__image");
  }
}
