import { getAllBlogPosts } from '@/utils/get-blog-posts';
import BookIcon from './icons/book-icon';
import type { BlogPost } from '@/utils/get-blog-posts';
import { Link } from 'next-view-transitions';

// Get blog posts at build time
const blogPosts = getAllBlogPosts();

// Blog card component for better readability
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50 rounded-md py-3 w-full hover:bg-gray-50/50 transition-all duration-150 flex flex-col px-3"
    >
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row items-center gap-2">
          <BookIcon className="text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          <span className="font-bold group-hover:text-black dark:group-hover:text-white">
            {post.title}
          </span>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {post.readingTime} min read
        </span>
      </div>
    </Link>
  );
}

function BlogSection() {
  return (
    <section className="flex flex-col gap-y-2 text-black dark:text-white w-full">
      <div className="mb-2">
        <h2 className="font-bold text-2xl md:text-4xl tracking-tight">Blogs</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          My thoughts, ideas, and insights about development, design, and more
        </p>
      </div>

      {blogPosts.length > 0 ? (
        <div className="flex flex-col w-full mt-2 gap-y-2">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-gray-600 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-md p-6 text-center">
          I haven&apos;t written any blogs yet but I do plan to write some
          soon...
        </div>
      )}
    </section>
  );
}

export default BlogSection;
