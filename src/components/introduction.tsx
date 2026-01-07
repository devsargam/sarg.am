import Image from 'next/image';
import React from 'react';

function Introduction() {
  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-2 text-[var(--foreground)]">
          Sargam Poudel
        </h1>
        <p className="text-[var(--foreground)]/60">
          I tinker around with my beloved laptop
        </p>
      </div>
      <div>
        <Image
          src="https://avatars.githubusercontent.com/u/76874341?v=4"
          alt="Sargam's Photo"
          height={200}
          width={200}
          className="object-cover rounded-full border-4 border-[var(--foreground)]/20 sepia-[0.2] saturate-[0.9] contrast-[0.95] brightness-[1.02]"
        />
      </div>
    </div>
  );
}

export default Introduction;
