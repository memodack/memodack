export interface IAnswerButtonUI {
  create(): void;
  getElement(): HTMLButtonElement;
  setText(text: string): void;
  onClick(callback: () => void): void;
  correct(): void;
  wrong(): void;
  disable(): void;
}

export class AnswerButtonUI implements IAnswerButtonUI {
  private el!: HTMLButtonElement;

  constructor(private readonly contentEl: HTMLElement) {}

  create(): void {
    this.el = this.contentEl.createEl("button");
    this.el.setText("Next");
  }

  disable(): void {
    this.el.disabled = true;
  }

  getElement(): HTMLButtonElement {
    return this.el;
  }

  setText(text: string): void {
    this.el.setText(text);
  }

  onClick(callback: () => void): void {
    this.el.addEventListener("click", () => {
      callback();
    });
  }

  correct(): void {
    this.el.addClass("correct");
  }

  wrong(): void {
    this.el.addClass("wrong");
  }
}
