'use client';

import Markdown from 'markdown-to-jsx';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="markdown-content max-w-3xl mx-auto text-base md:text-lg">
      <Markdown
        options={{
          forceBlock: true,
          overrides: {
            p: {
              component: ({ children }) => (
                <p className="mb-7 leading-[1.8] opacity-90">{children}</p>
              ),
            },
            h1: {
              component: ({ children }) => (
                <h1 className="text-3xl font-bold mt-12 mb-6 tracking-tight">{children}</h1>
              ),
            },
            h2: {
              component: ({ children }) => (
                <h2 className="text-2xl font-bold mt-10 mb-4 tracking-tight">{children}</h2>
              ),
            },
            h3: {
              component: ({ children }) => (
                <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>
              ),
            },
            blockquote: {
              component: ({ children }) => (
                <blockquote className="border-l-[3px] border-[var(--foreground)]/30 pl-6 my-8 italic opacity-80">
                  {children}
                </blockquote>
              ),
            },
            ul: {
              component: ({ children }) => (
                <ul className="list-disc pl-6 mb-7 space-y-2">{children}</ul>
              ),
            },
            ol: {
              component: ({ children }) => (
                <ol className="list-decimal pl-6 mb-7 space-y-2">{children}</ol>
              ),
            },
            li: {
              component: ({ children }) => (
                <li className="leading-[1.8] opacity-90">{children}</li>
              ),
            },
            a: {
              component: ({ children, href }) => (
                <a
                  href={href}
                  className="underline underline-offset-[3px] decoration-[var(--foreground)]/40 hover:decoration-[var(--foreground)] transition-colors"
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              ),
            },
            strong: {
              component: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
            },
            code: {
              component: ({ children }) => (
                <code className="bg-[var(--foreground)]/10 px-1.5 py-0.5 rounded text-[0.9em]">
                  {children}
                </code>
              ),
            },
            pre: {
              component: ({ children }) => (
                <pre className="bg-[var(--foreground)]/5 p-4 rounded-lg my-8 overflow-x-auto">
                  {children}
                </pre>
              ),
            },
            hr: {
              component: () => (
                <hr className="border-none h-px bg-[var(--foreground)]/10 my-12" />
              ),
            },
            img: {
              component: ({ src, alt }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={alt || ''} className="rounded-lg my-8" />
              ),
            },
          },
        }}
      >
        {content}
      </Markdown>
    </article>
  );
}
