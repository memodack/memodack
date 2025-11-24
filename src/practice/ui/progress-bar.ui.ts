export interface IProgressBarUI {
  create(max: number, value: number): void;
  setMax(max: number): void;
  setValue(value: number): void;
  getElement(): HTMLProgressElement;
}

export class ProgressBarUI implements IProgressBarUI {
  private el!: HTMLProgressElement;

  constructor(private readonly contentEl: HTMLElement) {}

  create(max: number, value: number): void {
    this.el = this.contentEl.createEl("progress");
    this.el.addClass("memodack___quest__progress");

    this.el.max = max;
    this.el.value = value;
  }

  setMax(max: number): void {
    if (!this.el) {
      return;
    }

    this.el.max = max;
  }

  setValue(value: number): void {
    this.el.value = value;
  }

  getElement(): HTMLProgressElement {
    return this.el;
  }

  getValue(): number {
    return this.el.value;
  }
}
