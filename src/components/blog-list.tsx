'use client';

import { useState } from 'react';
import type { BlogPost } from '@/utils/get-blog-posts';
import { Link } from 'next-view-transitions';
import { beautifyDate } from '@/utils/beautify-date';

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

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [showAll, setShowAll] = useState(false);
  const visiblePosts = showAll ? posts : posts.slice(0, 6);
  const hasMore = posts.length > 6;

  return (
    <div className="flex flex-col">
      {visiblePosts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-[var(--foreground)]/40 hover:text-[var(--foreground)]/60 transition-colors mt-3 text-left"
        >
          {showAll ? '← show less' : `show ${posts.length - 6} more`}
        </button>
      )}
    </div>
  );
}
