import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { blogSchema } from '@/schema/blog';

export interface BlogPost {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  readingTime: number;
}

/**
 * Calculate reading time in minutes
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Get all blog posts from content directory
 */
export function getAllBlogPosts(): BlogPost[] {
  try {
    const contentDir = path.join(process.cwd(), 'src/content');
    const files = fs.readdirSync(contentDir);

    const posts = files
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        const { success, data: validatedData } = blogSchema.safeParse(data);

        if (!success) {
          console.error(`Invalid frontmatter in ${file}`);
          return null;
        }

        return {
          ...validatedData,
          slug: file.replace('.md', ''),
          // Set a default description if none exists
          description:
            validatedData.description || 'Read more about this topic...',
          readingTime: calculateReadingTime(content),
        };
      })
      .filter(Boolean) as BlogPost[];

    // Sort by date, newest first
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error getting blog posts:', error);
    return [];
  }
}
