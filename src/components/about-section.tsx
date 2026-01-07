'use client';

import React, { useState } from 'react';
import { experiences, links } from '@/data';

function AboutSection() {
  const [showAllLinks, setShowAllLinks] = useState(false);
  const allLinks = links.filter((el) => !el?.hidden);
  const visibleLinks = showAllLinks ? allLinks : allLinks.slice(0, 4);
  const hasMoreLinks = allLinks.length > 4;

  return (
    <div className="flex flex-col gap-y-6 text-[var(--foreground)]">
      {/* Work Experience */}
      <div>
        <h2 className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider mb-3">
          Experience
        </h2>
        <div className="space-y-3">
          {experiences.slice(0, 3).map((exp, index) => (
            <div key={index} className="flex justify-between items-baseline gap-4">
              <div className="text-sm">
                <span className="font-medium">{exp.company}</span>
                <span className="text-[var(--foreground)]/50"> · {exp.position}</span>
              </div>
              <span className="text-xs text-[var(--foreground)]/40 shrink-0">
                {exp.startDate} - {exp.endDate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Open Source */}
      <div>
        <h2 className="text-xs font-medium text-[var(--foreground)]/50 uppercase tracking-wider mb-3">
          Open Source
        </h2>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {visibleLinks.map((link, index) => (
            <span key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
              >
                {link.name.replace(/<[^>]*>/g, '').split(' ').slice(0, 3).join(' ')}
              </a>
              {index < visibleLinks.length - 1 && (
                <span className="text-[var(--foreground)]/30 ml-2">·</span>
              )}
            </span>
          ))}
          {hasMoreLinks && (
            <button
              onClick={() => setShowAllLinks(!showAllLinks)}
              className="text-sm text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-colors ml-1"
            >
              {showAllLinks ? '← show less' : `+${allLinks.length - 4} more`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
