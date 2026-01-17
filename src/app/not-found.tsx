import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="relative">
        <h1 className="text-[8rem] md:text-[12rem] font-bold text-[var(--foreground)]/5 select-none leading-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-2">
            <p className="text-lg md:text-xl font-medium text-[var(--foreground)]">
              Page not found
            </p>
            <p className="text-sm text-[var(--foreground)]/50">
              The page you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="mt-8 px-5 py-2.5 text-sm font-medium text-[var(--foreground)] border border-[var(--foreground)]/20 rounded-lg hover:bg-[var(--foreground)]/5 hover:border-[var(--foreground)]/30 transition-all duration-200"
      >
        Go back home
      </Link>
    </div>
  );
}
