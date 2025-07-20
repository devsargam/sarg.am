'use client';

import Markdown from 'markdown-to-jsx';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose prose-slate max-w-none dark:prose-invert text-white dark:text-gray-300 hyphens-auto">
      <Markdown>{content}</Markdown>
    </article>
  );
}
