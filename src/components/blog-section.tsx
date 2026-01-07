import { getAllBlogPosts } from '@/utils/get-blog-posts';
import { BlogList } from '@/components/blog-list';

// Get blog posts at build time
const blogPosts = getAllBlogPosts();

function BlogSection() {
  return (
    <section className="flex flex-col text-[var(--foreground)]">
      <h2 className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider mb-3">
        Writing
      </h2>

      {blogPosts.length > 0 ? (
        <BlogList posts={blogPosts} />
      ) : (
        <p className="text-[var(--foreground)]/50 text-sm">
          No posts yet...
        </p>
      )}
    </section>
  );
}

export default BlogSection;
