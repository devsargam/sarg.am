import { Suspense } from 'react';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { BlogNavigation } from '@/components/blog-navigation';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { beautifyDate } from '@/utils/beautify-date';
import { getAllBlogPosts } from '@/utils/get-blog-posts';
import { Link } from 'next-view-transitions';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

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

    return { 
      ...validatedData, 
      content,
      readingTime: calculateReadingTime(content),
    };
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

const siteUrl = 'https://sarg.am';

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    return notFound();
  }

  const description = post.description || `${post.title} - by Sargam Poudel`;

  return {
    title: `${post.title} | Sargam Poudel`,
    description,
    alternates: {
      canonical: `${siteUrl}/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date,
      url: `${siteUrl}/${params.slug}`,
      images: [
        {
          url: `/og-image/${params.slug}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
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
  const readingTime = post.readingTime;

  const allPosts = getAllBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <main className="mx-auto max-w-xl">
      <BlogNavigation />
      <header className="mb-8 md:mb-12">
        <h1 
          className="font-bold text-3xl md:text-4xl tracking-tight mb-3 text-[var(--foreground)]"
          style={{ viewTransitionName: `post-${params.slug}` }}
        >
          {title}
        </h1>
        <p className="text-[var(--foreground)]/50 text-sm">
          {date} · {readingTime} min read
        </p>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <MarkdownRenderer content={post.content} />
      </Suspense>

      {/* Previous / Next navigation */}
      <nav className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-[var(--foreground)]/10 flex justify-between gap-4">
        {prevPost ? (
          <Link
            href={`/${prevPost.slug}`}
            className="flex items-center gap-2 text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="truncate">{prevPost.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextPost ? (
          <Link
            href={`/${nextPost.slug}`}
            className="flex items-center gap-2 text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors text-right"
          >
            <span className="truncate">{nextPost.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </main>
  );
}
