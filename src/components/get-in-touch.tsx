import React from 'react';

function GetInTouch() {
  return (
    <div className="flex flex-col gap-y-4 text-[var(--foreground)] w-full">
      {/* <h2 className="font-bold text-2xl md:text-4xl tracking-tight">
        Get In Touch
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        If you are interested in working with me, feel free to reach out to me
      </p> */}
      <Footer />
    </div>
  );
}

import { GithubIcon, Mail, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: <GithubIcon className="w-5 h-5" />,
    href: 'https://github.com/devsargam',
    label: 'GitHub',
  },
  {
    icon: <Mail className="w-5 h-5" />,
    href: 'mailto:sargampoudel100@gmail.com',
    label: 'Email',
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    href: 'https://www.linkedin.com/in/devsargam',
    label: 'LinkedIn',
  },
  {
    icon: <Twitter className="w-5 h-5" />,
    href: 'https://twitter.com/sargampoudel',
    label: 'Twitter',
  },
];

function Footer() {
  return (
    <footer>
      <div className="flex justify-center space-x-6">
        {socialLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-all duration-150 hover:scale-110"
            aria-label={link.label}
          >
            {link.icon}
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-[var(--foreground)]/50">
        © {new Date().getFullYear()} Sargam Poudel. All rights reserved.
      </div>
      <div className="mt-4 text-center text-sm">
        Made with ❤️ by Sargam Poudel
      </div>
    </footer>
  );
}

export default GetInTouch;
