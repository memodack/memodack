import { inject, singleton } from "tsyringe";
import type { IConductorService } from "./conductor.service";

export interface IMppService {
  getPostProcessor(element: HTMLElement): void;
}

@singleton()
export class MppService implements IMppService {
  constructor(
    @inject("IConductorService")
    private readonly conductorService: IConductorService,
  ) {}

  getPostProcessor = (element: HTMLElement): void => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

    const nodesToReplace = [];
    let node: Node | null;

    while (true) {
      node = walker.nextNode() as Text | null;
      if (!node) break;

      if (node.nodeValue?.match(/\{.*?\|.*?\}/)) {
        nodesToReplace.push(node);
      }
    }

    if (!nodesToReplace.length) {
      return;
    }

    nodesToReplace.forEach((node) => {
      if (!node.nodeValue) {
        return;
      }

      const fragment = document.createDocumentFragment();

      const parts = node.nodeValue.split(/(\{.*?\|.*?\})/);

      parts.forEach((part) => {
        const match = part.match(/\{(.*?)\|(.*?)\}/);

        if (match) {
          if (!match.length || !match[1] || !match[2]) {
            return;
          }

          const value = match[1];
          const translation = match[2];

          const span = createEl("span", {
            cls: "memodack___syntax",
            text: value,
            attr: {
              "data-translation": match[2],
            },
          });

          span.onClickEvent(() => this.conductorService.play(value, translation));

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
