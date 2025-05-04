import { App, MarkdownView, Notice } from 'obsidian';
import { IPart, IPartsService } from './parts.service';

import { BlitzModalService } from './blitz-modal.service';
import { icon } from './icon';

export interface IRibbonIconService {
  id: string;
  title: string;
  callback(): Promise<void>;
}

export class RibbonIconService implements IRibbonIconService {
  id = icon.id;
  title = icon.title;

  private app: App;
  private partsService: IPartsService;
  private blitzModalService: BlitzModalService;

  constructor(
    app: App,
    partsService: IPartsService,
    blitzModalService: BlitzModalService,
  ) {
    this.app = app;
    this.partsService = partsService;
    this.blitzModalService = blitzModalService;
  }

  callback = async (): Promise<void> => {
    const isReadingMode =
      this.app.workspace.getActiveViewOfType(MarkdownView)?.getMode() ===
      'preview';

    if (!isReadingMode) {
      new Notice('Only in Reading Mode!');
      return;
    }

    let parts: IPart[] = [];

    parts = this.partsService.getSelectedParts();

    if (!parts.length) {
      parts = await this.partsService.getParts();
    }

    if (!parts.length) {
      new Notice('No parts provided!');
      return;
    }

    if (parts.length < 4) {
      new Notice('At least 4 parts required!');
      return;
    }

    this.blitzModalService.setParts(parts);
    this.blitzModalService.open();
  };
}
