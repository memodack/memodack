export interface IHelpTextUI {
  create(text: string | null): void;
}

export class HelpTextUI implements IHelpTextUI {
  constructor(private readonly contentEl: HTMLElement) {}

  create(text: string | null): void {
    if (!text) {
      return;
    }

    const questionH2Element = this.contentEl.createEl("div");
    questionH2Element.setText(text);
    questionH2Element.addClass("memodack___quest__text");
  }
}
