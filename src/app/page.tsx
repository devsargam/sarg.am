import AboutSection from '@/components/about-section';
import BlogSection from '@/components/blog-section';
import GetInTouch from '@/components/get-in-touch';
import Introduction from '@/components/introduction';

export default function Home() {
  return (
    <div className="flex flex-col gap-y-8">
      {/* Introduction - Compact */}
      <Introduction />

      {/* Blog Posts - Main Content */}
      <BlogSection />

      {/* About - Condensed */}
      <AboutSection />

      {/* Footer */}
      <GetInTouch />
    </div>
  );
}
