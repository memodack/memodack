export interface IAnswersContainerUI {
  create(): void;
  getElement(): HTMLDivElement;
  appendChild(node: Node): void;
}

export class AnswersContainerUI implements IAnswersContainerUI {
  private el!: HTMLDivElement;

  constructor(private readonly contentEl: HTMLElement) {}

  create(): void {
    this.el = this.contentEl.createEl("div");
    this.el.addClass("memodack___quest__answers");
  }

  getElement(): HTMLDivElement {
    return this.el;
  }

  appendChild(node: Node): void {
    this.el.appendChild(node);
  }
}
