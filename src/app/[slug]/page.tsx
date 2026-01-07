import { Suspense } from 'react';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { BlogNavigation } from '@/components/blog-navigation';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { beautifyDate } from '@/utils/beautify-date';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const blogSchema = z.object({
  title: z.string(),
  date: z.string(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
});

async function getPost(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'src/content', `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const { success, data: validatedData, error } = blogSchema.safeParse(data);

    if (!success) {
      console.error(data);
      throw new Error('Invalid data');
    }

    return { ...validatedData, content };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'src/content');

  try {
    const files = fs.readdirSync(contentDir);

    return files
      .filter((file) => file.endsWith('.md'))
      .map((file) => ({
        slug: file.replace(/\.md$/, ''),
      }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    return notFound();
  }

  return {
    openGraph: {
      title: params.slug,
      description: post.title,
      images: [
        {
          url: `/og-image/${params.slug}`,
        },
      ],
    },
  };
}

export default async function BlogPost(props: PageProps) {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    return notFound();
  }

  const title = post.title;
  const date = beautifyDate(post.date);

  return (
    <main className="mx-auto py-8 max-w-3xl">
      <BlogNavigation />
      <header className="mb-12">
        <h1 className="font-bold text-3xl md:text-4xl tracking-tight mb-3 text-[var(--foreground)]">
          {title}
        </h1>
        <p className="text-[var(--foreground)]/50 text-sm">{date}</p>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <MarkdownRenderer content={post.content} />
      </Suspense>
    </main>
  );
}
