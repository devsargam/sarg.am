import { getAllBlogPosts } from '@/utils/get-blog-posts';
import type { BlogPost } from '@/utils/get-blog-posts';
import { Link } from 'next-view-transitions';
import { beautifyDate } from '@/utils/beautify-date';

// Get blog posts at build time
const blogPosts = getAllBlogPosts();

// Blog card component
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group py-3 flex justify-between items-baseline gap-4 border-b border-[var(--foreground)]/5 last:border-0 transition-colors"
    >
      <span 
        className="font-medium group-hover:text-[var(--foreground)]/70 transition-colors"
        style={{ viewTransitionName: `post-${post.slug}` }}
      >
        {post.title}
      </span>
      <span className="text-xs text-[var(--foreground)]/40 shrink-0">
        {beautifyDate(post.date)}
      </span>
    </Link>
  );
}

function BlogSection() {
  return (
    <section className="flex flex-col text-[var(--foreground)]">
      <h2 className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider mb-4">
        Writing
      </h2>

      {blogPosts.length > 0 ? (
        <div className="flex flex-col">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--foreground)]/50 text-sm">
          No posts yet...
        </p>
      )}
    </section>
  );
}

export default BlogSection;
