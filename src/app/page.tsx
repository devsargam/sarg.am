import BlogSection from '@/components/blog-section';
import GetInTouch from '@/components/get-in-touch';
import Introduction from '@/components/introduction';
import ProofOfWork from '@/components/proof-of-work';
import WorkExperience from '@/components/work-experience';

export default function Home() {
  return (
    <main className="flex flex-col gap-y-12 md:gap-y-16 justify-center items-start mx-auto">
      {/* Introduction Section */}
      <Introduction />
      {/* Proof of work Section */}
      <ProofOfWork />
      {/* Experience Section */}
      <WorkExperience />
      {/* Blogs Section */}
      <BlogSection />
      {/* Footer Section */}
      {/*<div className="w-16 h-px bg-zinc-200 dark:bg-zinc-800 mx-auto my-4" />*/}
      <GetInTouch />
    </main>
  );
}
