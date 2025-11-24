export interface INextButtonUI {
  create(): void;
  enable(): void;
  disable(): void;
  onClick(callback: () => void): void;
}

export class NextButtonUI implements INextButtonUI {
  private el!: HTMLButtonElement;

  constructor(private readonly contentEl: HTMLElement) {}

  create(): void {
    const div = this.contentEl.createEl("div");
    div.addClass("memodack___quest__next");

    this.el = div.createEl("button");
    this.el.setText("Next");
  }

  enable(): void {
    this.el.disabled = false;
  }

  disable(): void {
    this.el.disabled = true;
  }

  onClick(callback: () => void): void {
    this.el.addEventListener("click", () => {
      callback();
    });
  }
}
