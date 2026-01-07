import React from 'react';
import { GithubIcon, Mail, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: <GithubIcon className="w-4 h-4" />,
    href: 'https://github.com/devsargam',
    label: 'GitHub',
  },
  {
    icon: <Mail className="w-4 h-4" />,
    href: 'mailto:sargampoudel100@gmail.com',
    label: 'Email',
  },
  {
    icon: <Linkedin className="w-4 h-4" />,
    href: 'https://www.linkedin.com/in/devsargam',
    label: 'LinkedIn',
  },
  {
    icon: <Twitter className="w-4 h-4" />,
    href: 'https://twitter.com/sargampoudel',
    label: 'Twitter',
  },
];

function GetInTouch() {
  return (
    <footer className="pt-8 border-t border-[var(--foreground)]/5">
      <div className="flex justify-center gap-5">
        {socialLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors"
            aria-label={link.label}
          >
            {link.icon}
          </Link>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-[var(--foreground)]/30">
        © {new Date().getFullYear()} Sargam Poudel
      </p>
    </footer>
  );
}

export default GetInTouch;
