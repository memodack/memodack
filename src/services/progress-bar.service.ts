export interface IProgressBarService {
  create(contentEl: HTMLElement, max: number, value: number): void;
  setMax(max: number): void;
  setValue(value: number): void;
  getValue(): number;
  getElement(): HTMLProgressElement;
}

export class ProgressBarService implements IProgressBarService {
  private _progressElement: HTMLProgressElement | null = null;

  create(contentEl: HTMLElement, max: number, value: number): void {
    this._progressElement = contentEl.createEl('progress');
    this._progressElement.addClass('memodack___blitz__progress');

    this.setMax(max);
    this.setValue(value);
  }

  setMax(max: number): void {
    this.progressElement.max = max;
  }

  setValue(value: number): void {
    this.progressElement.value = value;
  }

  getValue(): number {
    return this.progressElement.value;
  }

  getElement(): HTMLProgressElement {
    return this.progressElement;
  }

  private get progressElement(): HTMLProgressElement {
    if (!this._progressElement) {
      throw new Error('The progress element has not been created.');
    }

    return this._progressElement;
  }
}

export const progressBarService = new ProgressBarService();
