import { IActionsService } from './actions.service';

export interface IMppService {
  postProcessor(element: HTMLElement): void;
}

export class MppService implements IMppService {
  private actionsService: IActionsService;

  constructor(actionsService: IActionsService) {
    this.actionsService = actionsService;
  }

  postProcessor = (element: HTMLElement): void => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

    const nodesToReplace = [];
    let node;

    while ((node = walker.nextNode())) {
      if (node?.nodeValue && node.nodeValue.match(/\{.*?\|.*?\}/)) {
        nodesToReplace.push(node);
      }
    }

    if (!nodesToReplace.length) {
      return;
    }

    nodesToReplace.forEach((node) => {
      if (!node?.nodeValue) {
        return;
      }

      const fragment = document.createDocumentFragment();

      const parts = node.nodeValue.split(/(\{.*?\|.*?\})/);

      parts.forEach((part) => {
        const match = part.match(/\{(.*?)\|(.*?)\}/);

        if (match) {
          if (!match?.length || !match[1] || !match[2]) {
            return;
          }

          const value = match[1];
          const translation = match[2];

          const span = createEl('span', {
            cls: 'memodack___syntax',
            text: value,
            attr: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'data-translation': match[2],
            },
          });

          span.onClickEvent(() => this.actionsService.play(value, translation));

          fragment.appendChild(span);
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      if (!node.parentNode) {
        return;
      }

      node.parentNode.replaceChild(fragment, node);
    });
  };
}
