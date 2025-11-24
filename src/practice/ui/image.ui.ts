export interface IImageUI {
  create(src: string | null): void;
}

export class ImageUI implements IImageUI {
  constructor(private readonly contentEl: HTMLElement) {}

  create(src: string | null): void {
    if (!src) {
      return;
    }

    const img = this.contentEl.createEl("img");
    img.setAttr("src", src);
    img.addClass("memodack___quest__image");
  }
}
