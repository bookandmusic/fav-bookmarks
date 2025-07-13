/* eslint-disable @typescript-eslint/no-explicit-any */

import * as parse5 from 'parse5';

import { BookmarkNode } from '@/types/bookmark';
import { CateType } from '@/types/category';

type P5Node = {
  nodeName: string;
  tagName?: string;
  attrs?: { name: string; value: string }[];
  childNodes?: P5Node[];
  value?: string;
};

interface Context {
  index: number;
  nodes: P5Node[];
}

export function parseBookmarkHTML(html: string): BookmarkNode[] {
  const document = parse5.parse(html) as any;
  const htmlNode = findNode(document.childNodes, 'html');
  const body = htmlNode && findNode(htmlNode.childNodes || [], 'body');
  const dl = body && findNode(body.childNodes || [], 'dl');
  if (!dl) return [];

  return parseDL(dl);
}

function parseDL(dl: P5Node, parentNode?: BookmarkNode): BookmarkNode[] {
  const result: BookmarkNode[] = [];
  let currentNode: BookmarkNode | undefined = undefined;
  const context: Context = { index: 0, nodes: dl.childNodes || [] };

  while (context.index < context.nodes.length) {
    const node = context.nodes[context.index++];

    if (isTag(node, 'dt')) {
      const h3 = findNode(node.childNodes, 'h3');
      const a = findNode(node.childNodes, 'a');
      const dl = findNode(node.childNodes, 'dl');
      const dd = peekTag(context, 'dd');

      if (h3) {
        currentNode = {
          name: getText(h3),
          isPublic: true,
          type: CateType.BookMark,
          bookmarks: [],
        };
        result.push(currentNode);
      } else if (a && parentNode) {
        const description = dd ? getText(dd) : '';
        if (dd) context.index++;

        parentNode.bookmarks.push({
          title: getText(a),
          url: getAttribute(a, 'href') || '',
          icon: getAttribute(a, 'icon') || '',
          isPublic: true,
          description,
        });
      }
      if (dl && currentNode) {
        currentNode.children = parseDL(dl, currentNode);
      }
    }

    if (isTag(node, 'dl') && currentNode) {
      currentNode.children = parseDL(node);
    }
  }

  return result;
}

function isTag(node: P5Node | undefined, tagName: string): node is P5Node {
  return !!node && node.nodeName === tagName;
}

function findNode(
  nodes: P5Node[] | undefined,
  tag: string
): P5Node | undefined {
  return nodes?.find((n) => isTag(n, tag)) || undefined;
}

function peekTag(context: Context, tag: string): P5Node | undefined {
  return isTag(context.nodes[context.index], tag)
    ? context.nodes[context.index]
    : undefined;
}

function getAttribute(element: P5Node, name: string): string | undefined {
  return element.attrs?.find((attribute) => attribute.name === name)?.value;
}

function getText(element: P5Node): string {
  const textNode = element.childNodes?.find((n) => n.nodeName === '#text');
  return (textNode?.value || '').trim();
}
