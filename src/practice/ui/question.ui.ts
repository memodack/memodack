export interface IQuestionUI {
  create(text: string): void;
}

export class QuestionUI implements IQuestionUI {
  constructor(private readonly contentEl: HTMLElement) {}

  create(text: string): void {
    const questionH2Element = this.contentEl.createEl("h2");
    questionH2Element.setText(text);
    questionH2Element.addClass("memodack___quest__question");
  }
}
