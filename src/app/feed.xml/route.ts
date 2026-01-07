import { getAllBlogPosts } from '@/utils/get-blog-posts';

export async function GET() {
  const posts = getAllBlogPosts();
  const siteUrl = 'https://sarg.am';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sargam Poudel</title>
    <description>I build things - writing about tech and life</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description || post.title}]]></description>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
