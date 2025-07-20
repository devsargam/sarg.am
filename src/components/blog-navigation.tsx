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
    <nav className="flex items-center gap-6 mb-8 border-b border-gray-200 dark:border-gray-800">
      {blogLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`pb-2 -mb-px flex items-center gap-2 ${
            pathname === link.href
              ? 'border-b-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          {link.icon}
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
