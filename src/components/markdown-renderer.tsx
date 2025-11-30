'use client';

import Markdown from 'markdown-to-jsx';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose prose-xl prose-slate dark:prose-invert mx-auto text-gray-700 dark:text-gray-200 prose-p:text-lg prose-p:leading-loose prose-p:my-8 prose-p:text-justify">
      <Markdown>{content}</Markdown>
    </article>
  );
}
