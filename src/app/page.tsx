import BlogSection from '@/components/blog-section';
import GetInTouch from '@/components/get-in-touch';
import Introduction from '@/components/introduction';
import ProofOfWork from '@/components/proof-of-work';
import WorkExperience from '@/components/work-experience';

export default function Home() {
  return (
    <main className="flex flex-col gap-y-8 justify-center items-start mx-auto">
      {/* Introduction Section */}
      <Introduction />
      {/* Proof of work Section */}
      <ProofOfWork />
      {/* Experience Section */}
      <WorkExperience />
      {/* Blogs Section */}
      <BlogSection />
      {/* Footer Section */}
      <hr className="border-zinc-900 dark:border-zinc-800 border w-full" />
      <GetInTouch />
      {/* <FiberWrapper /> */}
    </main>
  );
}
