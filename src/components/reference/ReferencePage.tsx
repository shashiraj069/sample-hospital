import { useEffect } from 'react';
import parse, { attributesToProps, domToReact, Element, type DOMNode, type HTMLReactParserOptions } from 'html-react-parser';
import { Button } from '@/components/ui/button';
import pages from '@/data/reference-pages.json';
import { initializeReference } from './interactions';

export function referencePath(path: string) {
  return path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`;
}

export function referenceHead(path: string) {
  const page = pages[referencePath(path) as keyof typeof pages];
  const title = page?.title ?? 'Page not found | Sarvdrishti Eye Hospital';
  const description = page?.description ?? 'Eye hospitals in Patna, Gaya and Hajipur.';
  return { meta: [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] };
}

const options: HTMLReactParserOptions = {
  replace(node) {
    if (!(node instanceof Element)) return;
    if (node.name === 'button') {
      const props = attributesToProps(node.attribs);
      return <Button {...props} variant="reference" size="reference">{domToReact(node.children as DOMNode[], options)}</Button>;
    }
    if (node.name === 'a' && node.attribs['class']?.split(' ').includes('btn')) {
      return <Button asChild variant="reference" size="reference"><a {...attributesToProps(node.attribs)}>{domToReact(node.children as DOMNode[], options)}</a></Button>;
    }
    return undefined;
  },
};

export function ReferencePage({ path }: { path: string }) {
  const page = pages[referencePath(path) as keyof typeof pages];
  useEffect(() => {
    if (!page) return;
    document.body.className = page.bodyClass;
    document.documentElement.classList.add('js');
    const cleanup = initializeReference();
    return () => {
      cleanup();
      document.body.className = '';
      document.documentElement.classList.remove('js');
    };
  }, [page]);
  if (!page) return <main className="wrap section"><h1>Page not found</h1><a href="/">Return to Sarvdrishti Eye Hospital</a></main>;
  return <div className={page.bodyClass}>{parse(page.html, options)}</div>;
}