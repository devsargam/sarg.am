'use client';

import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import { Link } from 'next-view-transitions';
interface BlogLink {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

const blogLinks: BlogLink[] = [
  { title: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
];

export function BlogNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 mb-6 md:mb-8 border-b border-[var(--foreground)]/10">
      {blogLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`pb-2 -mb-px flex items-center gap-2 transition-colors ${
            pathname === link.href
              ? 'border-b-2 border-[var(--foreground)] text-[var(--foreground)]'
              : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]'
          }`}
        >
          {link.icon}
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
