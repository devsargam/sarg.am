'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function Introduction() {
  const [copied, setCopied] = useState(false);
  const email = 'hi@sarg.am';

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-3 items-center">
      <Image
        src="https://avatars.githubusercontent.com/u/76874341?v=4"
        alt="Sargam's Photo"
        height={44}
        width={44}
        className="object-cover rounded-full sepia-[0.2] saturate-[0.9] contrast-[0.95] brightness-[1.02]"
      />
      <div>
        <h1 className="font-semibold text-base text-[var(--foreground)]">
          Sargam Poudel
        </h1>
        <p className="text-[var(--foreground)]/50 text-sm flex items-center gap-1">
          I build things ·{' '}
          <button
            onClick={copyEmail}
            className="inline-flex items-center gap-1 hover:text-[var(--foreground)] transition-colors"
          >
            {email}
            <span className="relative w-3 h-3">
              <Copy 
                className={`w-3 h-3 absolute inset-0 transition-all duration-200 ${
                  copied ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
                }`} 
              />
              <Check 
                className={`w-3 h-3 absolute inset-0 text-green-500 transition-all duration-200 ${
                  copied ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`} 
              />
            </span>
          </button>
        </p>
      </div>
    </div>
  );
}

export default Introduction;
